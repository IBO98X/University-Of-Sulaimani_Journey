import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Activity, Globe, Film, FolderOpen, MessageSquare, Settings, Upload, Sparkles, ArrowLeft } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart, Cell } from "recharts";
import { getProtocolInfo } from "@/lib/protocol-classification";
import Navigation from "@/components/Navigation";

interface ProtocolStat {
  protocol: string;
  packet_count: number;
  total_bytes: number;
  percentage: number;
  class?: string;
  className?: string;
}

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

const CLASS_ICONS = {
  A: Globe,
  B: Film,
  C: FolderOpen,
  D: MessageSquare,
  E: Settings,
};

const CLASS_COLORS: Record<string, string> = {
  A: "hsl(217, 91%, 60%)",
  B: "hsl(142, 76%, 36%)",
  C: "hsl(38, 92%, 50%)",
  D: "hsl(280, 100%, 70%)",
  E: "hsl(0, 72%, 51%)",
};

const Statistics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { protocolStats?: ProtocolStat[]; trafficData?: TrafficData[]; filename?: string } | null;

  // Try to get data from state first, then from localStorage
  let protocolStats: ProtocolStat[] = [];
  let trafficData: TrafficData[] = [];
  let filename = "";

  if (state?.protocolStats && state?.trafficData) {
    // Data from navigation state
    protocolStats = state.protocolStats;
    trafficData = state.trafficData;
    filename = state.filename || "";
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem("networkAnalyzer_data", JSON.stringify({
        protocolStats,
        trafficData,
        filename,
        timestamp: Date.now(),
      }));
    } catch (e) {
      console.error("Failed to save data to localStorage:", e);
    }
  } else {
    // Try to load from localStorage
    try {
      const savedData = localStorage.getItem("networkAnalyzer_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Validate the data structure
        if (parsed.protocolStats && Array.isArray(parsed.protocolStats) && parsed.protocolStats.length > 0) {
          protocolStats = parsed.protocolStats;
        }
        if (parsed.trafficData && Array.isArray(parsed.trafficData) && parsed.trafficData.length > 0) {
          trafficData = parsed.trafficData;
        }
        if (parsed.filename) {
          filename = parsed.filename;
        }
      }
    } catch (e) {
      console.error("Failed to load data from localStorage:", e);
    }
  }

  // Check if we have data BEFORE calculating statistics
  if (!protocolStats || protocolStats.length === 0 || !trafficData || trafficData.length === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm animate-slide-up">
                <CardHeader className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                    <BarChart3 className="h-16 w-16 mx-auto relative text-primary animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    No Data Available
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg mt-2">
                    Upload and analyze a PCAP file to view detailed statistics and classifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4 pt-6">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigate("/")}
                      size="lg"
                      className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200 group"
                    >
                      <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Go to Upload
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Supported file formats:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="px-3 py-1">.pcap</Badge>
                      <Badge variant="outline" className="px-3 py-1">.pcapng</Badge>
                      <Badge variant="outline" className="px-3 py-1">.cap</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Maximum file size: 1 GB • Unlimited packet processing
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Initialize all 5 classes
  const allClasses = {
    A: { class: "A", className: "Web Browsing", packet_count: 0, total_bytes: 0, protocol_count: 0, protocols: new Set<string>() },
    B: { class: "B", className: "Streaming", packet_count: 0, total_bytes: 0, protocol_count: 0, protocols: new Set<string>() },
    C: { class: "C", className: "File Transfer", packet_count: 0, total_bytes: 0, protocol_count: 0, protocols: new Set<string>() },
    D: { class: "D", className: "Messaging", packet_count: 0, total_bytes: 0, protocol_count: 0, protocols: new Set<string>() },
    E: { class: "E", className: "System / Other", packet_count: 0, total_bytes: 0, protocol_count: 0, protocols: new Set<string>() },
  };

  // Calculate class statistics (only if we have data)
  const classStats = protocolStats.reduce((acc, stat) => {
    const protocolInfo = getProtocolInfo(stat.protocol);
    const classKey = protocolInfo.class;
    if (!acc[classKey]) {
      acc[classKey] = {
        class: classKey,
        className: protocolInfo.className,
        packet_count: 0,
        total_bytes: 0,
        protocol_count: 0,
        protocols: new Set<string>(),
      };
    }
    acc[classKey].packet_count += stat.packet_count;
    acc[classKey].total_bytes += stat.total_bytes;
    acc[classKey].protocols.add(stat.protocol);
    acc[classKey].protocol_count = acc[classKey].protocols.size;
    return acc;
  }, allClasses as Record<string, {
    class: string;
    className: string;
    packet_count: number;
    total_bytes: number;
    protocol_count: number;
    protocols: Set<string>;
  }>);

  // Convert to array - show all 5 classes even if some have 0 packets
  const classStatsArray = Object.values(classStats)
    .map(stat => ({
      ...stat,
      protocols: Array.from(stat.protocols),
      percentage: trafficData.length > 0 ? (stat.packet_count / trafficData.length) * 100 : 0,
    }))
    .sort((a, b) => {
      // Sort by packet count (descending), but keep all classes visible
      if (a.packet_count === 0 && b.packet_count === 0) return a.class.localeCompare(b.class);
      if (a.packet_count === 0) return 1;
      if (b.packet_count === 0) return -1;
      return b.packet_count - a.packet_count;
    });

  const totalPackets = trafficData.length;
  const totalBytes = trafficData.reduce((sum, p) => sum + p.packet_size, 0);
  const uniqueProtocols = new Set(trafficData.map(p => p.protocol)).size;

  // Prepare chart data
  const barChartData = classStatsArray.map(stat => ({
    name: `Class ${stat.class}`,
    packets: stat.packet_count,
    bytes: stat.total_bytes / 1024, // Convert to KB
    percentage: stat.percentage,
  }));

  const pieChartData = classStatsArray.map(stat => ({
    name: `Class ${stat.class}`,
    value: stat.packet_count,
    fill: CLASS_COLORS[stat.class] || "#8884d8",
  }));

  const protocolBarData = protocolStats.slice(0, 10).map(stat => ({
    name: stat.protocol,
    packets: stat.packet_count,
    bytes: stat.total_bytes / 1024,
    class: getProtocolInfo(stat.protocol).class,
  }));

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="h-9 w-9 rounded-lg border border-border/40 hover:bg-accent/50 hover:scale-105 transition-all duration-200 group"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg shadow-primary/20">
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Statistics Dashboard
                    </h1>
                  </div>
                </div>
                {filename && (
                  <div className="flex items-center gap-2 ml-12">
                    <p className="text-sm sm:text-base text-muted-foreground">
                      File: <span className="font-semibold text-foreground">{filename}</span>
                    </p>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="text-sm sm:text-base px-4 py-2 border-2 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-card to-card/80">
                <Activity className="h-3.5 w-3.5 mr-2 inline" />
                {totalPackets.toLocaleString()} Packets
              </Badge>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in">
            <Card className="border-2 shadow-xl shadow-blue-500/20 dark:shadow-blue-500/30 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Total Packets</CardTitle>
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalPackets.toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Unlimited processing</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl shadow-green-500/20 dark:shadow-green-500/30 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Unique Protocols</CardTitle>
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                  {uniqueProtocols}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Across {classStatsArray.length} classes</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl shadow-purple-500/20 dark:shadow-purple-500/30 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Total Data</CardTitle>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {totalBytes > 1024 * 1024
                    ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
                    : `${(totalBytes / 1024).toFixed(2)} KB`}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Processed successfully</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl shadow-orange-500/20 dark:shadow-orange-500/30 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">Classifications</CardTitle>
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {classStatsArray.length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active classes</p>
              </CardContent>
            </Card>
          </div>

          {/* Classification Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 animate-slide-up">
            {/* Class Statistics Cards */}
            <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm hover:shadow-3xl hover:shadow-primary/15 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="text-xl sm:text-2xl font-bold">Classification Overview</CardTitle>
                <CardDescription className="text-sm sm:text-base">Protocol distribution by class</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {classStatsArray.map((stat, idx) => {
                    const Icon = CLASS_ICONS[stat.class as keyof typeof CLASS_ICONS] || Settings;
                    const hasData = stat.packet_count > 0;
                    return (
                      <div
                        key={stat.class}
                        className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 bg-gradient-to-br from-card to-card/80 ${
                          hasData ? "hover:shadow-lg hover:scale-[1.02] opacity-100 cursor-pointer" : "opacity-60"
                        } animate-fade-in`}
                        style={{ 
                          borderLeftColor: CLASS_COLORS[stat.class], 
                          borderLeftWidth: "4px",
                          animationDelay: `${idx * 0.1}s`
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${CLASS_COLORS[stat.class]}20` }}
                            >
                              <Icon className="h-5 w-5" style={{ color: CLASS_COLORS[stat.class] }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs sm:text-sm font-semibold"
                                  style={{ borderColor: CLASS_COLORS[stat.class] }}
                                >
                                  Class {stat.class}
                                </Badge>
                              </div>
                              <p className="text-sm sm:text-base font-semibold">{stat.className}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg sm:text-xl font-bold">{stat.packet_count.toLocaleString()}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">packets</p>
                          </div>
                        </div>
                        {hasData ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground">Protocols:</span>
                              <span className="font-semibold">{stat.protocol_count}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground">Data:</span>
                              <span className="font-semibold">
                                {(stat.total_bytes / 1024).toFixed(2)} KB
                              </span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-muted-foreground">Percentage:</span>
                              <span className="font-semibold">{stat.percentage.toFixed(2)}%</span>
                            </div>
                            <div className="mt-2">
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${stat.percentage}%`,
                                    backgroundColor: CLASS_COLORS[stat.class],
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-xs sm:text-sm text-muted-foreground italic">No packets in this class</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm hover:shadow-3xl hover:shadow-primary/15 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="text-xl sm:text-2xl font-bold">Class Distribution</CardTitle>
                <CardDescription className="text-sm sm:text-base">Visual breakdown by classification</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    packets: { label: "Packets" },
                  }}
                  className="h-[300px] sm:h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value: number, name: string, props: any) => {
                          const percent = ((value / totalPackets) * 100).toFixed(1);
                          return [`${value.toLocaleString()} packets (${percent}%)`, name];
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value: string) => {
                          const stat = classStatsArray.find(s => `Class ${s.class}` === value);
                          if (stat) {
                            const percent = stat.percentage.toFixed(1);
                            return `${value} - ${stat.packet_count.toLocaleString()} (${percent}%)`;
                          }
                          return value;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {classStatsArray.map((stat) => {
                    const hasData = stat.packet_count > 0;
                    return (
                      <div
                        key={stat.class}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          hasData ? "opacity-100" : "opacity-60"
                        }`}
                        style={{ borderColor: CLASS_COLORS[stat.class] }}
                      >
                        <div
                          className="h-3 w-3 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: CLASS_COLORS[stat.class] }}
                        />
                        <p className="text-xs font-semibold">Class {stat.class}</p>
                        <p className="text-[10px] text-muted-foreground">{stat.className}</p>
                        {hasData && (
                          <p className="text-[10px] font-medium mt-1">{stat.packet_count.toLocaleString()} packets</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Bar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 animate-slide-up">
            {/* Class Comparison Bar Chart */}
            <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm hover:shadow-3xl hover:shadow-primary/15 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="text-xl sm:text-2xl font-bold">Class Comparison</CardTitle>
                <CardDescription className="text-sm sm:text-base">Packets and data volume by classification</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    packets: { label: "Packets", color: "hsl(var(--primary))" },
                    bytes: { label: "Data (KB)", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px] sm:h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="packets" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Packets" />
                      <Bar yAxisId="right" dataKey="bytes" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Data (KB)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Protocols Bar Chart */}
            <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm hover:shadow-3xl hover:shadow-primary/15 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="text-xl sm:text-2xl font-bold">Top Protocols</CardTitle>
                <CardDescription className="text-sm sm:text-base">Most active protocols</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    packets: { label: "Packets" },
                  }}
                  className="h-[300px] sm:h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={protocolBarData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="packets"
                        radius={[0, 8, 8, 0]}
                      >
                        {protocolBarData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CLASS_COLORS[entry.class] || "#8884d8"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Protocol Details Table */}
          <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm animate-slide-up hover:shadow-3xl hover:shadow-primary/15 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardTitle className="text-xl sm:text-2xl font-bold">Protocol Details</CardTitle>
              <CardDescription className="text-sm sm:text-base">Complete protocol breakdown</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {protocolStats.map((stat, idx) => {
                  const protocolInfo = getProtocolInfo(stat.protocol);
                  return (
                    <div
                      key={stat.protocol}
                      className="p-4 rounded-xl border-2 hover:shadow-lg hover:scale-[1.03] transition-all duration-300 bg-gradient-to-br from-card to-card/80 cursor-pointer animate-fade-in"
                      style={{ 
                        borderLeftColor: protocolInfo.color, 
                        borderLeftWidth: "4px",
                        animationDelay: `${idx * 0.05}s`
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-base sm:text-lg">{stat.protocol}</p>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: protocolInfo.color }}
                        >
                          {protocolInfo.class}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{protocolInfo.className}</p>
                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Packets:</span>
                          <span className="font-semibold">{stat.packet_count.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bytes:</span>
                          <span className="font-semibold">
                            {(stat.total_bytes / 1024).toFixed(2)} KB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Share:</span>
                          <span className="font-semibold">{stat.percentage.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Statistics;

