import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPortfolioSchema, 
  insertCaseStudySchema, 
  insertUserPreferencesSchema 
} from "@shared/schema";
import { generateRecommendations, generateCookingInsights, analyzeRecipe } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Portfolio routes
  app.get("/api/portfolios", async (req, res) => {
    try {
      const { category, cuisine, skillLevel, search } = req.query;
      const portfolios = await storage.getAllPortfolios({
        category: category as string,
        cuisine: cuisine as string,
        skillLevel: skillLevel as string,
        search: search as string
      });
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  app.get("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Increment view count
      await storage.updatePortfolioViews(id);
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validatedData);
      res.status(201).json(portfolio);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio data" });
    }
  });

  // Case study routes
  app.get("/api/case-studies", async (req, res) => {
    try {
      const caseStudies = await storage.getAllCaseStudies();
      res.json(caseStudies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case studies" });
    }
  });

  app.get("/api/case-studies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const caseStudy = await storage.getCaseStudy(id);
      if (!caseStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      res.json(caseStudy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case study" });
    }
  });

  app.post("/api/case-studies", async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.parse(req.body);
      const caseStudy = await storage.createCaseStudy(validatedData);
      res.status(201).json(caseStudy);
    } catch (error) {
      res.status(400).json({ message: "Invalid case study data" });
    }
  });

  // User preferences routes
  app.get("/api/preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await storage.getUserPreferences(userId);
      if (!preferences) {
        // Return default preferences if none exist
        return res.json({
          skillLevel: "Intermediate",
          preferredCuisines: ["Italian", "Asian"],
          cookingStyle: "Traditional",
          timeAvailable: "30-60 min",
          dietaryRestrictions: [],
          favoriteIngredients: []
        });
      }
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post("/api/preferences", async (req, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.updateUserPreferences(validatedData);
      res.json(preferences);
    } catch (error) {
      res.status(400).json({ message: "Invalid preferences data" });
    }
  });

  // AI recommendation routes
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
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

      res.json(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // AI insights route
  app.get("/api/insights/:portfolioId", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const insights = await generateCookingInsights(portfolio);
      res.json({ insights });
    } catch (error) {
      console.error('Error generating insights:', error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  // Recipe analysis route
  app.post("/api/analyze-recipe", async (req, res) => {
    try {
      const { recipeText } = req.body;
      if (!recipeText) {
        return res.status(400).json({ message: "Recipe text is required" });
      }

      const analysis = await analyzeRecipe(recipeText);
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing recipe:', error);
      res.status(500).json({ message: "Failed to analyze recipe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
