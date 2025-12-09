import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FileUpload from "@/components/FileUpload";
import Navigation from "@/components/Navigation";
import {
  detectProtocol,
  PORT_PROTOCOL_MAP,
} from "@/lib/protocol-classification";

interface TrafficData {
  id: string;
  protocol: string;
  source_ip: string;
  dest_ip: string;
  source_port: number;
  dest_port: number;
  packet_size: number;
  timestamp: string;
  info: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [filename, setFilename] = useState("");

  const handleFileUpload = async (file: File) => {
    setAnalyzing(true);
    setFilename(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const packets = parsePcapFile(data);

      const stats = calculateProtocolStats(packets);

      // Save data to localStorage for persistence
      try {
        localStorage.setItem(
          "networkAnalyzer_data",
          JSON.stringify({
            protocolStats: stats,
            trafficData: packets,
            filename: file.name,
            timestamp: Date.now(),
          })
        );
      } catch (e) {
        console.error("Failed to save data to localStorage:", e);
      }

      // Navigate to first model page with data
      navigate("/models/lr", {
        state: {
          protocolStats: stats,
          trafficData: packets,
          filename: file.name,
        },
      });
    } catch (error) {
      console.error("Error parsing file:", error);
      setAnalyzing(false);
    }
  };

  const parsePcapFile = (data: Uint8Array): TrafficData[] => {
    const packets: TrafficData[] = [];
    const view = new DataView(data.buffer);

    const magic = view.getUint32(0, true);

    // Handle pcapng format (magic: 0x0a0d0d0a)
    if (magic === 0x0a0d0d0a) {
      return parsePcapngFile(data);
    }

    // Handle standard pcap format
    let offset = 24;
    let packetNum = 0;

    while (offset < data.length) {
      try {
        if (offset + 16 > data.length) break;

        const timestamp_sec = view.getUint32(offset, true);
        const timestamp_usec = view.getUint32(offset + 4, true);
        const captured_len = view.getUint32(offset + 8, true);

        offset += 16;
        if (offset + captured_len > data.length) break;

        const packetData = data.slice(offset, offset + captured_len);
        const packetInfo = extractPacketInfo(
          packetData,
          timestamp_sec,
          timestamp_usec,
          packetNum
        );

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

    return packets;
  };

  const parsePcapngFile = (data: Uint8Array): TrafficData[] => {
    const packets: TrafficData[] = [];
    const view = new DataView(data.buffer);
    let offset = 0;
    let packetNum = 0;

    while (offset < data.length) {
      try {
        if (offset + 8 > data.length) break;

        const blockType = view.getUint32(offset, true);
        const blockLength = view.getUint32(offset + 4, true);

        if (blockLength < 12 || offset + blockLength > data.length) break;

        // Enhanced Packet Block (type 6)
        if (blockType === 6) {
          if (offset + 32 > data.length) break;

          const timestamp_high = view.getUint32(offset + 12, true);
          const timestamp_low = view.getUint32(offset + 16, true);
          const captured_len = view.getUint32(offset + 20, true);

          const dataOffset = offset + 28;
          if (dataOffset + captured_len > data.length) break;

          const timestamp_sec = Math.floor(
            (timestamp_high * 0x100000000 + timestamp_low) / 1000000
          );
          const packetData = data.slice(dataOffset, dataOffset + captured_len);
          const packetInfo = extractPacketInfo(
            packetData,
            timestamp_sec,
            0,
            packetNum
          );

          if (packetInfo) {
            packets.push(packetInfo);
            packetNum++;
          }
        }

        offset += blockLength;
      } catch (e) {
        console.error(`Error parsing pcapng block:`, e);
        break;
      }
    }

    return packets;
  };

  const extractPacketInfo = (
    data: Uint8Array,
    timestamp_sec: number,
    timestamp_usec: number,
    packetNum: number
  ): TrafficData | null => {
    try {
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

      let offset = 14;
      if (offset >= data.length) return null;

      const versionIHL = data[offset];
      const version = (versionIHL >> 4) & 0x0f;

      if (version !== 4) {
        return {
          id: `packet-${packetNum}`,
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

      const ipProtocol = data[offset + 9];
      let protocolName = "Unknown";

      switch (ipProtocol) {
        case 1:
          protocolName = "ICMP";
          break;
        case 6:
          protocolName = "TCP";
          break;
        case 17:
          protocolName = "UDP";
          break;
      }

      const srcIP = `${data[offset + 12]}.${data[offset + 13]}.${
        data[offset + 14]
      }.${data[offset + 15]}`;
      const dstIP = `${data[offset + 16]}.${data[offset + 17]}.${
        data[offset + 18]
      }.${data[offset + 19]}`;

      const ihl = (versionIHL & 0x0f) * 4;
      let srcPort = 0;
      let dstPort = 0;

      if (
        (ipProtocol === 6 || ipProtocol === 17) &&
        offset + ihl + 4 <= data.length
      ) {
        srcPort = view.getUint16(offset + ihl, false);
        dstPort = view.getUint16(offset + ihl + 2, false);

        // Enhanced protocol detection
        const packetData = data.slice(offset + ihl);
        const detectedProtocol = detectProtocol(dstPort || srcPort, packetData);

        if (detectedProtocol !== "Unknown") {
          protocolName = detectedProtocol;
        } else {
          // Fallback to port-based detection
          if (dstPort === 80 || srcPort === 80) protocolName = "HTTP";
          else if (dstPort === 443 || srcPort === 443) protocolName = "HTTPS";
          else if (dstPort === 53 || srcPort === 53) protocolName = "DNS";
          else if (dstPort === 22 || srcPort === 22) protocolName = "SFTP";
          else if (dstPort === 21 || srcPort === 21) protocolName = "FTP";
          else if (dstPort === 990 || srcPort === 990) protocolName = "FTPS";
          else if (dstPort === 69 || srcPort === 69) protocolName = "TFTP";
          else if (dstPort === 1935 || srcPort === 1935) protocolName = "RTMP";
          else if (
            dstPort === 5222 ||
            srcPort === 5222 ||
            dstPort === 5223 ||
            srcPort === 5223
          )
            protocolName = "XMPP";
          else if (
            dstPort === 25 ||
            srcPort === 25 ||
            dstPort === 587 ||
            srcPort === 587
          )
            protocolName = "SMTP";
          else if (dstPort === 465 || srcPort === 465) protocolName = "SMTPS";
          else if (dstPort === 143 || srcPort === 143) protocolName = "IMAP";
          else if (dstPort === 993 || srcPort === 993) protocolName = "IMAPS";
          else if (dstPort === 110 || srcPort === 110) protocolName = "POP3";
          else if (dstPort === 995 || srcPort === 995) protocolName = "POP3S";
          else if (dstPort === 123 || srcPort === 123) protocolName = "NTP";
          else if (
            dstPort === 67 ||
            srcPort === 67 ||
            dstPort === 68 ||
            srcPort === 68
          )
            protocolName = "DHCP";
          else if (ipProtocol === 6) protocolName = "TCP";
          else if (ipProtocol === 17) protocolName = "UDP";
        }
      }

      return {
        id: `packet-${packetNum}`,
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
  };

  const calculateProtocolStats = (packets: TrafficData[]) => {
    const protocolCounts = new Map<string, { count: number; bytes: number }>();

    packets.forEach((packet) => {
      const existing = protocolCounts.get(packet.protocol) || {
        count: 0,
        bytes: 0,
      };
      protocolCounts.set(packet.protocol, {
        count: existing.count + 1,
        bytes: existing.bytes + packet.packet_size,
      });
    });

    const totalPackets = packets.length;
    const stats = Array.from(protocolCounts.entries()).map(
      ([protocol, data]) => {
        return {
          protocol,
          packet_count: data.count,
          total_bytes: data.bytes,
          percentage: (data.count / totalPackets) * 100,
        };
      }
    );

    return stats.sort((a, b) => b.packet_count - a.packet_count);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-fade-in">
              <div className="inline-block mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10"></div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent relative">
                    Network Traffic Analyzer
                  </h1>
                </div>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
                Upload your PCAP files to analyze network traffic with
                intelligent protocol classification and detailed insights
              </p>
            </div>

            <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm animate-scale-in hover:shadow-3xl hover:shadow-primary/20 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Upload PCAP File
                </CardTitle>
                <CardDescription className="text-center text-sm sm:text-base mt-2">
                  Supported formats: .pcap (Max size: 1 GB)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <FileUpload onFileSelect={handleFileUpload} />
              </CardContent>
            </Card>

            {analyzing && (
              <Card className="border-2 shadow-xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm mt-6 animate-slide-up">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <div className="absolute inset-0 animate-ping rounded-full border border-primary/30"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        Analyzing {filename}...
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Processing packets (no limit)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 animate-fade-in">
              <Card className="border-2 shadow-xl shadow-blue-500/20 dark:shadow-blue-500/30 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    ∞
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Unlimited Packets
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 shadow-xl shadow-green-500/20 dark:shadow-green-500/30 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    1 GB
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Max File Size
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 shadow-xl shadow-purple-500/20 dark:shadow-purple-500/30 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    5
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Protocol Classes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
