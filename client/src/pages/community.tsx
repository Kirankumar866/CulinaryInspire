import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageCircle, Star, TrendingUp, Calendar, Award } from "lucide-react";

export default function Community() {
  // Mock community data
  const featuredCooks = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Sourdough Specialist",
      followers: 1234,
      recipes: 45,
      avatar: "SC",
      specialty: "Artisan Breads"
    },
    {
      id: 2,
      name: "Marco Rossi",
      title: "Italian Heritage Cook",
      followers: 987,
      recipes: 32,
      avatar: "MR",
      specialty: "Traditional Italian"
    },
    {
      id: 3,
      name: "Emma Laurent",
      title: "Pastry Enthusiast",
      followers: 2156,
      recipes: 67,
      avatar: "EL",
      specialty: "French Pastries"
    }
  ];

  const discussions = [
    {
      id: 1,
      title: "Perfect sourdough starter maintenance tips?",
      author: "BreadLover42",
      replies: 23,
      lastActivity: "2 hours ago",
      category: "Baking"
    },
    {
      id: 2,
      title: "Best techniques for pasta dough hydration",
      author: "PastaMaster",
      replies: 15,
      lastActivity: "4 hours ago",
      category: "Italian"
    },
    {
      id: 3,
      title: "Temperature control for chocolate tempering",
      author: "ChocolateChef",
      replies: 31,
      lastActivity: "6 hours ago",
      category: "Pastry"
    }
  ];

  const challenges = [
    {
      id: 1,
      title: "30-Day Bread Challenge",
      description: "Master a different bread technique each day",
      participants: 156,
      daysLeft: 12,
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "Perfect Pasta Week",
      description: "Create 7 different pasta dishes from scratch",
      participants: 89,
      daysLeft: 5,
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "French Patisserie Month",
      description: "Learn classic French pastry techniques",
      participants: 203,
      daysLeft: 18,
      difficulty: "Advanced"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Cooking Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with passionate home cooks, share experiences, and learn from 
            each other's culinary journeys.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">2,847</div>
              <div className="text-sm text-gray-500">Active Cooks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">1,293</div>
              <div className="text-sm text-gray-500">Discussions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">8,654</div>
              <div className="text-sm text-gray-500">Recipe Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-gray-500">Active Challenges</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Cooks */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Featured Cooks
                </CardTitle>
                <CardDescription>
                  Top contributors in our community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredCooks.map((cook) => (
                  <div key={cook.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar>
                      <AvatarFallback>{cook.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{cook.name}</p>
                      <p className="text-xs text-gray-500">{cook.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">{cook.followers} followers</span>
                        <span className="text-xs text-gray-400">{cook.recipes} recipes</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cook.specialty}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Cooks
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Discussions and Challenges */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Discussions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Recent Discussions
                </CardTitle>
                <CardDescription>
                  Join the conversation with fellow cooks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 hover:text-primary cursor-pointer">
                          {discussion.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>by {discussion.author}</span>
                          <span>{discussion.replies} replies</span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {discussion.category}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Discussions
                </Button>
              </CardContent>
            </Card>

            {/* Active Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Active Challenges
                </CardTitle>
                <CardDescription>
                  Join cooking challenges and improve your skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{challenge.title}</h4>
                      <Badge variant={
                        challenge.difficulty === "Beginner" ? "secondary" :
                        challenge.difficulty === "Intermediate" ? "default" : "destructive"
                      } className="text-xs">
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{challenge.participants} participants</span>
                        <span>{challenge.daysLeft} days left</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Join Challenge
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Challenges
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}