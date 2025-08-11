import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import type { Portfolio } from '@shared/schema';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: () => void;
}

export default function PortfolioCard({ portfolio, onClick }: PortfolioCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Baking': 'bg-primary/10 text-primary',
      'Italian': 'bg-accent/10 text-accent',
      'Pastry': 'bg-secondary/10 text-secondary',
      'Asian Fusion': 'bg-accent/10 text-accent',
      'Mediterranean': 'bg-primary/10 text-primary',
      'Molecular': 'bg-secondary/10 text-secondary',
    };
    return colors[category] || 'bg-gray/10 text-gray-600';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer card-hover"
    >
      <img 
        src={portfolio.imageUrl} 
        alt={portfolio.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getCategoryColor(portfolio.category)}>
            {portfolio.category}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            {portfolio.views?.toLocaleString() || 0} views
          </div>
        </div>
        
        <h3 className="font-display font-semibold text-xl mb-2">{portfolio.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{portfolio.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={portfolio.cookAvatarUrl}
              alt={portfolio.cookName}
              className="w-8 h-8 rounded-full mr-3 flex-shrink-0 object-cover"
              loading="lazy"
            />
            <div>
              <p className="font-medium text-sm">{portfolio.cookName}</p>
              <p className="text-gray-500 text-xs">{portfolio.cookTitle}</p>
            </div>
          </div>
          <span className="text-primary font-medium text-sm hover:underline">
            View Portfolio →
          </span>
        </div>
      </div>
    </div>
  );
}
