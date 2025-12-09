// Protocol Classification System
export type ProtocolClass = "A" | "B" | "C" | "D" | "E";

export interface ProtocolInfo {
  name: string;
  class: ProtocolClass;
  className: string;
  color: string;
}

// Protocol to Class mapping
export const PROTOCOL_CLASSES: Record<string, ProtocolInfo> = {
  // Class A: Web browsing
  HTTP: { name: "HTTP", class: "A", className: "Web Browsing", color: "hsl(217, 91%, 60%)" },
  HTTPS: { name: "HTTPS", class: "A", className: "Web Browsing", color: "hsl(217, 91%, 60%)" },
  TLS: { name: "TLS", class: "A", className: "Web Browsing", color: "hsl(217, 91%, 60%)" },
  SSL: { name: "SSL", class: "A", className: "Web Browsing", color: "hsl(217, 91%, 60%)" },
  
  // Class B: Streaming
  HLS: { name: "HLS", class: "B", className: "Streaming", color: "hsl(142, 76%, 36%)" },
  MPEG: { name: "MPEG", class: "B", className: "Streaming", color: "hsl(142, 76%, 36%)" },
  RTMP: { name: "RTMP", class: "B", className: "Streaming", color: "hsl(142, 76%, 36%)" },
  
  // Class C: File Transfer
  FTP: { name: "FTP", class: "C", className: "File Transfer", color: "hsl(38, 92%, 50%)" },
  FTPS: { name: "FTPS", class: "C", className: "File Transfer", color: "hsl(38, 92%, 50%)" },
  SFTP: { name: "SFTP", class: "C", className: "File Transfer", color: "hsl(38, 92%, 50%)" },
  TFTP: { name: "TFTP", class: "C", className: "File Transfer", color: "hsl(38, 92%, 50%)" },
  
  // Class D: Messaging
  WSS: { name: "WSS", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  XMPP: { name: "XMPP", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  STP: { name: "STP", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  SMTP: { name: "SMTP", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  SMTPS: { name: "SMTPS", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  IMAP: { name: "IMAP", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  IMAPS: { name: "IMAPS", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  POP3: { name: "POP3", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  POP3S: { name: "POP3S", class: "D", className: "Messaging", color: "hsl(280, 100%, 70%)" },
  
  // Class E: System / Other
  DNS: { name: "DNS", class: "E", className: "System / Other", color: "hsl(0, 72%, 51%)" },
  NTP: { name: "NTP", class: "E", className: "System / Other", color: "hsl(0, 72%, 51%)" },
  ICMP: { name: "ICMP", class: "E", className: "System / Other", color: "hsl(0, 72%, 51%)" },
  DHCP: { name: "DHCP", class: "E", className: "System / Other", color: "hsl(0, 72%, 51%)" },
};

// Port to Protocol mapping for detection
export const PORT_PROTOCOL_MAP: Record<number, string> = {
  // Web browsing
  80: "HTTP",
  443: "HTTPS",
  8080: "HTTP",
  8443: "HTTPS",
  
  // Streaming
  1935: "RTMP",
  554: "RTSP", // RTSP is similar to RTMP for streaming
  
  // File Transfer
  21: "FTP",
  22: "SFTP",
  990: "FTPS",
  69: "TFTP",
  
  // Messaging
  5222: "XMPP",
  5223: "XMPP",
  25: "SMTP",
  587: "SMTP",
  465: "SMTPS",
  143: "IMAP",
  993: "IMAPS",
  110: "POP3",
  995: "POP3S",
  
  // System / Other
  53: "DNS",
  123: "NTP",
  67: "DHCP",
  68: "DHCP",
};

// Get protocol class info
export function getProtocolInfo(protocol: string): ProtocolInfo {
  const upperProtocol = protocol.toUpperCase();
  
  // Check direct mapping
  if (PROTOCOL_CLASSES[upperProtocol]) {
    return PROTOCOL_CLASSES[upperProtocol];
  }
  
  // Check for TLS/SSL in protocol name
  if (upperProtocol.includes("TLS") || upperProtocol.includes("SSL")) {
    return PROTOCOL_CLASSES["TLS"];
  }
  
  // Handle TCP and UDP explicitly
  if (upperProtocol === "TCP" || upperProtocol === "UDP") {
    return {
      name: protocol,
      class: "E",
      className: "System / Other",
      color: "hsl(0, 72%, 51%)",
    };
  }

  // Default to Class E for unknown protocols
  return {
    name: protocol,
    class: "E",
    className: "System / Other",
    color: "hsl(0, 0%, 50%)",
  };
}

// Detect protocol from port and data
export function detectProtocol(port: number, data?: Uint8Array): string {
  // Check port mapping first
  if (PORT_PROTOCOL_MAP[port]) {
    return PORT_PROTOCOL_MAP[port];
  }
  
  // Try to detect from data if available
  if (data && data.length > 0) {
    const dataStr = new TextDecoder("utf-8", { fatal: false }).decode(data.slice(0, Math.min(100, data.length)));
    
    // Check for HTTP
    if (dataStr.includes("HTTP/") || dataStr.includes("GET ") || dataStr.includes("POST ")) {
      return port === 443 ? "HTTPS" : "HTTP";
    }
    
    // Check for TLS/SSL handshake
    if (data[0] === 0x16 && data[1] === 0x03) { // TLS handshake
      // Check if it's WSS (WebSocket Secure)
      if (dataStr.includes("Upgrade: websocket") || dataStr.includes("Sec-WebSocket")) {
        return "WSS";
      }
      return "TLS";
    }
    
    // Check for SMTP (check before FTP since both use 220)
    if (dataStr.includes("220") && (dataStr.includes("SMTP") || dataStr.includes("ESMTP") || dataStr.includes("mail"))) {
      return port === 465 ? "SMTPS" : "SMTP";
    }
    if (dataStr.includes("EHLO") || dataStr.includes("MAIL FROM") || dataStr.includes("RCPT TO") || dataStr.includes("DATA") || dataStr.includes("QUIT")) {
      if (port === 25 || port === 587 || port === 465) {
        return port === 465 ? "SMTPS" : "SMTP";
      }
    }
    
    // Check for FTP
    if (dataStr.includes("FTP") || (dataStr.startsWith("220") && !dataStr.includes("SMTP") && !dataStr.includes("ESMTP"))) {
      return port === 990 ? "FTPS" : "FTP";
    }
    
    // Check for XMPP
    if (dataStr.includes("<?xml") && dataStr.includes("stream")) {
      return "XMPP";
    }
    
    // Check for IMAP
    if (dataStr.includes("* OK") && dataStr.includes("IMAP")) {
      return port === 993 ? "IMAPS" : "IMAP";
    }
    if (dataStr.includes("CAPABILITY") || dataStr.includes("LOGIN") || dataStr.includes("SELECT")) {
      if (port === 993 || port === 143) {
        return port === 993 ? "IMAPS" : "IMAP";
      }
    }
    
    // Check for POP3
    if (dataStr.includes("+OK") && (dataStr.includes("POP3") || dataStr.includes("POP"))) {
      return port === 995 ? "POP3S" : "POP3";
    }
    if (dataStr.includes("USER") || dataStr.includes("PASS") || dataStr.includes("LIST")) {
      if (port === 995 || port === 110) {
        return port === 995 ? "POP3S" : "POP3";
      }
    }
    
    // Check for HLS
    if (dataStr.includes("#EXTM3U") || dataStr.includes("#EXTINF")) {
      return "HLS";
    }
    
    // Check for WebSocket upgrade (WSS)
    if (dataStr.includes("Upgrade: websocket") || dataStr.includes("Sec-WebSocket")) {
      return port === 443 ? "WSS" : "WS";
    }
  }
  
  return "Unknown";
}

