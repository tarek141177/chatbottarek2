import Link from "next/link"
import { Button } from "@/components/ui/button"

// Force this page to be dynamic, as it uses getServerSession which relies on headers/cookies.
export const dynamic = "force-dynamic"

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">AI Chat Agents for Your Website</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create intelligent chat agents powered by your own knowledge base and AI API. Embed them anywhere with a
            simple widget.
          </p>

          <div className="space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Easy Setup</h3>
            <p className="text-gray-600">Create your knowledge base with simple Q&A pairs or upload CSV/JSON files.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your AI, Your Rules</h3>
            <p className="text-600">Connect any AI API provider with custom templates and configurations.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Embed Anywhere</h3>
            <p className="text-gray-600">Get a lightweight widget code to embed your chat agent on any website.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
