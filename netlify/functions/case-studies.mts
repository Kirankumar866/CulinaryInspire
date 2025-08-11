import type { Context, Config } from "@netlify/functions";
import { storage } from "../../server/storage";
import { insertCaseStudySchema } from "../../shared/schema";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  
  try {
    // Handle GET /api/case-studies
    if (method === "GET" && !url.pathname.includes("/", 18)) {
      const caseStudies = await storage.getAllCaseStudies();
      
      return new Response(JSON.stringify(caseStudies), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Handle GET /api/case-studies/:id
    if (method === "GET") {
      const pathParts = url.pathname.split('/');
      const id = parseInt(pathParts[pathParts.length - 1]);
      
      if (!isNaN(id)) {
        const caseStudy = await storage.getCaseStudy(id);
        if (!caseStudy) {
          return new Response(JSON.stringify({ message: "Case study not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        return new Response(JSON.stringify(caseStudy), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Handle POST /api/case-studies
    if (method === "POST") {
      const body = await req.json();
      const validatedData = insertCaseStudySchema.parse(body);
      const caseStudy = await storage.createCaseStudy(validatedData);
      
      return new Response(JSON.stringify(caseStudy), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Case studies function error:', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: ["/api/case-studies", "/api/case-studies/*"]
};
