import { type Product, type InsertProduct, type Order, type InsertOrder, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.contacts = new Map();

    this.seedProducts();
  }

  private seedProducts() {
    const products: Product[] = [
      {
        id: "1",
        name: "Premium Roasted Fox Nuts",
        description: "Lightly salted roasted makhana, perfect for healthy snacking. Rich in protein and low in calories.",
        price: "299.00",
        image: "/generated_images/Fox_nuts_product_7f195787.png",
        category: "Fox Nuts",
        weight: "250g",
        rating: "4.8",
        inStock: 1,
      },
      {
        id: "2",
        name: "Organic Lotus Seeds",
        description: "Premium quality lotus seeds sourced from Bihar. Excellent source of calcium and protein.",
        price: "349.00",
        image: "/generated_images/Almonds_product_9c566383.png",
        category: "Lotus Seeds",
        weight: "300g",
        rating: "4.7",
        inStock: 1,
      },
      {
        id: "3",
        name: "Premium California Almonds",
        description: "Whole almonds imported from California. Rich in vitamin E and healthy fats.",
        price: "499.00",
        image: "/generated_images/Almonds_product_9c566383.png",
        category: "Dry Fruits",
        weight: "500g",
        rating: "4.9",
        inStock: 1,
      },
      {
        id: "4",
        name: "Jumbo Cashew Nuts",
        description: "Premium jumbo cashews, carefully selected for size and quality. Creamy and delicious.",
        price: "599.00",
        image: "/generated_images/Cashews_product_60358549.png",
        category: "Dry Fruits",
        weight: "500g",
        rating: "4.8",
        inStock: 1,
      },
      {
        id: "5",
        name: "Golden Raisins",
        description: "Sweet and plump golden raisins. Natural energy booster packed with iron.",
        price: "249.00",
        image: "/generated_images/Raisins_product_294b7f8c.png",
        category: "Dry Fruits",
        weight: "400g",
        rating: "4.6",
        inStock: 1,
      },
      {
        id: "6",
        name: "Roasted Salted Pistachios",
        description: "Premium pistachios, roasted to perfection. Great source of protein and fiber.",
        price: "699.00",
        image: "/generated_images/Pistachios_product_d73761a2.png",
        category: "Dry Fruits",
        weight: "400g",
        rating: "4.9",
        inStock: 1,
      },
      {
        id: "7",
        name: "Premium Walnut Kernels",
        description: "Fresh walnut kernels, rich in omega-3 fatty acids. Perfect for brain health.",
        price: "549.00",
        image: "/generated_images/Walnuts_product_0913642c.png",
        category: "Dry Fruits",
        weight: "400g",
        rating: "4.7",
        inStock: 1,
      },
      {
        id: "8",
        name: "Medjool Dates",
        description: "Soft and sweet Medjool dates. Natural sweetener and energy booster.",
        price: "399.00",
        image: "/generated_images/Dates_product_b106c6e4.png",
        category: "Dry Fruits",
        weight: "500g",
        rating: "4.8",
        inStock: 1,
      },
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      orderDate: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      submittedAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
