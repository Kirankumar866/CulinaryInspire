import { apiRequest } from './queryClient';
import type { Portfolio, CaseStudy, UserPreferences } from '@shared/schema';

export const api = {
  // Portfolio operations
  portfolios: {
    getAll: (filters?: { category?: string; cuisine?: string; skillLevel?: string; search?: string }) => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.cuisine) params.append('cuisine', filters.cuisine);
      if (filters?.skillLevel) params.append('skillLevel', filters.skillLevel);
      if (filters?.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      return `/api/portfolios${queryString ? `?${queryString}` : ''}`;
    },
    getById: (id: number) => `/api/portfolios/${id}`,
    create: async (portfolio: any) => {
      const response = await apiRequest('POST', '/api/portfolios', portfolio);
      return response.json();
    }
  },

  // Case study operations
  caseStudies: {
    getAll: () => '/api/case-studies',
    getById: (id: number) => `/api/case-studies/${id}`,
    create: async (caseStudy: any) => {
      const response = await apiRequest('POST', '/api/case-studies', caseStudy);
      return response.json();
    }
  },

  // User preferences operations
  preferences: {
    getByUserId: (userId: number) => `/api/preferences/${userId}`,
    update: async (preferences: any) => {
      const response = await apiRequest('POST', '/api/preferences', preferences);
      return response.json();
    }
  },

  // AI operations
  ai: {
    getRecommendations: (userId: number) => `/api/recommendations/${userId}`,
    getInsights: (portfolioId: number) => `/api/insights/${portfolioId}`,
    analyzeRecipe: async (recipeText: string) => {
      const response = await apiRequest('POST', '/api/analyze-recipe', { recipeText });
      return response.json();
    }
  }
};
