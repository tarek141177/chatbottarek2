"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface ApiConfig {
  id: string
  name: string
  endpoint: string
  isActive: boolean
}

export default function ApiConfigsPage() {
  const [configs, setConfigs] = useState<ApiConfig[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    endpoint: "",
    bodyTemplate: `{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant. Use this context: {{context}}"
    },
    {
      "role": "user",
      "content": "{{prompt}}"
    }
  ]
}`,
  })

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/api-configs")
      if (response.ok) {
        const data = await response.json()
        setConfigs(data)
      }
    } catch (error) {
      console.error("Error fetching configs:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/api-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          name: "",
          apiKey: "",
          endpoint: "",
          bodyTemplate: formData.bodyTemplate,
        })
        fetchConfigs()
      }
    } catch (error) {
      console.error("Error creating config:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Configurations</h1>
          <p className="text-gray-600">Manage your AI API providers</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add API Config
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New API Configuration</CardTitle>
            <CardDescription>Configure your AI API provider</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="OpenAI GPT-3.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <Input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="sk-..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Endpoint URL</label>
                <Input
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="https://api.openai.com/v1/chat/completions"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Body Template</label>
                <textarea
                  className="w-full h-40 p-3 border rounded-md font-mono text-sm"
                  value={formData.bodyTemplate}
                  onChange={(e) => setFormData({ ...formData, bodyTemplate: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {`{{prompt}}`} and {`{{context}}`} as placeholders
                </p>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">Save Configuration</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {configs.map((config) => (
          <Card key={config.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{config.name}</CardTitle>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    config.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {config.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <CardDescription>{config.endpoint}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {configs.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No API configurations</h3>
            <p className="text-gray-600 mb-4">Add your first AI API configuration to get started</p>
            <Button onClick={() => setShowForm(true)}>Add API Configuration</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
