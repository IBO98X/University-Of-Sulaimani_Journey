import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProtocolInfo } from "@/lib/protocol-classification";

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

interface TrafficTableProps {
  data: TrafficData[];
}

const TrafficTable = ({ data }: TrafficTableProps) => {
  const [page, setPage] = useState(0);
  const pageSize = 50;
  
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  return (
    <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardTitle className="text-xl sm:text-2xl font-bold">Traffic Details</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Showing {startIndex + 1} to {endIndex} of {data.length.toLocaleString()} packets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto -mx-1 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocol</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Source Port</TableHead>
                <TableHead>Dest IP</TableHead>
                <TableHead>Dest Port</TableHead>
                <TableHead>Size (bytes)</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((row, index) => {
                const protocolInfo = getProtocolInfo(row.protocol);
                return (
                  <TableRow 
                    key={row.id} 
                    className="hover:bg-muted/50 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shadow-sm"
                          style={{ backgroundColor: protocolInfo.color }}
                        />
                        <span className="font-medium">{row.protocol}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold"
                        style={{ borderColor: protocolInfo.color }}
                      >
                        {protocolInfo.class}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{row.source_ip}</TableCell>
                    <TableCell>{row.source_port || "-"}</TableCell>
                    <TableCell className="font-mono text-sm">{row.dest_ip}</TableCell>
                    <TableCell>{row.dest_port || "-"}</TableCell>
                    <TableCell className="font-medium">{row.packet_size.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(row.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficTable;
