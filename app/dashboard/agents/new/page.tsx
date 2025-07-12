"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewAgentPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })

      if (response.ok) {
        const agent = await response.json()
        router.push(`/dashboard/agents/${agent.id}`)
      }
    } catch (error) {
      console.error("Error creating agent:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Chat Agent</CardTitle>
          <CardDescription>Set up a new AI chat agent for your website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Agent Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Customer Support Bot"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Helps customers with common questions"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Agent"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
