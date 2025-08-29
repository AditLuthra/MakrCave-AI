import { Button } from "@/components/ui/button";
import NetworkMap from "@/components/common/network-map";
import { MapPin, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface Stats {
  locations: number;
  countries: number;
  makers: number;
  activeProjects: number;
  onlineSpaces: number;
}

export default function Hero() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="relative overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0 maker-pattern"></div>
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight" data-testid="hero-title">
                The Global <span className="industrial-gradient bg-clip-text text-transparent">Maker</span> Network
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg" data-testid="hero-description">
                Connect with 500+ FabLabs and Makerspaces worldwide. Access cutting-edge equipment, collaborate with makers, and bring your ideas to life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild data-testid="button-explore-network">
                <Link href="/locations">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Network
                </Link>
              </Button>
              <Button variant="outline" size="lg" data-testid="button-watch-demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="stat-locations">
                  {isLoading ? "..." : `${stats?.locations || 500}+`}
                </div>
                <div className="text-sm text-muted-foreground">Locations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent" data-testid="stat-countries">
                  {isLoading ? "..." : stats?.countries || 75}
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary" data-testid="stat-makers">
                  {isLoading ? "..." : `${Math.floor((stats?.makers || 50000) / 1000)}K+`}
                </div>
                <div className="text-sm text-muted-foreground">Makers</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <NetworkMap stats={stats} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
}
