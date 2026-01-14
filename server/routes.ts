import type { Express } from "express";
import { createServer, type Server } from "http";
import { simplifyRequestSchema } from "@shared/schema";
import { simplifyText } from "./services/simplify";
import { generateImagesForKeyPoints } from "./services/imageGen";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/simplify", async (req, res) => {
    try {
      const validation = simplifyRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request",
          details: validation.error.errors 
        });
      }

      const { text } = validation.data;

      const result = await simplifyText(text);

      let images: string[] = [];
      try {
        images = await generateImagesForKeyPoints(result.keyPoints);
      } catch (imageError) {
        console.error("Error generating images:", imageError);
      }

      res.json({ result, images });
    } catch (error) {
      console.error("Error processing simplify request:", error);
      res.status(500).json({ 
        error: "Failed to process your letter. Please try again." 
      });
    }
  });

  return httpServer;
}
