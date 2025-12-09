# Network Traffic Analyzer

A modern, web-based PCAP file analyzer with intelligent protocol classification and unlimited packet processing capabilities.

## Features

- **Unlimited Packet Processing**: No packet limits - process files of any size
- **Large File Support**: Handle files up to 1 GB
- **Protocol Classification**: Automatic classification into 5 categories:
  - **Class A (Web Browsing)**: HTTP, HTTPS, TLS/SSL
  - **Class B (Streaming)**: HLS, MPEG, RTMP
  - **Class C (File Transfer)**: FTP, FTPS, SFTP, TFTP
  - **Class D (Messaging)**: WSS, XMPP, STP
  - **Class E (System/Other)**: DNS, NTP, ICMP, DHCP
- **Enhanced Protocol Detection**: Intelligent detection based on ports and packet content
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and visual protocol indicators
- **Interactive Charts**: Visual representation of protocol distribution
- **Detailed Traffic Table**: Comprehensive packet information with classification badges

## Technologies

- **Vite** - Fast build tool
- **TypeScript** - Type-safe development
- **React** - UI framework
- **shadcn-ui** - Modern component library
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization

## Getting Started

### Prerequisites

- Node.js & npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd packet-decoder-web

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Upload a PCAP file (.pcap, .pcapng, or .cap format)
2. Wait for analysis (files up to 1 GB are supported)
3. View protocol distribution and classification
4. Explore detailed packet information in the traffic table

## File Format Support

- Standard PCAP files (.pcap)
- PCAPNG files (.pcapng)
- Legacy CAP files (.cap)

## Protocol Detection

The analyzer uses multiple methods to detect protocols:
- Port-based detection (common ports)
- Content-based detection (packet payload analysis)
- Protocol handshake recognition (TLS/SSL, etc.)

## License

This project is open source and available for use.
