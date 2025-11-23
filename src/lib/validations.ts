import { z } from "zod"

// Article validation schemas
export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  summary: z.string().min(1, "Summary is required").max(500),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
})

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  summary: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  imageUrl: z.string().url().optional().nullable(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
})

// Avatar validation schemas
export const createAvatarSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional().nullable(),
  personality: z.array(z.string()).min(1, "At least one personality trait is required"),
  speakingStyle: z.string().min(1, "Speaking style is required"),
  expertise: z.string().min(1, "Expertise is required"),
  quirks: z.array(z.string()).default([]),
  category: z.enum(["philosopher", "historical", "object", "character", "professional"]),
  active: z.boolean().default(true),
})

export const updateAvatarSchema = createAvatarSchema.partial()

// Perspective validation schema
export const createPerspectiveSchema = z.object({
  articleId: z.string().min(1, "Article ID is required"),
  avatarId: z.string().min(1, "Avatar ID is required"),
  content: z.string().min(1, "Content is required"),
  headline: z.string().min(1, "Headline is required").max(200),
  keyPoints: z.array(z.string()).default([]),
  sentiment: z.enum(["positive", "negative", "neutral", "mixed"]),
  generated: z.boolean().default(false),
})

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
