import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import NotFound from "./pages/NotFound";
import LR from "./pages/models/LR";
import RF from "./pages/models/RF";
import KNN from "./pages/models/KNN";
import SVM from "./pages/models/SVM";
import GBC from "./pages/models/GBC";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="network-analyzer-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/models" element={<Navigate to="/models/lr" replace />} />
            <Route path="/models/lr" element={<LR />} />
            <Route path="/models/rf" element={<RF />} />
            <Route path="/models/knn" element={<KNN />} />
            <Route path="/models/svm" element={<SVM />} />
            <Route path="/models/gbc" element={<GBC />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

