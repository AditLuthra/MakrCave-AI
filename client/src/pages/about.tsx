import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Globe, Lightbulb, Heart } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Globe,
      title: "Global Connectivity",
      description: "Building bridges between makers, innovators, and creators across the world.",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "Providing cutting-edge tools and resources to turn ideas into reality.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Fostering collaboration, knowledge sharing, and mutual support among makers.",
    },
    {
      icon: Heart,
      title: "Impact Focused",
      description: "Supporting projects that create positive change in communities worldwide.",
    },
  ];

  const stats = [
    { value: "2018", label: "Founded" },
    { value: "500+", label: "Locations" },
    { value: "75", label: "Countries" },
    { value: "50K+", label: "Members" },
  ];

  return (
    <div className="py-20" data-testid="page-about">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6" data-testid="about-title">About MakrCave</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto" data-testid="about-description">
            MakrCave is the world's largest network of FabLabs and makerspaces, dedicated to democratizing access to digital fabrication tools and fostering innovation through collaborative making.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`about-stat-${index}`}>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-muted-foreground" data-testid="mission-statement">
              We believe that everyone should have access to the tools and knowledge needed to create, innovate, and solve problems. 
              Our global network of makerspaces provides makers with state-of-the-art equipment, collaborative environments, 
              and supportive communities to bring their ideas to life.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="values-title">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6" data-testid={`value-card-${index}`}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="text-primary-foreground" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2" data-testid={`value-title-${index}`}>
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`value-description-${index}`}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Story */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-muted-foreground" data-testid="story-paragraph-1">
              Founded in 2018 by a group of passionate makers and entrepreneurs, MakrCave started with a simple idea: 
              what if makers around the world could easily access the tools and community they need to innovate, regardless of their location?
            </p>
            <p className="leading-relaxed text-muted-foreground" data-testid="story-paragraph-2">
              Starting with just five makerspaces across three countries, we've grown into a global network that spans continents. 
              Our platform connects individual makers with local spaces, facilitates knowledge sharing, and enables collaborative projects 
              that address real-world challenges.
            </p>
            <p className="leading-relaxed text-muted-foreground" data-testid="story-paragraph-3">
              Today, MakrCave continues to expand its reach while maintaining its core commitment to accessibility, 
              innovation, and community. We're not just building a network of spaces—we're building a movement that 
              empowers people to create the future they want to see.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="cta-title">Ready to Join the Movement?</h2>
          <p className="text-xl text-muted-foreground mb-8" data-testid="cta-description">
            Whether you're a maker looking for space or want to add your location to our network, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-find-location">
              <a href="/locations">Find a Location</a>
            </Button>
            <Button variant="outline" size="lg" data-testid="button-join-network">
              Join Our Network
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
