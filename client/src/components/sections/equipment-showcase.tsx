export default function EquipmentShowcase() {
  const equipmentTypes = [
    {
      title: "3D Printing",
      description: "Industrial-grade printers for rapid prototyping and production",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
    {
      title: "Laser Cutting",
      description: "Precision cutting for wood, acrylic, metal, and fabric materials",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
    {
      title: "CNC Machining",
      description: "Computer-controlled milling and turning for metal and plastic parts",
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
    {
      title: "Electronics Lab",
      description: "PCB design, soldering stations, and testing equipment",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
  ];

  return (
    <section className="py-20" id="equipment" data-testid="section-equipment">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="equipment-title">World-Class Equipment</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="equipment-description">
            Access professional-grade tools and machinery across our global network
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipmentTypes.map((equipment, index) => (
            <div key={index} className="text-center space-y-4" data-testid={`equipment-item-${index}`}>
              <img
                src={equipment.imageUrl}
                alt={equipment.title}
                className="w-full h-48 object-cover rounded-lg"
                data-testid={`equipment-image-${index}`}
              />
              <h3 className="text-xl font-semibold" data-testid={`equipment-name-${index}`}>
                {equipment.title}
              </h3>
              <p className="text-muted-foreground" data-testid={`equipment-desc-${index}`}>
                {equipment.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
