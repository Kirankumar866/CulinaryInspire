import type { Context, Config } from "@netlify/functions";
import { storage } from "../../server/storage";
import { generateCookingInsights } from "../../server/services/openai";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  
  try {
    // Handle GET /api/insights/:portfolioId
    if (method === "GET") {
      const pathParts = url.pathname.split('/');
      const portfolioId = parseInt(pathParts[pathParts.length - 1]);
      
      if (!isNaN(portfolioId)) {
        const portfolio = await storage.getPortfolio(portfolioId);
        
        if (!portfolio) {
          return new Response(JSON.stringify({ message: "Portfolio not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        const insights = await generateCookingInsights(portfolio);
        
        return new Response(JSON.stringify({ insights }), {
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
    console.error('Error generating insights:', error);
    return new Response(JSON.stringify({ message: "Failed to generate insights" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/insights/*"
};
