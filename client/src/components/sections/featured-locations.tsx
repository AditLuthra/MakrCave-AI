import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LocationCard from "@/components/common/location-card";
import { Search } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";

export default function FeaturedLocations() {
  const { data: locations, isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations/featured"],
  });

  return (
    <section className="py-20 bg-muted/30" data-testid="section-featured-locations">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="featured-title">Featured Makerspaces</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="featured-description">
            Discover some of our most innovative and well-equipped makerspaces around the world
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            : locations?.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="secondary" size="lg" asChild data-testid="button-browse-all">
            <Link href="/locations">
              <Search className="mr-2 h-5 w-5" />
              Browse All Locations
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
