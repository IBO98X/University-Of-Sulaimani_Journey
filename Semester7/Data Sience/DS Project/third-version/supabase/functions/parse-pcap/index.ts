import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PacketData {
  protocol: string;
  source_ip: string;
  dest_ip: string;
  source_port: number;
  dest_port: number;
  packet_size: number;
  timestamp: string;
  info: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { analysisId, fileData, filename } = await req.json();

    console.log(`Processing file: ${filename} for analysis: ${analysisId}`);

    // Decode base64 file data
    const binaryData = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
    
    // Parse pcap file (simplified version)
    const packets = parsePcapFile(binaryData);
    
    console.log(`Parsed ${packets.length} packets from file`);

    // Store traffic data
    if (packets.length > 0) {
      const trafficData = packets.map((packet) => ({
        analysis_id: analysisId,
        ...packet,
      }));

      const { error: trafficError } = await supabaseClient
        .from("traffic_data")
        .insert(trafficData);

      if (trafficError) {
        console.error("Error inserting traffic data:", trafficError);
        throw trafficError;
      }
    }

    // Calculate protocol statistics
    const protocolStats = calculateProtocolStats(packets);
    
    const statsData = protocolStats.map((stat) => ({
      analysis_id: analysisId,
      ...stat,
    }));

    const { error: statsError } = await supabaseClient
      .from("protocol_stats")
      .insert(statsData);

    if (statsError) {
      console.error("Error inserting protocol stats:", statsError);
      throw statsError;
    }

    // Update analysis status
    const { error: updateError } = await supabaseClient
      .from("analyses")
      .update({
        status: "completed",
        total_packets: packets.length,
        completed_date: new Date().toISOString(),
      })
      .eq("id", analysisId);

    if (updateError) {
      console.error("Error updating analysis:", updateError);
      throw updateError;
    }

    console.log(`Analysis ${analysisId} completed successfully`);

    return new Response(
      JSON.stringify({ success: true, packets: packets.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in parse-pcap function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function parsePcapFile(data: Uint8Array): PacketData[] {
  const packets: PacketData[] = [];
  
  // Check for pcap magic number (0xa1b2c3d4 for standard pcap)
  const view = new DataView(data.buffer);
  const magic = view.getUint32(0, true);
  
  if (magic !== 0xa1b2c3d4 && magic !== 0xd4c3b2a1) {
    console.log("Not a standard pcap file, attempting basic parsing");
  }

  // Skip pcap global header (24 bytes)
  let offset = 24;
  let packetNum = 0;

  while (offset < data.length) {
    try {
      if (offset + 16 > data.length) break;

      // Read packet header (16 bytes)
      const timestamp_sec = view.getUint32(offset, true);
      const timestamp_usec = view.getUint32(offset + 4, true);
      const captured_len = view.getUint32(offset + 8, true);
      const original_len = view.getUint32(offset + 12, true);

      offset += 16;

      if (offset + captured_len > data.length) break;

      // Extract basic packet info
      const packetData = data.slice(offset, offset + captured_len);
      const packetInfo = extractPacketInfo(packetData, timestamp_sec, timestamp_usec);
      
      if (packetInfo) {
        packets.push(packetInfo);
      }

      offset += captured_len;
      packetNum++;
    } catch (e) {
      console.error(`Error parsing packet ${packetNum}:`, e);
      break;
    }
  }

  console.log(`Successfully parsed ${packets.length} packets`);
  return packets;
}

function extractPacketInfo(data: Uint8Array, timestamp_sec: number, timestamp_usec: number): PacketData | null {
  try {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    
    // Skip Ethernet header (14 bytes typically)
    let offset = 14;
    if (offset >= data.length) return null;

    // Check IP version
    const versionIHL = data[offset];
    const version = (versionIHL >> 4) & 0x0F;
    
    if (version !== 4) {
      // For simplicity, only handle IPv4
      return {
        protocol: "Unknown",
        source_ip: "0.0.0.0",
        dest_ip: "0.0.0.0",
        source_port: 0,
        dest_port: 0,
        packet_size: data.length,
        timestamp: new Date(timestamp_sec * 1000).toISOString(),
        info: "Non-IPv4 packet",
      };
    }

    // Get protocol
    const ipProtocol = data[offset + 9];
    let protocolName = "Unknown";
    
    switch (ipProtocol) {
      case 1: protocolName = "ICMP"; break;
      case 6: protocolName = "TCP"; break;
      case 17: protocolName = "UDP"; break;
    }

    // Extract source and dest IP
    const srcIP = `${data[offset + 12]}.${data[offset + 13]}.${data[offset + 14]}.${data[offset + 15]}`;
    const dstIP = `${data[offset + 16]}.${data[offset + 17]}.${data[offset + 18]}.${data[offset + 19]}`;

    // Get IHL to find where IP header ends
    const ihl = (versionIHL & 0x0F) * 4;
    let srcPort = 0;
    let dstPort = 0;

    // Extract ports for TCP/UDP
    if ((ipProtocol === 6 || ipProtocol === 17) && offset + ihl + 4 <= data.length) {
      srcPort = view.getUint16(offset + ihl, false);
      dstPort = view.getUint16(offset + ihl + 2, false);
      
      // Enhanced protocol detection by port
      if (dstPort === 80 || srcPort === 80) protocolName = "HTTP";
      else if (dstPort === 443 || srcPort === 443) protocolName = "HTTPS";
      else if (dstPort === 53 || srcPort === 53) protocolName = "DNS";
      else if (dstPort === 22 || srcPort === 22) protocolName = "SFTP";
      else if (dstPort === 21 || srcPort === 21) protocolName = "FTP";
      else if (dstPort === 990 || srcPort === 990) protocolName = "FTPS";
      else if (dstPort === 69 || srcPort === 69) protocolName = "TFTP";
      else if (dstPort === 1935 || srcPort === 1935) protocolName = "RTMP";
      else if (dstPort === 5222 || srcPort === 5222 || dstPort === 5223 || srcPort === 5223) protocolName = "XMPP";
      else if (dstPort === 123 || srcPort === 123) protocolName = "NTP";
      else if (dstPort === 67 || srcPort === 67 || dstPort === 68 || srcPort === 68) protocolName = "DHCP";
      else if (ipProtocol === 6) protocolName = "TCP";
      else if (ipProtocol === 17) protocolName = "UDP";
    }

    return {
      protocol: protocolName,
      source_ip: srcIP,
      dest_ip: dstIP,
      source_port: srcPort,
      dest_port: dstPort,
      packet_size: data.length,
      timestamp: new Date(timestamp_sec * 1000).toISOString(),
      info: `${protocolName} packet`,
    };
  } catch (e) {
    console.error("Error extracting packet info:", e);
    return null;
  }
}

function calculateProtocolStats(packets: PacketData[]) {
  const protocolCounts = new Map<string, { count: number; bytes: number }>();

  packets.forEach((packet) => {
    const existing = protocolCounts.get(packet.protocol) || { count: 0, bytes: 0 };
    protocolCounts.set(packet.protocol, {
      count: existing.count + 1,
      bytes: existing.bytes + packet.packet_size,
    });
  });

  const totalPackets = packets.length;
  const stats = Array.from(protocolCounts.entries()).map(([protocol, data]) => ({
    protocol,
    packet_count: data.count,
    total_bytes: data.bytes,
    percentage: (data.count / totalPackets) * 100,
  }));

  return stats.sort((a, b) => b.packet_count - a.packet_count);
}