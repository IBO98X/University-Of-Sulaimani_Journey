import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getProtocolInfo } from "@/lib/protocol-classification";

interface ProtocolStat {
  protocol: string;
  packet_count: number;
  total_bytes: number;
  percentage: number;
  class?: string;
  className?: string;
}

interface ProtocolChartProps {
  data: ProtocolStat[];
}

const CLASS_COLORS: Record<string, string> = {
  A: "hsl(217, 91%, 60%)", // Blue for Web Browsing
  B: "hsl(142, 76%, 36%)", // Green for Streaming
  C: "hsl(38, 92%, 50%)",  // Orange for File Transfer
  D: "hsl(280, 100%, 70%)", // Purple for Messaging
  E: "hsl(0, 72%, 51%)",   // Red for System/Other
};

const ProtocolChart = ({ data }: ProtocolChartProps) => {
  const chartData = data.map((stat) => {
    const protocolInfo = getProtocolInfo(stat.protocol);
    return {
      name: stat.protocol,
      value: stat.packet_count,
      fill: protocolInfo.color || CLASS_COLORS[protocolInfo.class] || "hsl(0, 0%, 50%)",
      class: protocolInfo.class,
      className: protocolInfo.className,
    };
  });

  // Group by class for summary
  const classStats = data.reduce((acc, stat) => {
    const protocolInfo = getProtocolInfo(stat.protocol);
    const classKey = protocolInfo.class;
    if (!acc[classKey]) {
      acc[classKey] = { count: 0, bytes: 0, name: protocolInfo.className };
    }
    acc[classKey].count += stat.packet_count;
    acc[classKey].bytes += stat.total_bytes;
    return acc;
  }, {} as Record<string, { count: number; bytes: number; name: string }>);

  return (
    <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardTitle className="text-xl sm:text-2xl font-bold">Protocol Distribution</CardTitle>
        <CardDescription className="text-sm sm:text-base">Network traffic breakdown by protocol and classification</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer
          config={{
            packets: {
              label: "Packets",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Classification Summary */}
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Classification Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(classStats).map(([classKey, stats]) => (
              <div
                key={classKey}
                className="p-3 rounded-lg border-2"
                style={{ borderColor: CLASS_COLORS[classKey] || "#ccc" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CLASS_COLORS[classKey] || "#ccc" }}
                  />
                  <Badge variant="outline" className="text-xs">
                    Class {classKey}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{stats.name}</p>
                <p className="text-sm font-semibold">{stats.count.toLocaleString()} packets</p>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Protocol Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((stat) => {
              const protocolInfo = getProtocolInfo(stat.protocol);
              return (
                <div
                  key={stat.protocol}
                  className="p-4 rounded-lg border-2 hover:shadow-md transition-shadow bg-card"
                  style={{ borderLeftColor: protocolInfo.color, borderLeftWidth: "4px" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-lg">{stat.protocol}</p>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: protocolInfo.color }}
                    >
                      Class {protocolInfo.class}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{protocolInfo.className}</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Packets:</span>{" "}
                      <span className="font-semibold">{stat.packet_count.toLocaleString()}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Bytes:</span>{" "}
                      <span className="font-semibold">
                        {(stat.total_bytes / 1024).toFixed(2)} KB
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Share:</span>{" "}
                      <span className="font-semibold">{stat.percentage.toFixed(2)}%</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtocolChart;