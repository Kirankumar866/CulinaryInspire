import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Eye, Clock, ChefHat, Users, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const portfolioId = parseInt(id || '0');

  const { data: portfolio, isLoading } = useQuery({
    queryKey: [api.portfolios.getById(portfolioId)],
    enabled: !!portfolioId,
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: [api.ai.getInsights(portfolioId)],
    enabled: !!portfolioId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="w-full h-96 rounded-2xl mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
              <p className="text-gray-600 mb-6">The portfolio you're looking for doesn't exist.</p>
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolios
          </Button>
        </Link>

        {/* Hero Image */}
        <div className="relative mb-8">
          <img 
            src={portfolio.imageUrl} 
            alt={portfolio.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-white">
              {portfolio.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {portfolio.views?.toLocaleString()} views
          </div>
        </div>

        {/* Portfolio Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">{portfolio.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{portfolio.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={portfolio.cookAvatarUrl}
                alt={portfolio.cookName}
                className="w-12 h-12 rounded-full mr-4 object-cover"
                loading="lazy"
              />
              <div>
                <h3 className="font-semibold text-lg">{portfolio.cookName}</h3>
                <p className="text-gray-600">{portfolio.cookTitle}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline">{portfolio.skillLevel}</Badge>
              <Badge variant="outline">{portfolio.cuisine}</Badge>
            </div>
          </div>
        </div>

        {/* Portfolio Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Techniques & Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChefHat className="h-5 w-5 mr-2" />
                Techniques & Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.techniques?.map((technique, index) => (
                      <Badge key={index} variant="secondary">{technique}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Primary Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.ingredients?.map((ingredient, index) => (
                      <Badge key={index} variant="outline">{ingredient}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Required</span>
                  <span className="font-medium">{portfolio.timeRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <Badge variant="outline">{portfolio.difficulty}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skill Level</span>
                  <Badge variant="outline">{portfolio.skillLevel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cuisine Type</span>
                  <span className="font-medium">{portfolio.cuisine}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        {portfolio.story && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                The Story Behind This Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{portfolio.story}</p>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              AI-Generated Cooking Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-line text-gray-700">{insights?.insights}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        {portfolio.tags && portfolio.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {portfolio.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Sparkles className="h-4 w-4 mr-2" />
            Get AI Recipe Analysis
          </Button>
          <Button variant="outline">
            Save to Collection
          </Button>
          <Button variant="outline">
            Share Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
