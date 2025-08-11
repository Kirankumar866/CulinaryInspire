# 🍳 CookCraft - Culinary Portfolio Platform

> **Discover Amazing Home Cooking Stories**

CookCraft is a modern, AI-powered culinary portfolio platform that showcases cooking projects, case studies, and provides personalized recommendations for home cooks. Built with React, TypeScript, and powered by Netlify's serverless infrastructure.

[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=flat&logo=netlify)](https://cookcraft-culinary-app.netlify.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](#)

## 🌟 Features

### 🎯 Core Features
- **Portfolio Browsing**: Explore 20+ diverse cooking portfolios from around the world
- **Advanced Filtering**: Filter by cuisine, skill level, category, and search
- **Case Studies**: In-depth analysis of cooking techniques and experiments
- **AI Recommendations**: Personalized suggestions based on cooking preferences
- **Recipe Analysis**: AI-powered recipe insights and improvements

### 🌍 Diverse Cuisines
- **Indian**: Butter Chicken, Hyderabad Biryani, Dosa, Chole Bhature, Bengali Fish Curry, Rajasthani Dal Baati Churma
- **Italian**: Traditional pasta making, authentic techniques
- **French**: Professional pastry and baking methods
- **Asian Fusion**: Wok mastery and modern fusion techniques
- **Mediterranean**: Healthy, fresh coastal cooking
- **American BBQ**: Texas pit master techniques
- **Molecular Gastronomy**: Scientific cooking innovations
- **And many more...**

### 🤖 AI-Powered Features
- Smart recipe recommendations based on skill level and preferences
- Cooking technique analysis and suggestions
- Recipe improvement insights
- Personalized learning paths

## 🚀 Live Demo

**🌐 [Visit CookCraft Live](https://cookcraft-culinary-app.netlify.app)**

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component Library
- **Tanstack Query** - Data Fetching
- **Wouter** - Routing
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - API Framework (local dev)
- **Netlify Functions** - Serverless APIs (production)
- **OpenAI API** - AI Features
- **Zod** - Schema Validation

### Deployment & Infrastructure
- **Netlify** - Hosting & Serverless Functions
- **Vite** - Build Tool
- **ESBuild** - Fast Bundling
- **Git** - Version Control

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cookcraft-culinary-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file (optional for basic features)
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Project Structure

```
cookcraft-culinary-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   └── index.html
├── server/                # Backend server code
│   ├── services/          # Business logic and AI services
│   ├── index.ts          # Express server entry
│   ├── routes.ts         # API route definitions
│   └── storage.ts        # Data storage layer
├── netlify/               # Netlify serverless functions
│   └── functions/         # API endpoints for production
├── shared/                # Shared types and schemas
│   └── schema.ts         # Database schemas and types
├── dist/                 # Production build output
├── netlify.toml          # Netlify deployment configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🎨 Key Components

### Portfolio Management
- **PortfolioCard**: Displays cooking portfolio previews
- **SearchFilterBar**: Advanced filtering and search
- **PortfolioDetail**: Full portfolio view with techniques and ingredients

### AI Features
- **AiRecommendations**: Personalized cooking suggestions
- **RecipeAnalysis**: AI-powered recipe insights
- **CookingInsights**: Technique analysis and tips

### Navigation & Layout
- **Navigation**: Responsive main navigation
- **CaseStudyCard**: Scientific cooking analysis
- **Footer**: Links and newsletter signup

## 🔧 API Endpoints

### Portfolio APIs
- `GET /api/portfolios` - List all portfolios with filtering
- `GET /api/portfolios/:id` - Get specific portfolio
- `POST /api/portfolios` - Create new portfolio

### Case Study APIs
- `GET /api/case-studies` - List all case studies
- `GET /api/case-studies/:id` - Get specific case study
- `POST /api/case-studies` - Create new case study

### AI APIs
- `GET /api/recommendations/:userId` - Get AI recommendations
- `GET /api/insights/:portfolioId` - Get cooking insights
- `POST /api/analyze-recipe` - Analyze recipe text

### User APIs
- `GET /api/preferences/:userId` - Get user preferences
- `POST /api/preferences` - Update user preferences

## 🎯 Usage Examples

### Filtering Portfolios
```javascript
// Filter by Indian cuisine and intermediate skill level
fetch('/api/portfolios?cuisine=indian&skillLevel=intermediate')
  .then(response => response.json())
  .then(portfolios => console.log(portfolios));
```

### Getting AI Recommendations
```javascript
// Get personalized recommendations for user
fetch('/api/recommendations/1')
  .then(response => response.json())
  .then(recommendations => console.log(recommendations));
```

## 🚀 Deployment

### Netlify Deployment (Recommended)

1. **Connect to Netlify**
   - Fork this repository
   - Connect to Netlify via Git integration
   - Deploy automatically on push

2. **Manual Deployment**
   ```bash
   # Build the project
   npm run build
   
   # Deploy to Netlify
   npx netlify deploy --prod --dir=dist
   ```

### Environment Variables
For AI features, set in Netlify dashboard:
- `OPENAI_API_KEY` - Your OpenAI API key

## 🧪 Testing

```bash
# Run type checking
npm run check

# Build test
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing component patterns
- Add proper error handling
- Test your changes locally
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** - High-quality food photography
- **OpenAI** - AI-powered features
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Netlify** - Deployment and hosting platform

## 📞 Support

- **Documentation**: [Netlify Docs](https://docs.netlify.com/)
- **Issues**: Create an issue in this repository
- **Contact**: [Your Contact Information]

---

**Built with ❤️ for the cooking community**

*Share your culinary journey, discover new techniques, and connect with fellow home cooks around the world.*
