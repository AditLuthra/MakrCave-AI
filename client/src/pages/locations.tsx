import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LocationCard from "@/components/common/location-card";
import { Search, Filter } from "lucide-react";
import type { Location } from "@shared/schema";

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: locations, isLoading } = useQuery<Location[]>({
    queryKey: activeSearch ? ["/api/locations/search", activeSearch] : ["/api/locations"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
  };

  return (
    <div className="py-20" data-testid="page-locations">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" data-testid="locations-title">
            Find Makerspaces Near You
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="locations-description">
            Browse our global network of {locations?.length || 500}+ locations and find the perfect space for your next project
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-4" data-testid="search-form">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by location, equipment, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                data-testid="input-search"
              />
            </div>
            <Button type="submit" data-testid="button-search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" data-testid="button-filter">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </form>

          {activeSearch && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground" data-testid="search-results-info">
                {isLoading ? "Searching..." : `${locations?.length || 0} results for "${activeSearch}"`}
              </p>
              <Button variant="ghost" size="sm" onClick={clearSearch} data-testid="button-clear-search">
                Clear search
              </Button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            : locations?.map((location) => (
                <LocationCard key={location.id} location={location} />
              )) || (
                <div className="col-span-full text-center py-12" data-testid="no-results">
                  <p className="text-lg text-muted-foreground">No locations found</p>
                  <Button variant="outline" className="mt-4" onClick={clearSearch}>
                    Show all locations
                  </Button>
                </div>
              )}
        </div>

        {!activeSearch && !isLoading && locations && locations.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for?
            </p>
            <Button variant="outline" data-testid="button-suggest-location">
              Suggest a New Location
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
