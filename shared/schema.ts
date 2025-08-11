import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  cuisine: text("cuisine"),
  skillLevel: text("skill_level").notNull(),
  cookName: text("cook_name").notNull(),
  cookTitle: text("cook_title").notNull(),
  cookAvatarUrl: text("cook_avatar_url").notNull(),
  imageUrl: text("image_url").notNull(),
  views: integer("views").default(0),
  tags: text("tags").array(),
  techniques: text("techniques").array(),
  ingredients: text("ingredients").array(),
  timeRequired: text("time_required"),
  difficulty: text("difficulty"),
  story: text("story"),
});

export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  readTime: text("read_time").notNull(),
  imageUrl: text("image_url").notNull(),
  content: text("content").notNull(),
  methodology: text("methodology"),
  results: text("results"),
  insights: text("insights"),
  experimentsCount: integer("experiments_count"),
  author: text("author").notNull(),
  publishedAt: text("published_at"),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  skillLevel: text("skill_level"),
  preferredCuisines: text("preferred_cuisines").array(),
  cookingStyle: text("cooking_style"),
  timeAvailable: text("time_available"),
  dietaryRestrictions: text("dietary_restrictions").array(),
  favoriteIngredients: text("favorite_ingredients").array(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: text("type").notNull(), // 'portfolio' | 'technique' | 'recipe'
  title: text("title").notNull(),
  description: text("description").notNull(),
  matchScore: integer("match_score").notNull(),
  reasoning: text("reasoning"),
  targetId: integer("target_id"), // portfolio or case study ID
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  views: true,
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
});

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
