import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Sparkles } from 'lucide-react';

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: { category?: string; cuisine?: string; skillLevel?: string }) => void;
  onAiFilter: () => void;
}

export default function SearchFilterBar({ onSearch, onFilter, onAiFilter }: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ category?: string; cuisine?: string; skillLevel?: string }>({});

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <section className="bg-white py-8 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search portfolios, recipes, techniques..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 py-3 rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select onValueChange={(value) => handleFilterChange('cuisine', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('skillLevel', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Skill Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skill Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={onAiFilter}
              className="bg-accent text-white hover:bg-accent/90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Filter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
