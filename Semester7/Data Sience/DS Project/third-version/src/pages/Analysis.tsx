import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowLeft, Download, Activity, Globe } from "lucide-react";
import TrafficTable from "@/components/TrafficTable";
import Navigation from "@/components/Navigation";
import { getProtocolInfo } from "@/lib/protocol-classification";

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

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    protocolStats?: ProtocolStat[];
    trafficData?: TrafficData[];
    filename?: string;
  } | null;

  // Try to get data from state first, then from localStorage
  let protocolStats: ProtocolStat[] = [];
  let trafficData: TrafficData[] = [];
  let filename = "";

  if (state?.protocolStats && state?.trafficData) {
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
        protocolStats = parsed.protocolStats || [];
        trafficData = parsed.trafficData || [];
        filename = parsed.filename || "";
      }
    } catch (e) {
      console.error("Failed to load data from localStorage:", e);
    }
  }

  if (protocolStats.length === 0 || trafficData.length === 0) {
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
                    <Activity className="h-16 w-16 mx-auto relative text-primary animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    No Analysis Data
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg mt-2">
                    Upload and analyze a PCAP file to view detailed results
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4 pt-6">
                  <Button
                    onClick={() => navigate("/")}
                    size="lg"
                    className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200 group"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Go to Upload
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  const totalPackets = trafficData.length;
  const totalBytes = trafficData.reduce((sum, p) => sum + p.packet_size, 0);
  const uniqueProtocols = new Set(trafficData.map((p) => p.protocol)).size;

  // Calculate class statistics
  const classStats = protocolStats.reduce(
    (acc, stat) => {
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
    },
    {} as Record<
      string,
      {
        class: string;
        className: string;
        packet_count: number;
        total_bytes: number;
        protocol_count: number;
        protocols: Set<string>;
      }
    >
  );

  const classStatsArray = Object.values(classStats).map((stat) => ({
    ...stat,
    protocols: Array.from(stat.protocols),
    percentage: (stat.packet_count / trafficData.length) * 100,
  }));

  const CLASS_COLORS: Record<string, string> = {
    A: "hsl(217, 91%, 60%)",
    B: "hsl(142, 76%, 36%)",
    C: "hsl(38, 92%, 50%)",
    D: "hsl(280, 100%, 70%)",
    E: "hsl(0, 72%, 51%)",
  };

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
                    onClick={() => navigate("/")}
                    className="h-9 w-9 rounded-lg border border-border/40 hover:bg-accent/50 hover:scale-105 transition-all duration-200 group"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg shadow-primary/20">
                      <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Analysis Results
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
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  onClick={() =>
                    navigate("/statistics", {
                      state: { protocolStats, trafficData, filename },
                    })
                  }
                  className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200 group hover:scale-105"
                >
                  <BarChart3 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">View Statistics</span>
                  <span className="sm:hidden">Stats</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in">
            <Card className="border-2 shadow-xl shadow-blue-500/20 dark:shadow-blue-500/30 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">
                    Total Packets
                  </CardTitle>
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalPackets.toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Processed successfully</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl shadow-green-500/20 dark:shadow-green-500/30 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">
                    Unique Protocols
                  </CardTitle>
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                  {uniqueProtocols}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Across {classStatsArray.length} classes
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl shadow-purple-500/20 dark:shadow-purple-500/30 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">
                    Total Data
                  </CardTitle>
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {totalBytes > 1024 * 1024
                    ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
                    : `${(totalBytes / 1024).toFixed(2)} KB`}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Analyzed data</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl shadow-orange-500/20 dark:shadow-orange-500/30 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium text-muted-foreground">
                    Classifications
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
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
          <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm mb-6 sm:mb-8 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardTitle className="text-xl sm:text-2xl font-bold">Classification Overview</CardTitle>
              <CardDescription className="text-sm sm:text-base">Protocol distribution by classification class</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {classStatsArray.map((stat) => {
                  const protocolInfo = getProtocolInfo(stat.class);
                  return (
                    <div
                      key={stat.class}
                      className="p-4 sm:p-5 rounded-xl border-2 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/80"
                      style={{
                        borderLeftColor: CLASS_COLORS[stat.class],
                        borderLeftWidth: "4px",
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant="outline"
                          className="text-xs sm:text-sm font-semibold"
                          style={{ borderColor: CLASS_COLORS[stat.class] }}
                        >
                          Class {stat.class}
                        </Badge>
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold">{stat.packet_count.toLocaleString()}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">packets</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold mb-3">{stat.className}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Protocols:</span>
                          <span className="font-semibold">{stat.protocol_count}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Data:</span>
                          <span className="font-semibold">{(stat.total_bytes / 1024).toFixed(2)} KB</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Share:</span>
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
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Protocol Summary */}
          <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm mb-6 sm:mb-8 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardTitle className="text-xl sm:text-2xl font-bold">Protocol Summary</CardTitle>
              <CardDescription className="text-sm sm:text-base">Top protocols detected in the capture</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {protocolStats.slice(0, 10).map((stat) => {
                  const protocolInfo = getProtocolInfo(stat.protocol);
                  return (
                    <div
                      key={stat.protocol}
                      className="p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/80"
                      style={{
                        borderLeftColor: protocolInfo.color,
                        borderLeftWidth: "4px",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
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
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Packets:</span>
                          <span className="font-semibold">{stat.packet_count.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bytes:</span>
                          <span className="font-semibold">{(stat.total_bytes / 1024).toFixed(2)} KB</span>
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

          {/* Traffic Table */}
          <div className="animate-slide-up">
            <TrafficTable data={trafficData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Analysis;

