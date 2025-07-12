import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  try {
    const session = await getServerSession(authOptions)

    if (session) {
      redirect("/dashboard")
    }

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
              <Link href="/auth/signup">
                <Button size="lg" className="px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Easy Setup</h3>
              <p className="text-gray-600">
                Create your knowledge base with simple Q&A pairs or upload CSV/JSON files.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Your AI, Your Rules</h3>
              <p className="text-gray-600">Connect any AI API provider with custom templates and configurations.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Embed Anywhere</h3>
              <p className="text-gray-600">Get a lightweight widget code to embed your chat agent on any website.</p>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("HomePage error:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to AI Chat SaaS</h1>
          <p className="text-gray-600 mb-4">Loading...</p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }
}
