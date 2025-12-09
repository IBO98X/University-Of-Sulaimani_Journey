import { useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE = 1024 * 1024 * 1024;

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `File size exceeds 1 GB limit. Current size: ${(
            file.size /
            (1024 * 1024 * 1024)
          ).toFixed(2)} GB`
        );
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div
      className="border-2 border-dashed rounded-xl p-8 sm:p-12 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer bg-gradient-to-br from-background to-muted/20 hover:shadow-xl hover:shadow-primary/20 dark:hover:shadow-primary/30 group relative overflow-hidden"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full"></div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pcap,.pcapng,.cap"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="mb-6 relative z-10">
        <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Upload className="h-10 w-10 text-primary relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
          Click to select file
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          Supported formats: .pcap, .pcapng, .cap
        </p>
        <p className="text-xs font-medium text-primary">
          Maximum file size: 1 GB • Unlimited packet processing
        </p>
      </div>
      {error && (
        <Alert
          variant="destructive"
          className="mt-4 relative z-10 animate-slide-down"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;
