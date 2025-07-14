import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/encryption"

export async function POST(request: NextRequest) {
  try {
    const { message, chatAgentId, sessionId } = await request.json()

    if (!message || !chatAgentId) {
      return NextResponse.json({ error: "Message and chatAgentId are required" }, { status: 400 })
    }

    // Get chat agent
    const chatAgent = await prisma.chatAgent.findUnique({
      where: { id: chatAgentId },
      include: {
        knowledgeBase: true,
        widgetConfig: true,
      },
    })

    if (!chatAgent || !chatAgent.isActive) {
      return NextResponse.json({ error: "Chat agent not found or inactive" }, { status: 404 })
    }

    // Get API config directly using chatAgent's userId
    const apiConfig = await prisma.apiConfig.findFirst({
      where: { userId: chatAgent.userId, isActive: true },
      take: 1,
    })

    if (!apiConfig) {
      return NextResponse.json({ error: "No active API configuration found for this agent's user" }, { status: 400 })
    }

    // Find or create chat session
    let chatSession
    if (sessionId) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: true },
      })
    }

    // Fetch the ID of the default user to assign to new chat sessions
    const defaultUser = await prisma.user.findUnique({
      where: { id: "00000000-0000-0000-0000-000000000001" },
    })

    if (!defaultUser) {
      return NextResponse.json(
        { error: "Default user not found. Please run the default user creation script." },
        { status: 500 },
      )
    }

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          chatAgentId,
          userId: defaultUser.id, // Assign to the default user
        },
        include: { messages: true },
      })
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        content: message,
        role: "user",
        chatSessionId: chatSession.id,
      },
    })

    // Build context from knowledge base
    const relevantKnowledge = chatAgent.knowledgeBase
      .filter(
        (kb) =>
          kb.question.toLowerCase().includes(message.toLowerCase()) ||
          message.toLowerCase().includes(kb.question.toLowerCase()),
      )
      .slice(0, 3) // Limit to top 3 matches

    const context = relevantKnowledge.map((kb) => `Q: ${kb.question}\nA: ${kb.answer}`).join("\n\n")

    // Prepare API call
    const decryptedApiKey = decrypt(apiConfig.apiKey)

    // Replace placeholders in body template
    const bodyTemplate = apiConfig.bodyTemplate.replace("{{prompt}}", message).replace("{{context}}", context)

    // Call external AI API
    const aiResponse = await fetch(apiConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decryptedApiKey}`,
        ...((apiConfig.headers as Record<string, string>) || {}),
      },
      body: bodyTemplate,
    })

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`)
    }

    const aiData = await aiResponse.json()

    // Extract response (this would need to be configured per API)
    // For OpenAI format:
    const assistantMessage =
      aiData.choices?.[0]?.message?.content || aiData.response || "Sorry, I could not generate a response."

    // Save assistant message
    await prisma.chatMessage.create({
      data: {
        content: assistantMessage,
        role: "assistant",
        chatSessionId: chatSession.id,
      },
    })

    return NextResponse.json({
      message: assistantMessage,
      sessionId: chatSession.id,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
