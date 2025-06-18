import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Clock, FlaskRound, BarChart3, Lightbulb, FileText } from 'lucide-react';
import { Link } from 'wouter';

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const caseStudyId = parseInt(id || '0');

  const { data: caseStudy, isLoading } = useQuery({
    queryKey: [api.caseStudies.getById(caseStudyId)],
    enabled: !!caseStudyId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="w-full h-64 rounded-2xl mb-8" />
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

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Case Study Not Found</h1>
              <p className="text-gray-600 mb-6">The case study you're looking for doesn't exist.</p>
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
            Back to Home
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="relative mb-8">
          <img 
            src={caseStudy.imageUrl} 
            alt={caseStudy.title}
            className="w-full h-64 object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-white">
              Case Study
            </Badge>
          </div>
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {caseStudy.readTime}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{caseStudy.category}</Badge>
            <Badge variant="outline" className="flex items-center">
              <FlaskRound className="h-3 w-3 mr-1" />
              {caseStudy.experimentsCount} experiments
            </Badge>
          </div>
          
          <h1 className="text-4xl font-display font-bold text-dark mb-4">{caseStudy.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{caseStudy.description}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{caseStudy.author}</p>
              <p className="text-gray-600">Published {caseStudy.publishedAt}</p>
            </div>
          </div>
        </div>

        {/* Study Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FlaskRound className="h-5 w-5 mr-2 text-accent" />
                Methodology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{caseStudy.methodology}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Key Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{caseStudy.results}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-secondary" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{caseStudy.insights}</p>
            </CardContent>
          </Card>
        </div>

        {/* Full Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {caseStudy.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-primary p-6 rounded-xl">
              <h4 className="font-semibold text-lg mb-3">What We Learned</h4>
              <p className="text-gray-700 mb-4">{caseStudy.insights}</p>
              
              <Separator className="my-4" />
              
              <h4 className="font-semibold text-lg mb-3">Practical Applications</h4>
              <p className="text-gray-700">{caseStudy.results}</p>
            </div>
          </CardContent>
        </Card>

        {/* Study Metadata */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Study Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Research Method</h4>
                <p className="text-gray-700 text-sm">{caseStudy.methodology}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Study Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experiments:</span>
                    <span>{caseStudy.experimentsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Read Time:</span>
                    <span>{caseStudy.readTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span>{caseStudy.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span>{caseStudy.publishedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Apply These Techniques
          </Button>
          <Button variant="outline">
            Save Study
          </Button>
          <Button variant="outline">
            Share Insights
          </Button>
        </div>
      </div>
    </div>
  );
}
