import OpenAI from "openai";
import type { Portfolio, CaseStudy, UserPreferences } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key" 
});

export async function generateRecommendations(
  userPreferences: UserPreferences,
  portfolios: Portfolio[]
): Promise<{
  recommendations: Array<{
    portfolioId: number;
    title: string;
    description: string;
    matchScore: number;
    reasoning: string;
  }>;
}> {
  try {
    const prompt = `
    You are an AI cooking assistant helping to recommend portfolios based on user preferences.
    
    User Preferences:
    - Skill Level: ${userPreferences.skillLevel}
    - Preferred Cuisines: ${userPreferences.preferredCuisines?.join(', ') || 'Any'}
    - Cooking Style: ${userPreferences.cookingStyle}
    - Time Available: ${userPreferences.timeAvailable}
    - Dietary Restrictions: ${userPreferences.dietaryRestrictions?.join(', ') || 'None'}
    - Favorite Ingredients: ${userPreferences.favoriteIngredients?.join(', ') || 'None specified'}

    Available Portfolios:
    ${portfolios.map(p => `
    ID: ${p.id}
    Title: ${p.title}
    Category: ${p.category}
    Cuisine: ${p.cuisine}
    Skill Level: ${p.skillLevel}
    Description: ${p.description}
    Techniques: ${p.techniques?.join(', ') || 'None'}
    Time Required: ${p.timeRequired}
    Difficulty: ${p.difficulty}
    `).join('\n---\n')}

    Please recommend the top 3 portfolios for this user. For each recommendation, provide:
    1. The portfolio ID
    2. A personalized title explaining why it matches
    3. A description of why it's recommended
    4. A match score (0-100)
    5. Detailed reasoning for the recommendation

    Respond with JSON in this exact format:
    {
      "recommendations": [
        {
          "portfolioId": number,
          "title": "string",
          "description": "string", 
          "matchScore": number,
          "reasoning": "string"
        }
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert culinary AI assistant that provides personalized cooking recommendations based on user preferences and skill levels."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return { recommendations: [] };
  }
}

export async function generateCookingInsights(portfolio: Portfolio): Promise<string> {
  try {
    const prompt = `
    Generate cooking insights and tips for this portfolio:
    
    Title: ${portfolio.title}
    Description: ${portfolio.description}
    Category: ${portfolio.category}
    Techniques: ${portfolio.techniques?.join(', ') || 'None'}
    Ingredients: ${portfolio.ingredients?.join(', ') || 'None'}
    Story: ${portfolio.story}
    
    Provide 3-4 actionable cooking insights that would help home cooks succeed with this type of cooking.
    Focus on practical tips, common mistakes to avoid, and professional techniques.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional chef and cooking instructor providing practical advice to home cooks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return response.choices[0].message.content || "Unable to generate insights at this time.";
  } catch (error) {
    console.error('Error generating cooking insights:', error);
    return "Unable to generate insights at this time.";
  }
}

export async function analyzeRecipe(recipeText: string): Promise<{
  difficulty: string;
  estimatedTime: string;
  keyTechniques: string[];
  suggestions: string[];
}> {
  try {
    const prompt = `
    Analyze this recipe and provide insights:
    
    Recipe: ${recipeText}
    
    Please analyze and provide:
    1. Difficulty level (Beginner/Intermediate/Advanced/Expert)
    2. Estimated cooking time
    3. Key techniques involved
    4. Suggestions for improvement or variations
    
    Respond with JSON in this format:
    {
      "difficulty": "string",
      "estimatedTime": "string", 
      "keyTechniques": ["technique1", "technique2"],
      "suggestions": ["suggestion1", "suggestion2"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional chef analyzing recipes for home cooks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      difficulty: result.difficulty || "Unknown",
      estimatedTime: result.estimatedTime || "Unknown",
      keyTechniques: result.keyTechniques || [],
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error('Error analyzing recipe:', error);
    return {
      difficulty: "Unknown",
      estimatedTime: "Unknown", 
      keyTechniques: [],
      suggestions: []
    };
  }
}
