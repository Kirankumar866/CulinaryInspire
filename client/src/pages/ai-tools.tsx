import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, ChefHat, Clock } from "lucide-react";
import AiRecommendations from "@/components/ai-recommendations";

export default function AiTools() {
  const [recipeText, setRecipeText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeRecipe = async () => {
    if (!recipeText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeText }),
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing recipe:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            AI Cooking Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage artificial intelligence to enhance your cooking experience with 
            personalized recommendations and recipe analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recipe Analyzer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Recipe Analyzer
              </CardTitle>
              <CardDescription>
                Paste any recipe and get AI-powered insights on cooking techniques, 
                difficulty level, and optimization suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your recipe here..."
                value={recipeText}
                onChange={(e) => setRecipeText(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={analyzeRecipe}
                disabled={!recipeText.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Recipe
                  </>
                )}
              </Button>
              
              {analysis && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Analysis Results:</h4>
                  <div className="space-y-2">
                    {analysis.difficulty && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{analysis.difficulty}</Badge>
                        <span className="text-sm text-gray-600">Difficulty</span>
                      </div>
                    )}
                    {analysis.cookingTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{analysis.cookingTime}</span>
                      </div>
                    )}
                    {analysis.techniques && (
                      <div>
                        <span className="text-sm font-medium">Key Techniques:</span>
                        <p className="text-sm text-gray-600 mt-1">{analysis.techniques}</p>
                      </div>
                    )}
                    {analysis.suggestions && (
                      <div>
                        <span className="text-sm font-medium">Suggestions:</span>
                        <p className="text-sm text-gray-600 mt-1">{analysis.suggestions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>
                Get AI-curated recipe recommendations based on your preferences and skill level.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AiRecommendations userId={1} />
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Smart Substitutions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Find ingredient substitutions based on dietary restrictions, 
                availability, and flavor profiles.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meal Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Generate weekly meal plans based on your preferences, 
                dietary needs, and available time.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutrition Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get detailed nutritional breakdowns and suggestions 
                for healthier recipe modifications.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}