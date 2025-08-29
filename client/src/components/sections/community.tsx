import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GitBranch, GraduationCap } from "lucide-react";

export default function Community() {
  const projects = [
    {
      title: "OpenSource Ventilator",
      contributors: 23,
      description: "Collaborative project to design affordable ventilators for developing countries",
      tags: ["Hardware", "Medical"],
      progress: 78,
    },
    {
      title: "Smart City Sensors",
      contributors: 15,
      description: "IoT sensor network for monitoring air quality and traffic patterns",
      tags: ["IoT", "Environment"],
      progress: 45,
    },
    {
      title: "Educational Robotics Kit",
      contributors: 31,
      description: "Affordable robotics platform for STEM education in schools",
      tags: ["Education", "Robotics"],
      progress: 92,
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Global Network",
      description: "Connect with 50,000+ makers across 75 countries",
      bgColor: "bg-primary",
    },
    {
      icon: GitBranch,
      title: "Collaborative Projects",
      description: "Work together on open-source hardware and innovation challenges",
      bgColor: "bg-accent",
    },
    {
      icon: GraduationCap,
      title: "Learning Resources",
      description: "Access workshops, tutorials, and mentorship programs",
      bgColor: "bg-secondary",
    },
  ];

  return (
    <section className="py-20 bg-muted/30" id="community" data-testid="section-community">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4" data-testid="community-title">Join the Community</h2>
              <p className="text-xl text-muted-foreground" data-testid="community-description">
                Connect with makers, share projects, and collaborate on innovations that matter.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4" data-testid={`community-feature-${index}`}>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2" data-testid={`feature-title-${index}`}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" data-testid="button-join-community">
              Join Community
            </Button>
          </div>

          <div className="space-y-6">
            {projects.map((project, index) => (
              <Card key={index} className="p-6" data-testid={`project-card-${index}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold" data-testid={`project-title-${index}`}>
                      {project.title}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`project-contributors-${index}`}>
                      {project.contributors} contributors
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4" data-testid={`project-description-${index}`}>
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2" data-testid={`project-tags-${index}`}>
                    {project.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant={tagIndex === 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground" data-testid={`project-progress-${index}`}>
                    {project.progress}% complete
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
