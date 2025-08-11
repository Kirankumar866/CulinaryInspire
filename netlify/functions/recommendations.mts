import type { Context, Config } from "@netlify/functions";
import { storage } from "../../server/storage";
import { generateRecommendations } from "../../server/services/openai";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  
  try {
    // Handle GET /api/recommendations/:userId
    if (method === "GET") {
      const pathParts = url.pathname.split('/');
      const userId = parseInt(pathParts[pathParts.length - 1]);
      
      if (!isNaN(userId)) {
        // Get user preferences (use defaults if none exist)
        let preferences = await storage.getUserPreferences(userId);
        if (!preferences) {
          preferences = {
            id: 0,
            userId,
            skillLevel: "Intermediate",
            preferredCuisines: ["Italian", "Asian"],
            cookingStyle: "Traditional",
            timeAvailable: "30-60 min",
            dietaryRestrictions: [],
            favoriteIngredients: []
          };
        }

        // Get all portfolios for AI analysis
        const portfolios = await storage.getAllPortfolios();
        
        // Generate AI recommendations
        const aiResult = await generateRecommendations(preferences, portfolios);
        
        // Store recommendations in storage
        const recommendations = [];
        for (const rec of aiResult.recommendations) {
          const recommendation = await storage.createAiRecommendation({
            userId,
            type: 'portfolio',
            title: rec.title,
            description: rec.description,
            matchScore: rec.matchScore,
            reasoning: rec.reasoning,
            targetId: rec.portfolioId
          });
          recommendations.push({
            ...recommendation,
            portfolio: portfolios.find(p => p.id === rec.portfolioId)
          });
        }

        return new Response(JSON.stringify(recommendations), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(JSON.stringify({ message: "Failed to generate recommendations" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/recommendations/*"
};
