import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { updateArticleSchema } from "@/lib/validations"
import { z } from "zod"

// GET single article by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, email: true }
        },
        perspectives: {
          include: {
            avatar: true
          },
          orderBy: { createdAt: "asc" }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

// PUT update article (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { slug } = await params
    const body = await request.json()

    // Validate request body
    const validationResult = updateArticleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Build update data object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.summary !== undefined) updateData.summary = data.summary
    if (data.content !== undefined) updateData.content = data.content
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.category !== undefined) updateData.category = data.category
    if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags)
    if (data.published !== undefined) {
      updateData.published = data.published
      updateData.publishedAt = data.published ? new Date() : null
    }
    if (data.featured !== undefined) updateData.featured = data.featured

    const article = await prisma.article.update({
      where: { slug },
      data: updateData
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

// DELETE article (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { slug } = await params

    await prisma.article.delete({
      where: { slug }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}
