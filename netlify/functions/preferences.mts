import type { Context, Config } from "@netlify/functions";
import { storage } from "../../server/storage";
import { insertUserPreferencesSchema } from "../../shared/schema";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  
  try {
    // Handle GET /api/preferences/:userId
    if (method === "GET") {
      const pathParts = url.pathname.split('/');
      const userId = parseInt(pathParts[pathParts.length - 1]);
      
      if (!isNaN(userId)) {
        const preferences = await storage.getUserPreferences(userId);
        if (!preferences) {
          // Return default preferences if none exist
          return new Response(JSON.stringify({
            skillLevel: "Intermediate",
            preferredCuisines: ["Italian", "Asian"],
            cookingStyle: "Traditional",
            timeAvailable: "30-60 min",
            dietaryRestrictions: [],
            favoriteIngredients: []
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        return new Response(JSON.stringify(preferences), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Handle POST /api/preferences
    if (method === "POST") {
      const body = await req.json();
      const validatedData = insertUserPreferencesSchema.parse(body);
      const preferences = await storage.updateUserPreferences(validatedData);
      
      return new Response(JSON.stringify(preferences), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Preferences function error:', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: ["/api/preferences", "/api/preferences/*"]
};
