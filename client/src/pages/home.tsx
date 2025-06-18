import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/navigation';
import SearchFilterBar from '@/components/search-filter-bar';
import PortfolioCard from '@/components/portfolio-card';
import CaseStudyCard from '@/components/case-study-card';
import AiRecommendations from '@/components/ai-recommendations';
import { Search, Sparkles, Brain, Lightbulb, TrendingUp, Grid, List } from 'lucide-react';
import type { Portfolio, CaseStudy } from '@shared/schema';

export default function Home() {
  const [filters, setFilters] = useState<{ category?: string; cuisine?: string; skillLevel?: string; search?: string }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: portfolios, isLoading: portfoliosLoading } = useQuery<Portfolio[]>({
    queryKey: ['/api/portfolios', filters],
  });

  const { data: caseStudies, isLoading: caseStudiesLoading } = useQuery<CaseStudy[]>({
    queryKey: ['/api/case-studies'],
  });

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilter = (newFilters: { category?: string; cuisine?: string; skillLevel?: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAiFilter = () => {
    // TODO: Implement AI-powered filtering
    console.log('AI Filter clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-warm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6">
              Discover Amazing<br />
              <span className="text-primary">Home Cooking</span> Stories
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore curated portfolio examples and detailed case studies from talented home cooks. 
              Get AI-powered insights and recommendations tailored to your cooking style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90"
                onClick={() => document.getElementById('portfolios-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Portfolios
              </Button>
              <Link href="/ai-tools">
                <Button variant="outline" className="border-2 border-primary text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary hover:text-white">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Recommendations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <SearchFilterBar 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onAiFilter={handleAiFilter}
      />

      {/* Featured AI Insights */}
      <section className="py-16 bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-dark mb-4">AI-Powered Cooking Insights</h2>
            <p className="text-gray-600 text-lg">Discover personalized recommendations and cooking tips powered by advanced AI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="text-accent h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Smart Recipe Analysis</h3>
                <p className="text-gray-600 mb-4">AI analyzes cooking techniques, ingredient combinations, and flavor profiles to suggest improvements.</p>
                <Link href="/ai-tools">
                  <Button variant="link" className="text-accent font-medium hover:underline p-0">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Personalized Suggestions</h3>
                <p className="text-gray-600 mb-4">Get tailored portfolio recommendations based on your cooking style and preferences.</p>
                <Link href="/ai-tools">
                  <Button variant="link" className="text-primary font-medium hover:underline p-0">
                    Explore →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-secondary h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Skill Progression</h3>
                <p className="text-gray-600 mb-4">Track your cooking journey with AI-powered skill assessment and growth recommendations.</p>
                <Link href="/ai-tools">
                  <Button variant="link" className="text-secondary font-medium hover:underline p-0">
                    Get Started →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolios-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-dark mb-2">Featured Portfolios</h2>
              <p className="text-gray-600">Discover amazing home cooking projects and their stories</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {portfoliosLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Skeleton className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <Skeleton className="h-3 w-16 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios?.map((portfolio) => (
                <Link key={portfolio.id} href={`/portfolio/${portfolio.id}`}>
                  <PortfolioCard 
                    portfolio={portfolio} 
                    onClick={() => {}} 
                  />
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/case-studies">
              <Button className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90">
                View All Portfolios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-dark mb-4">In-Depth Case Studies</h2>
            <p className="text-gray-600 text-lg">Learn from detailed analysis of successful cooking projects</p>
          </div>

          {caseStudiesLoading ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="lg:flex">
                    <Skeleton className="w-full lg:w-1/2 h-48 lg:h-full" />
                    <CardContent className="p-6 lg:w-1/2">
                      <Skeleton className="h-4 w-20 mb-3" />
                      <Skeleton className="h-6 w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {caseStudies?.slice(0, 4).map((caseStudy) => (
                <Link key={caseStudy.id} href={`/case-study/${caseStudy.id}`}>
                  <CaseStudyCard 
                    caseStudy={caseStudy} 
                    onClick={() => {}} 
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendations */}
      <AiRecommendations userId={1} />

      {/* Footer */}
      <footer className="bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display font-bold text-xl mb-4 text-primary">CookCraft</h3>
              <p className="text-gray-300 mb-4">Discover, learn, and share amazing home cooking stories with AI-powered insights.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-facebook"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    onClick={() => document.getElementById('portfolios-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Browse Portfolios
                  </button>
                </li>
                <li><Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link href="/ai-tools" className="hover:text-white transition-colors">AI Tools</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Cooking Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technique Library</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Insights</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-300 mb-4">Get the latest cooking insights and portfolio updates.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="bg-primary px-4 py-2 rounded-r-lg hover:bg-primary/90">
                  →
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CookCraft. All rights reserved. Powered by AI innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
