import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Brain, Lightbulb, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

interface AiRecommendationsProps {
  userId: number;
}

export default function AiRecommendations({ userId }: AiRecommendationsProps) {
  const { data: recommendations, isLoading, refetch, isFetching } = useQuery({
    queryKey: [api.ai.getRecommendations(userId)],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: preferences } = useQuery({
    queryKey: [api.preferences.getByUserId(userId)],
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-accent rounded-3xl p-8 shadow-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-dark mb-4">
            Personalized AI Recommendations
          </h2>
          <p className="text-gray-600 text-lg">
            Get tailored suggestions based on your cooking preferences and skill level
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* User Profile Section */}
            <div>
              <h3 className="text-2xl font-display font-semibold mb-4">Your Cooking Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Skill Level</span>
                  <Badge className="bg-accent/10 text-accent">
                    {preferences?.skillLevel || 'Intermediate'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preferred Cuisine</span>
                  <Badge className="bg-primary/10 text-primary">
                    {preferences?.preferredCuisines?.join(', ') || 'Italian, Asian'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cooking Style</span>
                  <Badge className="bg-secondary/10 text-secondary">
                    {preferences?.cookingStyle || 'Traditional'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Available</span>
                  <Badge className="bg-accent/10 text-accent">
                    {preferences?.timeAvailable || '30-60 min'}
                  </Badge>
                </div>
              </div>
              <Button 
                className="mt-6 bg-primary text-white hover:bg-primary/90"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Update Recommendations
              </Button>
            </div>

            {/* AI Recommendations Section */}
            <div>
              <h3 className="text-2xl font-display font-semibold mb-4">Recommended for You</h3>
              <div className="space-y-4">
                {recommendations?.map((rec: any, index: number) => {
                  const getScoreColor = (score: number) => {
                    if (score >= 90) return 'text-accent';
                    if (score >= 80) return 'text-primary';
                    return 'text-secondary';
                  };

                  const getIcon = (index: number) => {
                    const icons = [Brain, Lightbulb, TrendingUp];
                    const Icon = icons[index % icons.length];
                    return <Icon className="h-5 w-5 text-gray-400" />;
                  };

                  return (
                    <Card key={rec.id} className="border border-gray-200 hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getIcon(index)}
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                              {rec.reasoning && (
                                <p className="text-xs text-gray-500 italic">{rec.reasoning}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-sm font-medium ${getScoreColor(rec.matchScore)}`}>
                              {rec.matchScore}% match
                            </div>
                            <div className="text-xs text-gray-500">AI Score</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {!recommendations?.length && (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="p-8 text-center">
                      <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-600 mb-2">No recommendations yet</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Click "Update Recommendations" to get AI-powered suggestions
                      </p>
                      <Button 
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Recommendations
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
