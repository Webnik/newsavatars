import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET all avatars
export async function GET() {
  try {
    const avatars = await prisma.avatar.findMany({
      where: { active: true },
      orderBy: { name: "asc" }
    })

    return NextResponse.json(avatars)
  } catch (error) {
    console.error("Error fetching avatars:", error)
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    )
  }
}

// POST new avatar (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const avatar = await prisma.avatar.create({
      data: {
        name: data.name,
        slug,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        personality: JSON.stringify(data.personality || []),
        speakingStyle: data.speakingStyle,
        expertise: data.expertise,
        quirks: JSON.stringify(data.quirks || []),
        category: data.category,
        active: data.active ?? true
      }
    })

    return NextResponse.json(avatar)
  } catch (error) {
    console.error("Error creating avatar:", error)
    return NextResponse.json(
      { error: "Failed to create avatar" },
      { status: 500 }
    )
  }
}
