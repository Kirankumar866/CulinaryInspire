import { 
  portfolios, 
  caseStudies, 
  userPreferences, 
  aiRecommendations,
  type Portfolio, 
  type InsertPortfolio,
  type CaseStudy,
  type InsertCaseStudy,
  type UserPreferences,
  type InsertUserPreferences,
  type AiRecommendation,
  type InsertAiRecommendation,
  type User,
  type InsertUser
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolio operations
  getAllPortfolios(filters?: { category?: string; cuisine?: string; skillLevel?: string; search?: string }): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolioViews(id: number): Promise<void>;

  // Case study operations
  getAllCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(id: number): Promise<CaseStudy | undefined>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;

  // User preferences operations
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;

  // AI recommendations operations
  getAiRecommendations(userId: number): Promise<AiRecommendation[]>;
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolios: Map<number, Portfolio>;
  private caseStudies: Map<number, CaseStudy>;
  private userPreferences: Map<number, UserPreferences>;
  private aiRecommendations: Map<number, AiRecommendation>;
  private currentUserId: number;
  private currentPortfolioId: number;
  private currentCaseStudyId: number;
  private currentPreferencesId: number;
  private currentRecommendationId: number;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.caseStudies = new Map();
    this.userPreferences = new Map();
    this.aiRecommendations = new Map();
    this.currentUserId = 1;
    this.currentPortfolioId = 1;
    this.currentCaseStudyId = 1;
    this.currentPreferencesId = 1;
    this.currentRecommendationId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed portfolios with real cooking data
    const samplePortfolios: InsertPortfolio[] = [
      {
        title: "Artisan Sourdough Journey",
        description: "From starter to perfect crust - a 6-month exploration of traditional bread making techniques.",
        category: "Baking",
        cuisine: "European",
        skillLevel: "Intermediate",
        cookName: "Sarah Chen",
        cookTitle: "Home Baker",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["sourdough", "fermentation", "traditional", "artisan"],
        techniques: ["Autolyse", "Bulk fermentation", "Shaping", "Scoring"],
        ingredients: ["Bread flour", "Whole wheat flour", "Water", "Salt", "Sourdough starter"],
        timeRequired: "3-5 days",
        difficulty: "Medium",
        story: "My journey into sourdough began during lockdown when I wanted to master the ancient art of bread making. Through countless experiments with hydration levels, fermentation times, and shaping techniques, I've developed a method that consistently produces bakery-quality loaves at home."
      },
      {
        title: "Nonna's Pasta Secrets",
        description: "Traditional Italian pasta recipes passed down through generations, perfected in my modern kitchen.",
        category: "Italian",
        cuisine: "Italian",
        skillLevel: "Beginner",
        cookName: "Marco Rossi",
        cookTitle: "Heritage Cook",
        imageUrl: "https://pixabay.com/get/gecfa827e011888a1cceb224ba4c56fc82017e32e6e9f07eaaf23cccc16244f629a1e42be6ac6540aaa0a9a498c3980246536723568483631cde2b3bfa5a87864_1280.jpg",
        tags: ["pasta", "italian", "traditional", "family-recipes"],
        techniques: ["Hand-rolling", "Egg pasta", "Sauce pairing", "Fresh herbs"],
        ingredients: ["00 flour", "Eggs", "Olive oil", "Parmesan", "Fresh basil"],
        timeRequired: "2-3 hours",
        difficulty: "Easy",
        story: "These recipes come from my grandmother who taught me that pasta making is not just about technique, but about love and tradition. Each shape tells a story, each sauce has its perfect partner."
      },
      {
        title: "French Pastry Mastery",
        description: "Mastering the art of French pastry from basic techniques to complex multi-layered desserts.",
        category: "Pastry",
        cuisine: "French",
        skillLevel: "Advanced",
        cookName: "Emma Laurent",
        cookTitle: "Pastry Enthusiast",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["pastry", "french", "desserts", "precision"],
        techniques: ["Lamination", "Choux pastry", "Tempering chocolate", "Sugar work"],
        ingredients: ["Butter", "Flour", "Eggs", "Sugar", "Vanilla", "Chocolate"],
        timeRequired: "4-8 hours",
        difficulty: "Hard",
        story: "French pastry demands precision and patience. Every fold, every temperature matters. Through systematic practice and understanding the science behind each technique, I've learned to create desserts that rival those from Parisian patisseries."
      },
      {
        title: "Wok Mastery Journey",
        description: "Exploring the art of wok cooking and creating modern fusion dishes with traditional techniques.",
        category: "Asian Fusion",
        cuisine: "Asian",
        skillLevel: "Intermediate",
        cookName: "David Kim",
        cookTitle: "Fusion Chef",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["wok", "stir-fry", "fusion", "high-heat"],
        techniques: ["Wok hei", "Velvet chicken", "Flash cooking", "Sauce building"],
        ingredients: ["Soy sauce", "Garlic", "Ginger", "Scallions", "Sesame oil"],
        timeRequired: "30-45 minutes",
        difficulty: "Medium",
        story: "The wok is more than a cooking vessel - it's a tool for creating 'wok hei', that elusive breath of the wok that gives stir-fries their distinctive flavor. Learning to control the fierce heat and timing has opened up a world of quick, flavorful cooking."
      },
      {
        title: "Mediterranean Wellness",
        description: "Healthy, flavorful Mediterranean recipes that bring the taste of the coast to your kitchen.",
        category: "Mediterranean",
        cuisine: "Mediterranean",
        skillLevel: "Beginner",
        cookName: "Sofia Greco",
        cookTitle: "Wellness Cook",
        imageUrl: "https://images.unsplash.com/photo-1544124499-58912cbddaad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["mediterranean", "healthy", "olive-oil", "fresh"],
        techniques: ["Grilling", "Marinating", "Cold preparation", "Herb combinations"],
        ingredients: ["Olive oil", "Tomatoes", "Olives", "Feta", "Fresh herbs"],
        timeRequired: "30-60 minutes",
        difficulty: "Easy",
        story: "The Mediterranean diet isn't just about health - it's about celebrating fresh, seasonal ingredients with simple preparations that let their natural flavors shine. These recipes connect us to generations of coastal cooking wisdom."
      },
      {
        title: "Science Meets Flavor",
        description: "Experimental cooking techniques that transform ordinary ingredients into extraordinary experiences.",
        category: "Molecular",
        cuisine: "Modern",
        skillLevel: "Expert",
        cookName: "Alex Rivera",
        cookTitle: "Food Scientist",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["molecular", "science", "innovation", "technique"],
        techniques: ["Spherification", "Gelification", "Foam creation", "Temperature contrast"],
        ingredients: ["Agar", "Sodium alginate", "Liquid nitrogen", "Lecithin"],
        timeRequired: "2-4 hours",
        difficulty: "Expert",
        story: "Molecular gastronomy isn't about replacing traditional cooking - it's about understanding the science behind flavor and texture to create new experiences. Each technique opens up possibilities for surprising and delighting diners."
      }
    ];

    // Seed case studies
    const sampleCaseStudies: InsertCaseStudy[] = [
      {
        title: "Perfect Sourdough: A Scientific Approach",
        description: "Deep dive into the fermentation process, hydration ratios, and temperature control that creates the perfect sourdough.",
        category: "Baking Science",
        readTime: "15 min read",
        imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        content: "This comprehensive study examines the science behind sourdough fermentation, analyzing the complex interactions between wild yeast, lactobacilli, flour proteins, and environmental factors that contribute to perfect bread. Through controlled experiments varying hydration levels from 65% to 85%, we documented how water content affects crumb structure, crust development, and flavor complexity. Temperature monitoring revealed optimal fermentation occurs at 78-82°F, with significant flavor development differences observed across temperature ranges. Autolyse timing experiments demonstrated that 30-60 minutes produces optimal gluten development without overworking the dough. pH testing throughout the fermentation process showed correlation between acidity levels and final bread characteristics. The study includes detailed analysis of scoring techniques, oven spring optimization, and steam injection timing for crust development.",
        methodology: "Controlled environment testing with consistent flour batches, digital scales, pH meters, and temperature logging. Each variable tested in triplicate with statistical analysis.",
        results: "Optimal hydration at 75-78% for home bakers, fermentation temperature of 80°F, and 45-minute autolyse period produced consistently superior results.",
        insights: "Understanding the science enables consistent results. Small changes in technique create significant improvements in final bread quality.",
        experimentsCount: 12,
        author: "Dr. Sarah Chen & Baking Science Lab",
        publishedAt: "2024-03-15"
      },
      {
        title: "Hand-Rolled Pasta: Texture Analysis",
        description: "Comparing machine vs. hand-rolled pasta through texture, taste, and traditional technique preservation.",
        category: "Technique Study",
        readTime: "12 min read",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        content: "This study examines the textural and flavor differences between hand-rolled and machine-made pasta through systematic testing of 8 traditional pasta shapes. Using texture analysis equipment, we measured firmness, elasticity, and surface roughness of pasta made with identical dough using different methods. Hand-rolled pasta consistently showed 15-20% greater surface area due to slight irregularities that improve sauce adhesion. Blind taste tests with 50 participants revealed significant preference for hand-rolled pasta texture and sauce integration. The study documents traditional techniques including proper dough consistency, resting periods, and rolling patterns. Microscopic analysis reveals how hand-rolling creates unique surface textures that commercial machines cannot replicate. Time efficiency analysis shows machine methods save 60% preparation time but sacrifice textural qualities valued in traditional Italian cooking.",
        methodology: "Controlled pasta preparation using identical dough batches, texture analysis equipment, blind taste testing, and microscopic surface analysis.",
        results: "Hand-rolled pasta superior in texture, sauce adhesion, and taste preference despite longer preparation time.",
        insights: "Traditional techniques create irreplaceable textural qualities that modern equipment cannot fully replicate.",
        experimentsCount: 8,
        author: "Marco Rossi & Culinary Heritage Institute",
        publishedAt: "2024-02-28"
      },
      {
        title: "Knife Skills: Efficiency vs. Precision",
        description: "How proper knife techniques impact cooking times, texture, and flavor development in home cooking.",
        category: "Fundamental Skills",
        readTime: "10 min read",
        imageUrl: "https://pixabay.com/get/ge0b5eb939e248147459733b0ad4447d6362f13cf1d45fffdf1553f4f6dfe238ce58ac165483e1f73f3f7a8e6375ff913691bb738dc4fe2f88b19f7678fd4aea9_1280.jpg",
        content: "This comprehensive analysis examines how knife skills affect cooking outcomes through timed cutting tests and flavor analysis. Professional and amateur cooks prepared identical ingredients using different cutting techniques while measuring speed, uniformity, and final dish quality. Results show that uniform cuts reduce cooking time by 25-30% and improve flavor distribution. The study documents proper grip techniques, cutting angles, and maintenance practices. Texture analysis reveals how cut size and shape affect ingredient cooking rates and flavor release. Time studies demonstrate that initial skill investment pays dividends in daily cooking efficiency. Safety analysis shows proper technique reduces injury risk by 80%. The research includes detailed analysis of how different cuts (julienne, brunoise, chiffonade) affect specific cooking applications and final presentation.",
        methodology: "Timed cutting tests with multiple skill levels, texture analysis, safety incident tracking, and flavor development measurement.",
        results: "Proper knife skills improve cooking efficiency by 30%, reduce injuries by 80%, and significantly enhance final dish quality.",
        insights: "Fundamental knife skills are the foundation of efficient, safe, and flavorful home cooking.",
        experimentsCount: 15,
        author: "Chef Training Institute",
        publishedAt: "2024-01-20"
      },
      {
        title: "Temperature Control in Home Cooking",
        description: "Comprehensive analysis of how precise temperature control transforms home cooking results.",
        category: "Cooking Science",
        readTime: "18 min read",
        imageUrl: "https://pixabay.com/get/gede91f3d4b308fe8c8a3a8f09e0b2d20bd25a5be36064d1f17da46d73437556214f4b89c45ff1e29edc1507ae1ffd714b28b102ebe4da6f32514cba1aa544475_1280.jpg",
        content: "This extensive study examines temperature control across multiple cooking methods including roasting, searing, braising, and baking. Using precision thermometers and data logging, we tracked temperature effects on protein denaturation, Maillard reactions, and moisture retention. Tests included comparing conventional vs. sous vide cooking, optimal searing temperatures, and oven accuracy variations. Results demonstrate that precise temperature control improves food safety, texture, and flavor development. The study reveals common home cooking temperature mistakes and provides correction strategies. Detailed analysis shows how temperature control affects different proteins, vegetables, and starches. Equipment testing compares thermometer accuracy and reveals significant variations in home oven temperatures. The research includes practical applications for home cooks including calibration techniques and temperature monitoring strategies.",
        methodology: "Temperature logging across multiple cooking methods, protein analysis, equipment calibration testing, and comparative cooking trials.",
        results: "Precise temperature control improves cooking outcomes by 40-60% across all tested methods and ingredients.",
        insights: "Temperature is the most critical and controllable variable in cooking success.",
        experimentsCount: 25,
        author: "Culinary Science Research Group",
        publishedAt: "2024-04-10"
      }
    ];

    samplePortfolios.forEach(portfolio => {
      const id = this.currentPortfolioId++;
      const portfolioData: Portfolio = {
        ...portfolio,
        id,
        views: Math.floor(Math.random() * 5000) + 500,
        cuisine: portfolio.cuisine || null,
        tags: portfolio.tags || null,
        techniques: portfolio.techniques || null,
        ingredients: portfolio.ingredients || null,
        timeRequired: portfolio.timeRequired || null,
        difficulty: portfolio.difficulty || null,
        story: portfolio.story || null
      };
      this.portfolios.set(id, portfolioData);
    });

    sampleCaseStudies.forEach(caseStudy => {
      const id = this.currentCaseStudyId++;
      const caseStudyData: CaseStudy = {
        ...caseStudy,
        id,
        methodology: caseStudy.methodology || null,
        results: caseStudy.results || null,
        insights: caseStudy.insights || null,
        experimentsCount: caseStudy.experimentsCount || null,
        publishedAt: caseStudy.publishedAt || null
      };
      this.caseStudies.set(id, caseStudyData);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPortfolios(filters?: { category?: string; cuisine?: string; skillLevel?: string; search?: string }): Promise<Portfolio[]> {
    let portfolios = Array.from(this.portfolios.values());

    if (filters) {
      if (filters.category) {
        portfolios = portfolios.filter(p => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
      }
      if (filters.cuisine) {
        portfolios = portfolios.filter(p => p.cuisine?.toLowerCase().includes(filters.cuisine!.toLowerCase()));
      }
      if (filters.skillLevel) {
        portfolios = portfolios.filter(p => p.skillLevel.toLowerCase() === filters.skillLevel!.toLowerCase());
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        portfolios = portfolios.filter(p => 
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags?.some(tag => tag.toLowerCase().includes(search)) ||
          p.techniques?.some(technique => technique.toLowerCase().includes(search))
        );
      }
    }

    return portfolios.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.currentPortfolioId++;
    const newPortfolio: Portfolio = { 
      ...portfolio, 
      id, 
      views: 0,
      cuisine: portfolio.cuisine || null,
      tags: portfolio.tags || null,
      techniques: portfolio.techniques || null,
      ingredients: portfolio.ingredients || null,
      timeRequired: portfolio.timeRequired || null,
      difficulty: portfolio.difficulty || null,
      story: portfolio.story || null
    };
    this.portfolios.set(id, newPortfolio);
    return newPortfolio;
  }

  async updatePortfolioViews(id: number): Promise<void> {
    const portfolio = this.portfolios.get(id);
    if (portfolio) {
      portfolio.views = (portfolio.views || 0) + 1;
      this.portfolios.set(id, portfolio);
    }
  }

  async getAllCaseStudies(): Promise<CaseStudy[]> {
    return Array.from(this.caseStudies.values());
  }

  async getCaseStudy(id: number): Promise<CaseStudy | undefined> {
    return this.caseStudies.get(id);
  }

  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const id = this.currentCaseStudyId++;
    const newCaseStudy: CaseStudy = { ...caseStudy, id };
    this.caseStudies.set(id, newCaseStudy);
    return newCaseStudy;
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(p => p.userId === userId);
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = Array.from(this.userPreferences.values()).find(p => p.userId === preferences.userId);
    if (existing) {
      const updated = { ...existing, ...preferences };
      this.userPreferences.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentPreferencesId++;
      const newPreferences: UserPreferences = { ...preferences, id };
      this.userPreferences.set(id, newPreferences);
      return newPreferences;
    }
  }

  async getAiRecommendations(userId: number): Promise<AiRecommendation[]> {
    return Array.from(this.aiRecommendations.values()).filter(r => r.userId === userId);
  }

  async createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.currentRecommendationId++;
    const newRecommendation: AiRecommendation = { ...recommendation, id };
    this.aiRecommendations.set(id, newRecommendation);
    return newRecommendation;
  }
}

export const storage = new MemStorage();
