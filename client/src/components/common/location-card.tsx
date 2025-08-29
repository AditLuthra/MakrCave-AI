import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const equipment = location.equipment as string[];
  
  const getEquipmentAbbrev = (eq: string) => {
    const abbrevs: Record<string, string> = {
      "3D Printing": "3D",
      "Laser Cutting": "LC",
      "Electronics": "EL",
      "CNC Machining": "CNC",
      "Welding": "WLD",
      "Forging": "FRG",
      "Textiles": "TX",
      "Ceramics": "CR",
      "IoT": "IoT",
      "Woodworking": "WW",
      "Recycling Lab": "RC",
      "Programming": "PG",
    };
    return abbrevs[eq] || eq.slice(0, 3).toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover-lift" data-testid={`location-card-${location.id}`}>
      {location.imageUrl && (
        <img
          src={location.imageUrl}
          alt={`${location.name} interior`}
          className="w-full h-48 object-cover"
          data-testid={`location-image-${location.id}`}
        />
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold" data-testid={`location-name-${location.id}`}>
            {location.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm" data-testid={`location-rating-${location.id}`}>
              {location.rating}
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span data-testid={`location-city-${location.id}`}>
            {location.city}, {location.country}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4" data-testid={`location-description-${location.id}`}>
          {location.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2" data-testid={`location-equipment-${location.id}`}>
            {equipment.slice(0, 3).map((eq, i) => (
              <div key={i} className="equipment-icon">
                {getEquipmentAbbrev(eq)}
              </div>
            ))}
          </div>
          <Button variant="ghost" asChild data-testid={`button-view-details-${location.id}`}>
            <Link href={`/locations/${location.id}`}>
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
