import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET single avatar
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const avatar = await prisma.avatar.findUnique({
      where: { slug },
      include: {
        perspectives: {
          include: {
            article: {
              select: {
                title: true,
                slug: true,
                summary: true,
                imageUrl: true,
                publishedAt: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    })

    if (!avatar) {
      return NextResponse.json(
        { error: "Avatar not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(avatar)
  } catch (error) {
    console.error("Error fetching avatar:", error)
    return NextResponse.json(
      { error: "Failed to fetch avatar" },
      { status: 500 }
    )
  }
}

// PUT update avatar (admin only)
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
    const data = await request.json()

    const avatar = await prisma.avatar.update({
      where: { slug },
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        personality: JSON.stringify(data.personality || []),
        speakingStyle: data.speakingStyle,
        expertise: data.expertise,
        quirks: JSON.stringify(data.quirks || []),
        category: data.category,
        active: data.active
      }
    })

    return NextResponse.json(avatar)
  } catch (error) {
    console.error("Error updating avatar:", error)
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    )
  }
}

// DELETE avatar (admin only)
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

    await prisma.avatar.delete({
      where: { slug }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting avatar:", error)
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    )
  }
}
