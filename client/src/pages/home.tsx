import Hero from "@/components/sections/hero";
import FeaturedLocations from "@/components/sections/featured-locations";
import EquipmentShowcase from "@/components/sections/equipment-showcase";
import Community from "@/components/sections/community";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div data-testid="page-home">
      <Hero />
      <FeaturedLocations />
      <EquipmentShowcase />
      <Community />
      <Contact />
    </div>
  );
}
