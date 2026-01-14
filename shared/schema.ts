import { pgTable, text, varchar, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const explanations = pgTable("explanations", {
  id: serial("id").primaryKey(),
  originalText: text("original_text").notNull(),
  simplifiedText: text("simplified_text").notNull(),
  summary: text("summary").notNull(),
  actionItems: text("action_items").array().notNull(),
  keyPoints: text("key_points").array().notNull(),
  tone: text("tone").notNull().default("neutral"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertExplanationSchema = createInsertSchema(explanations).omit({
  id: true,
  createdAt: true,
});

export type InsertExplanation = z.infer<typeof insertExplanationSchema>;
export type Explanation = typeof explanations.$inferSelect;

export const simplifyRequestSchema = z.object({
  text: z.string().min(10, "Please provide at least 10 characters of text"),
});

export type SimplifyRequest = z.infer<typeof simplifyRequestSchema>;

export interface SimplifiedResult {
  summary: string;
  simplifiedText: string;
  actionItems: string[];
  keyPoints: string[];
  tone: "urgent" | "informational" | "positive" | "neutral";
  originalLength: number;
  simplifiedLength: number;
}
