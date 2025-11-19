import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { generatePerspective, generateDemoPerspective } from "@/lib/ai"

// POST generate perspectives for an article
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { articleId, avatarIds } = await request.json()

    // Get article
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Get avatars
    const avatars = await prisma.avatar.findMany({
      where: { id: { in: avatarIds } }
    })

    const perspectives = []

    for (const avatar of avatars) {
      // Check if perspective already exists
      const existing = await prisma.perspective.findUnique({
        where: {
          articleId_avatarId: {
            articleId: article.id,
            avatarId: avatar.id
          }
        }
      })

      if (existing) {
        perspectives.push(existing)
        continue
      }

      // Generate perspective using AI or demo mode
      const hasApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your-openai-api-key"

      const result = hasApiKey
        ? await generatePerspective(avatar, article)
        : await generateDemoPerspective(avatar, article)

      // Save perspective
      const perspective = await prisma.perspective.create({
        data: {
          articleId: article.id,
          avatarId: avatar.id,
          headline: result.headline,
          content: result.content,
          keyPoints: JSON.stringify(result.keyPoints),
          sentiment: result.sentiment,
          generated: true
        }
      })

      perspectives.push(perspective)
    }

    return NextResponse.json(perspectives)
  } catch (error) {
    console.error("Error generating perspectives:", error)
    return NextResponse.json(
      { error: "Failed to generate perspectives" },
      { status: 500 }
    )
  }
}
