import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/encryption"
import { z } from "zod"

const createConfigSchema = z.object({
  name: z.string().min(1),
  apiKey: z.string().min(1),
  endpoint: z.string().url(),
  bodyTemplate: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, apiKey, endpoint, bodyTemplate } = createConfigSchema.parse(body)

    const config = await prisma.apiConfig.create({
      data: {
        name,
        apiKey: encrypt(apiKey),
        endpoint,
        bodyTemplate,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ ...config, apiKey: undefined })
  } catch (error) {
    console.error("Error creating config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const configs = await prisma.apiConfig.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        endpoint: true,
        isActive: true,
        createdAt: true,
      },
    })

    return NextResponse.json(configs)
  } catch (error) {
    console.error("Error fetching configs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
