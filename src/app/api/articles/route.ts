import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { createArticleSchema } from "@/lib/validations"
import { z } from "zod"

// GET all articles (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: Record<string, unknown> = { published: true }
    if (category) where.category = category
    if (featured === "true") where.featured = true

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true }
        },
        perspectives: {
          include: {
            avatar: {
              select: { name: true, slug: true, imageUrl: true, title: true }
            }
          }
        }
      },
      orderBy: { publishedAt: "desc" },
      take: limit
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

// POST new article (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validationResult = createArticleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: `${slug}-${Date.now()}`,
        summary: data.summary,
        content: data.content,
        imageUrl: data.imageUrl || null,
        category: data.category,
        tags: JSON.stringify(data.tags),
        published: data.published,
        featured: data.featured,
        authorId: session.user.id,
        publishedAt: data.published ? new Date() : null
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error creating article:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}
