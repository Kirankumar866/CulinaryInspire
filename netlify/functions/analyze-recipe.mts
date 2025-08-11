import type { Context, Config } from "@netlify/functions";
import { analyzeRecipe } from "../../server/services/openai";

export default async (req: Request, context: Context) => {
  const method = req.method;
  
  try {
    // Handle POST /api/analyze-recipe
    if (method === "POST") {
      const body = await req.json();
      const { recipeText } = body;
      
      if (!recipeText) {
        return new Response(JSON.stringify({ message: "Recipe text is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const analysis = await analyzeRecipe(recipeText);
      
      return new Response(JSON.stringify(analysis), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Error analyzing recipe:', error);
    return new Response(JSON.stringify({ message: "Failed to analyze recipe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/analyze-recipe"
};
