import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface NetworkMapProps {
  stats?: {
    activeProjects: number;
    onlineSpaces: number;
  };
  isLoading: boolean;
}

export default function NetworkMap({ stats, isLoading }: NetworkMapProps) {
  return (
    <Card className="p-8 shadow-lg border border-border" data-testid="network-map">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Live Network Activity</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
      </div>

      <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Mock network nodes */}
          <div className="network-node" style={{ top: "20%", left: "15%" }}></div>
          <div className="network-node" style={{ top: "40%", left: "25%" }}></div>
          <div className="network-node" style={{ top: "30%", left: "45%" }}></div>
          <div className="network-node" style={{ top: "60%", left: "35%" }}></div>
          <div className="network-node" style={{ top: "25%", left: "70%" }}></div>
          <div className="network-node" style={{ top: "50%", left: "80%" }}></div>

          <div className="text-center space-y-2">
            <Globe className="text-4xl text-primary mx-auto" size={48} />
            <p className="text-sm text-muted-foreground">Global network visualization</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-bold text-accent" data-testid="stat-active-projects">
            {isLoading ? "..." : stats?.activeProjects || 127}
          </div>
          <div className="text-xs text-muted-foreground">Active Projects</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-bold text-primary" data-testid="stat-online-spaces">
            {isLoading ? "..." : stats?.onlineSpaces || 89}
          </div>
          <div className="text-xs text-muted-foreground">Spaces Online</div>
        </div>
      </div>
    </Card>
  );
}
