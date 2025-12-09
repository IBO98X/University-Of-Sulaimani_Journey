import { Link, useLocation } from "react-router-dom";
import { Network, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Upload", icon: Upload },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-lg shadow-primary/5 dark:shadow-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                <Network className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-primary/50 transition-all duration-300">
                  Network Analyzer
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground hidden md:block">
                  Advanced PCAP Analysis
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 bg-muted/50 rounded-lg p-1 border border-border/40 shadow-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                          : "hover:bg-accent/50 hover:scale-105"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

