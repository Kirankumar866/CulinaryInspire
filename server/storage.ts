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
        cookAvatarUrl: "https://images.unsplash.com/photo-1607631568010-0666f65db3b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
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
        cookAvatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        cookAvatarUrl: "https://images.unsplash.com/photo-1664913665254-87fd1fa7a7d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        cookAvatarUrl: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        cookAvatarUrl: "https://images.unsplash.com/photo-1609466845026-1532d0e6b8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
        cookAvatarUrl: "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["molecular", "science", "innovation", "technique"],
        techniques: ["Spherification", "Gelification", "Foam creation", "Temperature contrast"],
        ingredients: ["Agar", "Sodium alginate", "Liquid nitrogen", "Lecithin"],
        timeRequired: "2-4 hours",
        difficulty: "Expert",
        story: "Molecular gastronomy isn't about replacing traditional cooking - it's about understanding the science behind flavor and texture to create new experiences. Each technique opens up possibilities for surprising and delighting diners."
      },
      {
        title: "Texas BBQ Pit Master",
        description: "Low and slow barbecue techniques learned from competition pitmasters across the American South.",
        category: "BBQ",
        cuisine: "American",
        skillLevel: "Advanced",
        cookName: "Jake Thompson",
        cookTitle: "Backyard Pitmaster",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["barbecue", "smoking", "texas", "competition"],
        techniques: ["Wood smoking", "Dry rubs", "Low temperature cooking", "Bark formation"],
        ingredients: ["Brisket", "Hickory wood", "Brown sugar", "Paprika", "Coffee"],
        timeRequired: "12-16 hours",
        difficulty: "Hard",
        story: "What started as weekend grilling turned into an obsession with authentic Texas barbecue. After traveling across Texas to learn from pit masters, I've brought championship-level techniques to my backyard smoker."
      },
      {
        title: "Spice Route Adventures",
        description: "Authentic Indian curry techniques and spice blending mastered through family traditions.",
        category: "Curry",
        cuisine: "Indian",
        skillLevel: "Intermediate",
        cookName: "Priya Sharma",
        cookTitle: "Spice Master",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["curry", "spices", "indian", "authentic"],
        techniques: ["Tempering", "Spice grinding", "Layered cooking", "Tadka"],
        ingredients: ["Turmeric", "Cumin", "Coriander", "Garam masala", "Fresh ginger"],
        timeRequired: "2-4 hours",
        difficulty: "Medium",
        story: "Growing up watching my mother blend spices by hand taught me that curry is an art form. Each region has its secrets, and I've spent years documenting family recipes and regional variations."
      },
      {
        title: "Ramen Lab Experiments",
        description: "Creating authentic tonkotsu and innovative fusion ramen broths through scientific experimentation.",
        category: "Ramen",
        cuisine: "Japanese",
        skillLevel: "Advanced",
        cookName: "Takeshi Nakamura",
        cookTitle: "Ramen Scientist",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["ramen", "broth", "japanese", "noodles"],
        techniques: ["Bone cooking", "Emulsification", "Noodle making", "Tare balancing"],
        ingredients: ["Pork bones", "Kombu", "Miso", "Sake", "Fresh noodles"],
        timeRequired: "24-48 hours",
        difficulty: "Hard",
        story: "True ramen is alchemy - transforming simple ingredients into liquid gold. My home lab experiments with temperature, timing, and technique have unlocked the secrets of restaurant-quality bowls."
      },
      {
        title: "Nordic Foraging Kitchen",
        description: "Seasonal cooking inspired by Scandinavian foraging traditions and preservation techniques.",
        category: "Foraging",
        cuisine: "Nordic",
        skillLevel: "Intermediate",
        cookName: "Astrid Larsen",
        cookTitle: "Foraging Expert",
        imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["foraging", "preservation", "nordic", "seasonal"],
        techniques: ["Fermentation", "Smoking", "Pickling", "Wild identification"],
        ingredients: ["Wild mushrooms", "Sea buckthorn", "Juniper", "Wild herbs"],
        timeRequired: "3-6 hours",
        difficulty: "Medium",
        story: "Learning to forage has connected me to the land and seasons in ways I never imagined. Nordic preservation techniques turn wild ingredients into pantry treasures that last through winter."
      },
      {
        title: "Fermentation Station",
        description: "Mastering the art of fermentation from kimchi to kombucha, exploring cultures worldwide.",
        category: "Fermentation",
        cuisine: "Global",
        skillLevel: "Intermediate",
        cookName: "Luna Rodriguez",
        cookTitle: "Fermentation Enthusiast",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f73b2cc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["fermentation", "probiotics", "preservation", "cultures"],
        techniques: ["Lacto-fermentation", "Wild fermentation", "Temperature control", "pH monitoring"],
        ingredients: ["Cabbage", "Salt", "SCOBY", "Various vegetables"],
        timeRequired: "1 week - 6 months",
        difficulty: "Medium",
        story: "Fermentation is ancient biotechnology at work in my kitchen. From Korean kimchi to German sauerkraut, I'm preserving flavors and creating living foods that nurture both body and soul."
      },
      {
        title: "Plant-Based Revolution",
        description: "Innovative plant-based cooking that doesn't compromise on flavor or satisfaction.",
        category: "Plant-Based",
        cuisine: "Global",
        skillLevel: "Beginner",
        cookName: "Maya Patel",
        cookTitle: "Plant Pioneer",
        cookAvatarUrl: "https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["vegan", "plant-based", "sustainable", "innovative"],
        techniques: ["Protein building", "Umami development", "Texture creation", "Nutritional balancing"],
        ingredients: ["Jackfruit", "Nutritional yeast", "Cashews", "Mushrooms", "Lentils"],
        timeRequired: "1-3 hours",
        difficulty: "Easy",
        story: "Plant-based cooking isn't about limitation - it's about discovery. Every vegetable, grain, and legume has untapped potential to create dishes that satisfy omnivores and vegans alike."
      },
      {
        title: "Chocolate Artisan Journey",
        description: "Bean-to-bar chocolate making and creating artisanal confections at home.",
        category: "Chocolate",
        cuisine: "Global",
        skillLevel: "Expert",
        cookName: "Gabriel Santos",
        cookTitle: "Chocolate Craftsman",
        cookAvatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["chocolate", "bean-to-bar", "artisan", "confection"],
        techniques: ["Roasting", "Winnowing", "Conching", "Tempering"],
        ingredients: ["Cacao beans", "Coconut sugar", "Vanilla beans", "Sea salt"],
        timeRequired: "3-7 days",
        difficulty: "Expert",
        story: "Making chocolate from bean to bar taught me that real chocolate is a reflection of terroir, technique, and time. Each origin tells its story through flavor, and I'm the translator."
      },
      {
        title: "Middle Eastern Mezze",
        description: "Traditional and modern Middle Eastern small plates that bring people together.",
        category: "Mezze",
        cuisine: "Middle Eastern",
        skillLevel: "Intermediate",
        cookName: "Layla Al-Rashid",
        cookTitle: "Mezze Master",
        cookAvatarUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["mezze", "middle-eastern", "sharing", "traditional"],
        techniques: ["Smoking", "Grilling", "Pickling", "Spice blending"],
        ingredients: ["Tahini", "Pomegranate", "Za'atar", "Sumac", "Freekeh"],
        timeRequired: "2-4 hours",
        difficulty: "Medium",
        story: "Mezze is about abundance and sharing - every dish tells a story of hospitality. My grandmother's recipes mixed with modern techniques create meals that bring families together around the table."
      },
      {
        title: "Breakfast Around the World",
        description: "Exploring morning traditions from different cultures and perfecting the first meal of the day.",
        category: "Breakfast",
        cuisine: "Global",
        skillLevel: "Beginner",
        cookName: "Oliver Bennett",
        cookTitle: "Morning Food Explorer",
        cookAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["breakfast", "global", "morning", "traditions"],
        techniques: ["Poaching", "Steaming", "Griddling", "Fresh preparation"],
        ingredients: ["Eggs", "Rice", "Beans", "Fresh fruits", "Various grains"],
        timeRequired: "30-90 minutes",
        difficulty: "Easy",
        story: "Breakfast sets the tone for the entire day. From Japanese tamago to Mexican huevos rancheros, I'm documenting how different cultures fuel their mornings with love and flavor."
      },
      {
        title: "Cocktail Culinary Crossover",
        description: "Creating food-inspired cocktails and cocktail-inspired dishes that blur the lines.",
        category: "Cocktails",
        cuisine: "Modern",
        skillLevel: "Advanced",
        cookName: "Carmen Cruz",
        cookTitle: "Liquid Chef",
        cookAvatarUrl: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1564576775949-2ac164c96e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["cocktails", "molecular", "fusion", "innovative"],
        techniques: ["Infusion", "Clarification", "Spherification", "Aromatics"],
        ingredients: ["Premium spirits", "Fresh herbs", "Exotic fruits", "Bitters"],
        timeRequired: "2-5 hours",
        difficulty: "Hard",
        story: "The line between kitchen and bar is disappearing. Using culinary techniques in cocktails and cocktail elements in food, I'm creating experiences that surprise and delight all the senses."
      },
      {
        title: "Artisan Ice Cream Laboratory",
        description: "Small-batch ice cream with innovative flavors and textures using liquid nitrogen.",
        category: "Ice Cream",
        cuisine: "Modern",
        skillLevel: "Advanced",
        cookName: "Isabella Zhang",
        cookTitle: "Frozen Dessert Scientist",
        cookAvatarUrl: "https://images.unsplash.com/photo-1600275669439-14903ad15de7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["ice-cream", "liquid-nitrogen", "innovative", "texture"],
        techniques: ["Liquid nitrogen freezing", "Emulsification", "Flavor balancing", "Texture engineering"],
        ingredients: ["Heavy cream", "Egg yolks", "Exotic fruits", "Liquid nitrogen"],
        timeRequired: "3-6 hours",
        difficulty: "Hard",
        story: "Ice cream is frozen chemistry. Using liquid nitrogen and understanding crystallization, I create textures and temperatures impossible with traditional methods. Every scoop is a moment of pure joy."
      },
      {
        title: "Street Food World Tour",
        description: "Recreating authentic street food from around the globe in my home kitchen.",
        category: "Street Food",
        cuisine: "Global",
        skillLevel: "Intermediate",
        cookName: "Raj Patel",
        cookTitle: "Street Food Specialist",
        cookAvatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["street-food", "authentic", "travel", "cultural"],
        techniques: ["High-heat cooking", "Quick assembly", "Sauce mastery", "Portable presentation"],
        ingredients: ["Various proteins", "Fresh vegetables", "Street spices", "Handheld bases"],
        timeRequired: "30-120 minutes",
        difficulty: "Medium",
        story: "Street food captures the soul of a culture in every bite. From Bangkok's pad thai to Mexico City's tacos, I'm bringing the energy and flavors of global street markets to my kitchen."
      },
      {
        title: "Cheese Making Chronicles",
        description: "From simple fresh cheeses to aged varieties, exploring the ancient art of cheese making.",
        category: "Cheese",
        cuisine: "European",
        skillLevel: "Advanced",
        cookName: "Henri Dubois",
        cookTitle: "Home Cheese Maker",
        cookAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["cheese", "fermentation", "aging", "traditional"],
        techniques: ["Culturing", "Pressing", "Aging", "Wax coating"],
        ingredients: ["Fresh milk", "Rennet", "Cheese cultures", "Salt"],
        timeRequired: "2 days - 12 months",
        difficulty: "Hard",
        story: "Cheese making connects us to thousands of years of food preservation. What begins as simple milk becomes complex flavors through the magic of time, culture, and careful attention."
      },
      {
        title: "Ancient Grains Renaissance",
        description: "Rediscovering forgotten grains and creating modern dishes with ancient nutrition.",
        category: "Grains",
        cuisine: "Ancient",
        skillLevel: "Beginner",
        cookName: "Dr. Sarah Wilson",
        cookTitle: "Grain Researcher",
        cookAvatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["ancient-grains", "nutrition", "heritage", "sustainable"],
        techniques: ["Sprouting", "Slow cooking", "Texture building", "Flavor pairing"],
        ingredients: ["Einkorn", "Emmer", "Spelt", "Teff", "Amaranth"],
        timeRequired: "1-4 hours",
        difficulty: "Easy",
        story: "Ancient grains hold the genetic diversity our ancestors knew. Each variety tells a story of adaptation and survival, while providing modern kitchens with incredible flavors and nutrition."
      },
      {
        title: "Authentic Butter Chicken Mastery",
        description: "Perfect the restaurant-style butter chicken with rich tomato gravy and tender marinated chicken.",
        category: "Indian Curry",
        cuisine: "Indian",
        skillLevel: "Intermediate",
        cookName: "Anita Kapoor",
        cookTitle: "Indian Cuisine Expert",
        cookAvatarUrl: "https://images.unsplash.com/photo-1664913665254-87fd1fa7a7d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["butter-chicken", "curry", "indian", "restaurant-style"],
        techniques: ["Tandoori marination", "Tomato base preparation", "Cream balancing", "Spice tempering"],
        ingredients: ["Chicken", "Tomatoes", "Heavy cream", "Garam masala", "Fenugreek leaves"],
        timeRequired: "3-4 hours",
        difficulty: "Medium",
        story: "Butter chicken represents the soul of Punjabi cuisine. After years of perfecting this dish, I've learned that the secret lies in the perfect balance of sweetness, richness, and aromatic spices that create that signature restaurant taste at home."
      },
      {
        title: "Hyderabad Biryani Heritage",
        description: "Master the art of authentic Hyderabadi dum biryani with perfectly layered rice and aromatic spices.",
        category: "Biryani",
        cuisine: "Indian",
        skillLevel: "Advanced",
        cookName: "Mohammed Ahmed",
        cookTitle: "Biryani Specialist",
        cookAvatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["biryani", "hyderabadi", "dum-cooking", "royal-cuisine"],
        techniques: ["Dum cooking", "Rice layering", "Saffron infusion", "Meat marination"],
        ingredients: ["Basmati rice", "Mutton", "Saffron", "Whole spices", "Fried onions"],
        timeRequired: "6-8 hours",
        difficulty: "Hard",
        story: "Hyderabadi biryani is a royal legacy passed down through generations. Each grain of rice tells a story of Nizami culture. The dum cooking technique, where the pot is sealed and slow-cooked, creates magic that no modern method can replicate."
      },
      {
        title: "South Indian Dosa Perfection",
        description: "From batter fermentation to crispy golden dosas - mastering the art of South Indian breakfast.",
        category: "South Indian",
        cuisine: "Indian",
        skillLevel: "Intermediate",
        cookName: "Lakshmi Menon",
        cookTitle: "South Indian Cook",
        cookAvatarUrl: "https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["dosa", "south-indian", "fermentation", "breakfast"],
        techniques: ["Batter fermentation", "Tawa handling", "Paper-thin spreading", "Sambhar preparation"],
        ingredients: ["Rice", "Urad dal", "Fenugreek seeds", "Curry leaves", "Coconut"],
        timeRequired: "2 days (fermentation)",
        difficulty: "Medium",
        story: "Dosa making is an art that connects us to centuries of South Indian tradition. The perfect fermentation, the rhythm of spreading batter, and the satisfaction of that first crispy bite - it's a meditation that feeds both body and soul."
      },
      {
        title: "Punjabi Chole Bhature Feast",
        description: "Authentic Punjabi chole with fluffy bhature - a street food favorite made restaurant-perfect.",
        category: "Punjabi",
        cuisine: "Indian",
        skillLevel: "Intermediate",
        cookName: "Harpreet Singh",
        cookTitle: "Punjabi Food Master",
        cookAvatarUrl: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["chole-bhature", "punjabi", "street-food", "chickpeas"],
        techniques: ["Chickpea cooking", "Bhature dough preparation", "Deep frying", "Spice balancing"],
        ingredients: ["Chickpeas", "All-purpose flour", "Yogurt", "Punjabi spices", "Ginger-garlic"],
        timeRequired: "4-5 hours",
        difficulty: "Medium",
        story: "Chole Bhature is the heart of Punjabi hospitality. From the bustling streets of Amritsar to family kitchens, this combination represents celebration and abundance. Every bite should burst with bold flavors and love."
      },
      {
        title: "Bengali Fish Curry Traditions",
        description: "Delicate Bengali fish curry with mustard oil and traditional five-spice blend.",
        category: "Bengali",
        cuisine: "Indian",
        skillLevel: "Intermediate",
        cookName: "Ruma Chakraborty",
        cookTitle: "Bengali Cook",
        cookAvatarUrl: "https://images.unsplash.com/photo-1609466845026-1532d0e6b8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1631292784640-2b24be784d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["bengali", "fish-curry", "mustard-oil", "traditional"],
        techniques: ["Fish preparation", "Panch phoron tempering", "Mustard oil cooking", "Curry balancing"],
        ingredients: ["Rohu fish", "Mustard oil", "Panch phoron", "Turmeric", "Green chilies"],
        timeRequired: "1-2 hours",
        difficulty: "Medium",
        story: "Bengali cuisine celebrates the bounty of rivers and seas. This fish curry, with its distinctive mustard oil aroma and subtle spicing, represents the essence of Bengali cooking - simple ingredients transformed through traditional techniques."
      },
      {
        title: "Rajasthani Dal Baati Churma",
        description: "Royal Rajasthani comfort food - crispy baati with rich dal and sweet churma.",
        category: "Rajasthani",
        cuisine: "Indian",
        skillLevel: "Advanced",
        cookName: "Shyam Raj",
        cookTitle: "Rajasthani Heritage Cook",
        cookAvatarUrl: "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        tags: ["rajasthani", "dal-baati-churma", "desert-cuisine", "traditional"],
        techniques: ["Baati shaping", "Clay oven cooking", "Dal preparation", "Churma making"],
        ingredients: ["Whole wheat flour", "Mixed lentils", "Jaggery", "Ghee", "Desert spices"],
        timeRequired: "4-6 hours",
        difficulty: "Hard",
        story: "Dal Baati Churma tells the story of Rajasthan's harsh desert life where every grain was precious. This hearty meal sustained travelers and warriors, combining protein, carbs, and sweets in perfect harmony."
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
    const newCaseStudy: CaseStudy = { 
      ...caseStudy, 
      id,
      methodology: caseStudy.methodology || null,
      results: caseStudy.results || null,
      insights: caseStudy.insights || null,
      experimentsCount: caseStudy.experimentsCount || null,
      publishedAt: caseStudy.publishedAt || null
    };
    this.caseStudies.set(id, newCaseStudy);
    return newCaseStudy;
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(p => p.userId === userId);
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = Array.from(this.userPreferences.values()).find(p => p.userId === preferences.userId);
    if (existing) {
      const updated: UserPreferences = { 
        ...existing, 
        ...preferences,
        userId: preferences.userId || null,
        skillLevel: preferences.skillLevel || null,
        preferredCuisines: preferences.preferredCuisines || null,
        cookingStyle: preferences.cookingStyle || null,
        timeAvailable: preferences.timeAvailable || null,
        dietaryRestrictions: preferences.dietaryRestrictions || null,
        favoriteIngredients: preferences.favoriteIngredients || null
      };
      this.userPreferences.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentPreferencesId++;
      const newPreferences: UserPreferences = { 
        ...preferences, 
        id,
        userId: preferences.userId || null,
        skillLevel: preferences.skillLevel || null,
        preferredCuisines: preferences.preferredCuisines || null,
        cookingStyle: preferences.cookingStyle || null,
        timeAvailable: preferences.timeAvailable || null,
        dietaryRestrictions: preferences.dietaryRestrictions || null,
        favoriteIngredients: preferences.favoriteIngredients || null
      };
      this.userPreferences.set(id, newPreferences);
      return newPreferences;
    }
  }

  async getAiRecommendations(userId: number): Promise<AiRecommendation[]> {
    return Array.from(this.aiRecommendations.values()).filter(r => r.userId === userId);
  }

  async createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.currentRecommendationId++;
    const newRecommendation: AiRecommendation = { 
      id,
      type: recommendation.type,
      title: recommendation.title,
      description: recommendation.description,
      matchScore: recommendation.matchScore,
      userId: recommendation.userId ?? null,
      reasoning: recommendation.reasoning ?? null,
      targetId: recommendation.targetId ?? null
    };
    this.aiRecommendations.set(id, newRecommendation);
    return newRecommendation;
  }
}

export const storage = new MemStorage();
