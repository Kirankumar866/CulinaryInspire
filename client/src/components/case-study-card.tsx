import { Badge } from '@/components/ui/badge';
import { Clock, FlaskRound, BarChart3, Thermometer } from 'lucide-react';
import type { CaseStudy } from '@shared/schema';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: () => void;
}

export default function CaseStudyCard({ caseStudy, onClick }: CaseStudyCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Baking Science': 'bg-primary/10 text-primary',
      'Technique Study': 'bg-accent/10 text-accent',
      'Fundamental Skills': 'bg-secondary/10 text-secondary',
      'Cooking Science': 'bg-primary/10 text-primary',
    };
    return colors[category] || 'bg-gray/10 text-gray-600';
  };

  const getIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      'Baking Science': <FlaskRound className="text-accent h-5 w-5" />,
      'Technique Study': <BarChart3 className="text-secondary h-5 w-5" />,
      'Fundamental Skills': <Clock className="text-primary h-5 w-5" />,
      'Cooking Science': <Thermometer className="text-primary h-5 w-5" />,
    };
    return icons[category] || <FlaskRound className="text-gray-600 h-5 w-5" />;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="lg:flex">
        <div className="lg:w-1/2">
          <img 
            src={caseStudy.imageUrl} 
            alt={caseStudy.title}
            className="w-full h-48 lg:h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-6 lg:w-1/2">
          <div className="flex items-center justify-between mb-3">
            <Badge className={getCategoryColor(caseStudy.category)}>
              Case Study
            </Badge>
            <span className="text-sm text-gray-500">{caseStudy.readTime}</span>
          </div>
          
          <h3 className="font-display font-semibold text-xl mb-3">{caseStudy.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{caseStudy.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getIcon(caseStudy.category)}
              <span className="text-sm text-gray-600 ml-2">
                {caseStudy.experimentsCount} experiments
              </span>
            </div>
            <span className="text-primary font-medium text-sm hover:underline">
              Read Study →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
