import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createAgentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = createAgentSchema.parse(body)

    const agent = await prisma.chatAgent.create({
      data: {
        name,
        description,
        userId: session.user.id,
      },
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agents = await prisma.chatAgent.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            knowledgeBase: true,
            chatSessions: true,
          },
        },
      },
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
