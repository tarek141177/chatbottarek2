import { type NextRequest, NextResponse } from "next/server"
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
    const { name, apiKey, endpoint, bodyTemplate } = createConfigSchema.parse(body)

    const config = await prisma.apiConfig.create({
      data: {
        name,
        apiKey: encrypt(apiKey),
        endpoint,
        bodyTemplate,
        userId: defaultUser.id, // Assign to the default user
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
    // Fetch all configs, as there's no specific user context
    const configs = await prisma.apiConfig.findMany({
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
