import { type User, type InsertUser, type Location, type InsertLocation, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getLocation(id: string): Promise<Location | undefined>;
  getLocations(): Promise<Location[]>;
  getFeaturedLocations(): Promise<Location[]>;
  searchLocations(query: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<string, Location>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.contacts = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some sample locations to populate the network
    const sampleLocations: InsertLocation[] = [
      {
        name: "TechForge Lab",
        description: "State-of-the-art facility with 30+ 3D printers, laser cutters, and electronics lab. Perfect for prototyping and small batch production.",
        city: "San Francisco",
        country: "USA",
        address: "123 Innovation St, San Francisco, CA 94105",
        latitude: 37.7749,
        longitude: -122.4194,
        email: "hello@techforgelab.com",
        phone: "+1-415-555-0123",
        website: "https://techforgelab.com",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        equipment: ["3D Printing", "Laser Cutting", "Electronics"],
        rating: 4.8,
        isActive: true,
      },
      {
        name: "MetalWorks Berlin",
        description: "Heavy-duty metalworking shop with CNC machines, welding stations, and forge. Ideal for industrial prototypes and art installations.",
        city: "Berlin",
        country: "Germany",
        address: "Industriestraße 42, 10317 Berlin",
        latitude: 52.5200,
        longitude: 13.4050,
        email: "info@metalworksberlin.de",
        phone: "+49-30-555-0198",
        equipment: ["CNC Machining", "Welding", "Forging"],
        rating: 4.9,
        isActive: true,
      },
      {
        name: "Creative Hub Tokyo",
        description: "Multi-disciplinary space combining traditional crafts with modern technology. Features textile lab, ceramics studio, and IoT workshop.",
        city: "Tokyo",
        country: "Japan",
        address: "1-2-3 Shibuya, Tokyo 150-0002",
        latitude: 35.6762,
        longitude: 139.6503,
        email: "contact@creativehub-tokyo.jp",
        phone: "+81-3-555-0167",
        equipment: ["Textiles", "Ceramics", "IoT"],
        rating: 4.7,
        isActive: true,
      },
      {
        name: "Sydney Maker Collective",
        description: "Community-driven space with focus on sustainable making and circular economy principles.",
        city: "Sydney",
        country: "Australia",
        address: "456 Maker St, Sydney NSW 2000",
        latitude: -33.8688,
        longitude: 151.2093,
        equipment: ["Woodworking", "3D Printing", "Recycling Lab"],
        rating: 4.6,
        isActive: true,
      },
      {
        name: "FabLab São Paulo",
        description: "Digital fabrication laboratory focused on education and social innovation projects.",
        city: "São Paulo",
        country: "Brazil",
        address: "Rua da Inovação, 789, São Paulo, SP",
        latitude: -23.5505,
        longitude: -46.6333,
        equipment: ["3D Printing", "Laser Cutting", "Programming"],
        rating: 4.5,
        isActive: true,
      },
    ];

    sampleLocations.forEach(location => {
      const id = randomUUID();
      const fullLocation: Location = {
        ...location,
        id,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        rating: location.rating?.toString() || "0",
        equipment: location.equipment || [],
        email: location.email || null,
        phone: location.phone || null,
        website: location.website || null,
        imageUrl: location.imageUrl || null,
      };
      this.locations.set(id, fullLocation);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(location => location.isActive);
  }

  async getFeaturedLocations(): Promise<Location[]> {
    const allLocations = await this.getLocations();
    return allLocations
      .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"))
      .slice(0, 6);
  }

  async searchLocations(query: string): Promise<Location[]> {
    const allLocations = await this.getLocations();
    const lowercaseQuery = query.toLowerCase();
    
    return allLocations.filter(location =>
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.city.toLowerCase().includes(lowercaseQuery) ||
      location.country.toLowerCase().includes(lowercaseQuery) ||
      location.description.toLowerCase().includes(lowercaseQuery) ||
      (location.equipment as string[]).some(eq => eq.toLowerCase().includes(lowercaseQuery))
    );
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = {
      ...insertLocation,
      id,
      latitude: insertLocation.latitude.toString(),
      longitude: insertLocation.longitude.toString(),
      rating: insertLocation.rating?.toString() || "0",
      equipment: insertLocation.equipment || [],
      email: insertLocation.email || null,
      phone: insertLocation.phone || null,
      website: insertLocation.website || null,
      imageUrl: insertLocation.imageUrl || null,
      isActive: true,
    };
    this.locations.set(id, location);
    return location;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date().toISOString(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export const storage = new MemStorage();
