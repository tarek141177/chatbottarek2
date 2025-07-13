"use client"

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { generateWidgetCode } from "@/lib/utils"

interface AgentPageProps {
  params: {
    id: string
  }
}

export default async function AgentPage({ params }: AgentPageProps) {
  const agent = await prisma.chatAgent.findFirst({
    where: {
      id: params.id,
    },
    include: {
      knowledgeBase: true,
      widgetConfig: true,
      _count: {
        select: {
          chatSessions: true,
        },
      },
    },
  })

  if (!agent) {
    notFound()
  }

  const widgetCode = generateWidgetCode(agent.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          <p className="text-gray-600">{agent.description}</p>
        </div>
        <div className="space-x-2">
          <Link href={`/dashboard/agents/${agent.id}/knowledge`}>
            <Button variant="outline">Manage Knowledge</Button>
          </Link>
          <Link href={`/dashboard/agents/${agent.id}/widget`}>
            <Button>Widget Settings</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>{agent.knowledgeBase.length} entries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Add Q&A pairs to help your agent provide better responses.</p>
            <Link href={`/dashboard/agents/${agent.id}/knowledge`}>
              <Button variant="outline">Manage Knowledge Base</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat Sessions</CardTitle>
            <CardDescription>{agent._count.chatSessions} total conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">View and analyze conversations with your chat agent.</p>
            <Button variant="outline" disabled>
              View Analytics (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Widget Code</CardTitle>
          <CardDescription>Copy this code to embed your chat agent on any website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-sm overflow-x-auto">
              <code>{widgetCode}</code>
            </pre>
          </div>
          <Button className="mt-4" onClick={() => navigator.clipboard.writeText(widgetCode)}>
            Copy Code
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
