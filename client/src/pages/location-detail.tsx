import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, Phone, Mail, Globe, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Location } from "@shared/schema";

export default function LocationDetail() {
  const params = useParams();
  const locationId = params.id;

  const { data: location, isLoading, error } = useQuery<Location>({
    queryKey: ["/api/locations", locationId],
  });

  if (isLoading) {
    return (
      <div className="py-20" data-testid="loading-state">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-12 w-1/2" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="py-20" data-testid="error-state">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The location you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild data-testid="button-back-to-locations">
            <Link href="/locations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Locations
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const equipment = location.equipment as string[];

  return (
    <div className="py-20" data-testid="page-location-detail">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8" data-testid="button-back">
          <Link href="/locations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Locations
          </Link>
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="location-name">
                {location.name}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span data-testid="location-address">{location.city}, {location.country}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span data-testid="location-rating">{location.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button data-testid="button-visit-space">Visit Space</Button>
              <Button variant="outline" data-testid="button-contact-space">Contact</Button>
            </div>
          </div>

          {/* Image */}
          {location.imageUrl && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={location.imageUrl}
                alt={`${location.name} interior`}
                className="w-full h-64 md:h-80 object-cover"
                data-testid="location-main-image"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Description and Equipment */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed" data-testid="location-description">
                    {location.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2" data-testid="location-equipment">
                    {equipment.map((eq, index) => (
                      <Badge key={index} variant="secondary">
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3" data-testid="location-full-address">
                      <MapPin className="text-primary flex-shrink-0" size={16} />
                      <span className="text-sm">{location.address}</span>
                    </div>
                    
                    {location.email && (
                      <div className="flex items-center space-x-3" data-testid="location-contact-email">
                        <Mail className="text-primary flex-shrink-0" size={16} />
                        <a href={`mailto:${location.email}`} className="text-sm hover:text-primary transition-colors">
                          {location.email}
                        </a>
                      </div>
                    )}
                    
                    {location.phone && (
                      <div className="flex items-center space-x-3" data-testid="location-contact-phone">
                        <Phone className="text-primary flex-shrink-0" size={16} />
                        <a href={`tel:${location.phone}`} className="text-sm hover:text-primary transition-colors">
                          {location.phone}
                        </a>
                      </div>
                    )}
                    
                    {location.website && (
                      <div className="flex items-center space-x-3" data-testid="location-website">
                        <Globe className="text-primary flex-shrink-0" size={16} />
                        <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full" data-testid="button-book-visit">
                      Book a Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operating Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm" data-testid="operating-hours">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
