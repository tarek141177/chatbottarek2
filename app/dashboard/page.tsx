import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MessageSquare, Settings, Code } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const chatAgents = await prisma.chatAgent.findMany({
    where: { userId: session!.user.id },
    include: {
      _count: {
        select: {
          knowledgeBase: true,
          chatSessions: true,
        },
      },
    },
  })

  const apiConfigs = await prisma.apiConfig.findMany({
    where: { userId: session!.user.id },
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Manage your AI chat agents</p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Chat Agent
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Agents</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatAgents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Configs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiConfigs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chatAgents.reduce((sum, agent) => sum + agent._count.chatSessions, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Agents */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Chat Agents</h2>
        {chatAgents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No chat agents yet</h3>
              <p className="text-gray-600 mb-4">Create your first chat agent to get started</p>
              <Link href="/dashboard/agents/new">
                <Button>Create Chat Agent</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatAgents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {agent.name}
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        agent.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agent.isActive ? "Active" : "Inactive"}
                    </span>
                  </CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Knowledge Base: {agent._count.knowledgeBase} entries</div>
                    <div>Chat Sessions: {agent._count.chatSessions}</div>
                  </div>
                  <div className="mt-4 space-x-2">
                    <Link href={`/dashboard/agents/${agent.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/dashboard/agents/${agent.id}/widget`}>
                      <Button variant="outline" size="sm">
                        Widget
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
