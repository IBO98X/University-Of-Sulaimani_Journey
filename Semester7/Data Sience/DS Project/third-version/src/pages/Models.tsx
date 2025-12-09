import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProtocolInfo, ProtocolClass } from "@/lib/protocol-classification";
import { Upload, Brain, Table } from "lucide-react";

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

type TruthRecord = {
  id: string;
  true_class?: ProtocolClass;
  true_protocol?: string;
};

const CLASSES: ProtocolClass[] = ["A", "B", "C", "D", "E"];

const CLASS_DETAILS: Record<ProtocolClass, { name: string; color: string }> = {
  A: { name: "Web Browsing", color: "hsl(217, 91%, 60%)" },
  B: { name: "Streaming", color: "hsl(142, 76%, 36%)" },
  C: { name: "File Transfer", color: "hsl(38, 92%, 50%)" },
  D: { name: "Messaging", color: "hsl(280, 100%, 70%)" },
  E: { name: "System / Other", color: "hsl(0, 72%, 51%)" },
};

export default function Models() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [filename, setFilename] = useState<string>("");

  // Ground truth
  const [truth, setTruth] = useState<Record<string, TruthRecord>>({});
  const [truthFileName, setTruthFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");

  // Load last analysis data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("networkAnalyzer_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.trafficData)) setTrafficData(parsed.trafficData);
        if (typeof parsed.filename === "string") setFilename(parsed.filename);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Predictions (class for each packet)
  const predictions = useMemo(() => {
    return trafficData.map((p) => ({
      id: p.id,
      predicted_protocol: p.protocol,
      predicted_class: getProtocolInfo(p.protocol).class,
    }));
  }, [trafficData]);

  // Evaluate
  const evaluation = useMemo(() => {
    // Build confusion matrix class-level
    const matrix: Record<ProtocolClass, Record<ProtocolClass, number>> = {
      A: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      B: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      C: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      D: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      E: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    };

    let compared = 0;
    let correct = 0;

    for (const pred of predictions) {
      const t = truth[pred.id];
      if (!t) continue;

      const trueClass: ProtocolClass | undefined = t.true_class
        ? t.true_class
        : t.true_protocol
        ? getProtocolInfo(t.true_protocol).class
        : undefined;
      if (!trueClass) continue;

      matrix[trueClass][pred.predicted_class] += 1;
      compared += 1;
      if (trueClass === pred.predicted_class) correct += 1;
    }

    // Per-class metrics
    const perClass = CLASSES.map((c) => {
      const tp = matrix[c][c];
      const fp = CLASSES.reduce((s, r) => (r === c ? s : s + matrix[r][c]), 0);
      const fn = CLASSES.reduce((s, k) => (k === c ? s : s + matrix[c][k]), 0);
      const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
      const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
      const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
      return { class: c, tp, fp, fn, precision, recall, f1 };
    });

    const accuracy = compared === 0 ? 0 : correct / compared;

    return { matrix, perClass, compared, correct, accuracy };
  }, [predictions, truth]);

  function handleTruthFile(file: File) {
    setTruthFileName(file.name);
    setParseError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "").trim();
        let parsed: Record<string, TruthRecord> = {};

        if (file.name.toLowerCase().endsWith(".json")) {
          const arr = JSON.parse(text);
          if (!Array.isArray(arr)) throw new Error("JSON must be an array");
          for (const item of arr) {
            if (!item.id) continue;
            const rec: TruthRecord = { id: String(item.id) };
            if (item.true_class) rec.true_class = String(item.true_class).toUpperCase() as ProtocolClass;
            if (item.true_protocol) rec.true_protocol = String(item.true_protocol);
            parsed[rec.id] = rec;
          }
        } else {
          // CSV parser: headers: id,true_class OR id,true_protocol
          const lines = text.split(/\r?\n/).filter(Boolean);
          if (lines.length === 0) throw new Error("Empty file");
          const headers = lines[0].split(",").map((h) => h.trim());
          const idIdx = headers.findIndex((h) => h.toLowerCase() === "id");
          const classIdx = headers.findIndex((h) => h.toLowerCase() === "true_class");
          const protIdx = headers.findIndex((h) => h.toLowerCase() === "true_protocol");
          if (idIdx < 0 || (classIdx < 0 && protIdx < 0)) {
            throw new Error("CSV must have headers: id,true_class OR id,true_protocol");
          }
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",");
            if (cols.length <= idIdx) continue;
            const id = cols[idIdx].trim();
            if (!id) continue;
            const rec: TruthRecord = { id };
            if (classIdx >= 0 && cols[classIdx]) {
              rec.true_class = cols[classIdx].trim().toUpperCase() as ProtocolClass;
            }
            if (protIdx >= 0 && cols[protIdx]) {
              rec.true_protocol = cols[protIdx].trim();
            }
            parsed[id] = rec;
          }
        }
        setTruth(parsed);
        try {
          localStorage.setItem("networkAnalyzer_eval", JSON.stringify({ truth: parsed, truthFileName: file.name }));
        } catch {}
      } catch (e: any) {
        setParseError(e?.message || "Failed to parse file");
      }
    };
    reader.readAsText(file);
  }

  // Load last truth file (if any)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("networkAnalyzer_eval");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.truth && typeof parsed.truth === "object") setTruth(parsed.truth);
        if (parsed.truthFileName) setTruthFileName(parsed.truthFileName);
      }
    } catch {}
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg shadow-primary/20">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Models & Evaluation
              </h1>
            </div>
            {filename && (
              <p className="text-sm text-muted-foreground mt-2 ml-12">Analyzed file: <span className="font-semibold">{filename}</span></p>
            )}
          </div>

          {/* Class overview */}
          <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm mb-6 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardTitle className="text-xl sm:text-2xl font-bold">Five Classes</CardTitle>
              <CardDescription>Classification groups used by the detector</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {CLASSES.map((c) => {
                  const info = CLASS_DETAILS[c];
                  return (
                    <div key={c} className="p-4 rounded-xl border-2 bg-gradient-to-br from-card to-card/80" style={{ borderLeftColor: info.color, borderLeftWidth: 4 }}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" style={{ borderColor: info.color }}>Class {c}</Badge>
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: info.color }} />
                      </div>
                      <p className="text-sm font-semibold">{info.name}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upload truth */}
          <Card className="border-2 shadow-2xl shadow-primary/10 dark:shadow-primary/20 bg-card/95 backdrop-blur-sm mb-6 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardTitle className="text-xl sm:text-2xl font-bold">Evaluate Accuracy</CardTitle>
              <CardDescription>Upload ground truth as CSV (id,true_class or id,true_protocol) or JSON array</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleTruthFile(file);
                  }}
                  className="block w-full sm:w-auto text-sm"
                />
                <Button variant="outline" disabled className="gap-2">
                  <Upload className="h-4 w-4" />
                  {truthFileName || "No file selected"}
                </Button>
              </div>
              {parseError && (
                <p className="text-sm text-red-500 mt-3">{parseError}</p>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            <Card className="border-2 shadow-xl bg-card/95">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Overall and per-class metrics</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Compared</p>
                    <p className="text-lg font-bold">{evaluation.compared.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Correct</p>
                    <p className="text-lg font-bold">{evaluation.correct.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="text-lg font-bold">{(evaluation.accuracy * 100).toFixed(2)}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evaluation.perClass.map((m) => {
                    const info = CLASS_DETAILS[m.class as ProtocolClass];
                    return (
                      <div key={m.class} className="p-3 rounded-lg border" style={{ borderLeftColor: info.color, borderLeftWidth: 4 }}>
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" style={{ borderColor: info.color }}>Class {m.class}</Badge>
                          <span className="text-xs text-muted-foreground">{info.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div><span className="text-muted-foreground">P:</span> <span className="font-semibold">{(m.precision * 100).toFixed(1)}%</span></div>
                          <div><span className="text-muted-foreground">R:</span> <span className="font-semibold">{(m.recall * 100).toFixed(1)}%</span></div>
                          <div><span className="text-muted-foreground">F1:</span> <span className="font-semibold">{(m.f1 * 100).toFixed(1)}%</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl bg-card/95">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  <CardTitle>Confusion Matrix (Class)</CardTitle>
                </div>
                <CardDescription>Rows = True class, Columns = Predicted class</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 overflow-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">True \ Pred</th>
                      {CLASSES.map((c) => (
                        <th key={c} className="p-2 text-center">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CLASSES.map((r) => (
                      <tr key={r} className="border-t">
                        <td className="p-2 font-medium">{r}</td>
                        {CLASSES.map((c) => (
                          <td key={r+"-"+c} className="p-2 text-center">{evaluation.matrix[r][c]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
