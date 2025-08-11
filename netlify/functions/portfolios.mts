import type { Context, Config } from "@netlify/functions";
import { storage } from "../../server/storage";
import { insertPortfolioSchema } from "../../shared/schema";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  
  try {
    // Handle GET /api/portfolios
    if (method === "GET" && !url.pathname.includes("/", 15)) {
      const searchParams = url.searchParams;
      const portfolios = await storage.getAllPortfolios({
        category: searchParams.get('category') || undefined,
        cuisine: searchParams.get('cuisine') || undefined,
        skillLevel: searchParams.get('skillLevel') || undefined,
        search: searchParams.get('search') || undefined
      });
      
      return new Response(JSON.stringify(portfolios), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Handle GET /api/portfolios/:id
    if (method === "GET") {
      const pathParts = url.pathname.split('/');
      const id = parseInt(pathParts[pathParts.length - 1]);
      
      if (!isNaN(id)) {
        const portfolio = await storage.getPortfolio(id);
        if (!portfolio) {
          return new Response(JSON.stringify({ message: "Portfolio not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        // Increment view count
        await storage.updatePortfolioViews(id);
        
        return new Response(JSON.stringify(portfolio), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Handle POST /api/portfolios
    if (method === "POST") {
      const body = await req.json();
      const validatedData = insertPortfolioSchema.parse(body);
      const portfolio = await storage.createPortfolio(validatedData);
      
      return new Response(JSON.stringify(portfolio), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Portfolio function error:', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: ["/api/portfolios", "/api/portfolios/*"]
};
