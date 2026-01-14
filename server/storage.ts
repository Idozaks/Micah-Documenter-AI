import { type User, type InsertUser, type Explanation, type InsertExplanation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createExplanation(explanation: InsertExplanation): Promise<Explanation>;
  getExplanation(id: number): Promise<Explanation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private explanations: Map<number, Explanation>;
  private explanationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.explanations = new Map();
    this.explanationIdCounter = 1;
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

  async createExplanation(insertExplanation: InsertExplanation): Promise<Explanation> {
    const id = this.explanationIdCounter++;
    const explanation: Explanation = {
      ...insertExplanation,
      id,
      createdAt: new Date(),
    };
    this.explanations.set(id, explanation);
    return explanation;
  }

  async getExplanation(id: number): Promise<Explanation | undefined> {
    return this.explanations.get(id);
  }
}

export const storage = new MemStorage();
