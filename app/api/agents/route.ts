import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createAgentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Fetch the ID of the default user
    const defaultUser = await prisma.user.findUnique({
      where: { id: "00000000-0000-0000-0000-000000000001" },
    })

    if (!defaultUser) {
      return NextResponse.json(
        { error: "Default user not found. Please run the default user creation script." },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { name, description } = createAgentSchema.parse(body)

    const agent = await prisma.chatAgent.create({
      data: {
        name,
        description,
        userId: defaultUser.id, // Assign to the default user
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
    // Fetch all agents, as there's no specific user context
    const agents = await prisma.chatAgent.findMany({
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
