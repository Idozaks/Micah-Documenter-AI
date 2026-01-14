import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { simplifyRequestSchema } from "@shared/schema";
import { simplifyText, simplifyImage } from "./services/simplify";
import { generateImagesForKeyPoints } from "./services/imageGen";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

      const { text, language } = validation.data;

      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const result = await simplifyText(text, language);

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

  app.post("/api/simplify-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const language = (req.body.language === "en" ? "en" : "he") as "he" | "en";
      
      const result = await simplifyImage(req.file.buffer, req.file.mimetype, language);

      let images: string[] = [];
      try {
        images = await generateImagesForKeyPoints(result.keyPoints);
      } catch (imageError) {
        console.error("Error generating images:", imageError);
      }

      res.json({ result, images });
    } catch (error) {
      console.error("Error processing image simplification:", error);
      const message = error instanceof Error ? error.message : "Failed to process image";
      res.status(500).json({ error: message });
    }
  });

  return httpServer;
}
