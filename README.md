# AI Chat SaaS Platform

A full-stack SaaS application that allows users to create and manage AI chat agents with embeddable widgets.

## Features

- 🤖 Create and manage AI chat agents
- 📚 Knowledge base management (Q&A entries, CSV/JSON upload)
- 🔧 Configure external AI API providers
- 🎨 Customizable chat widget
- 📊 Multi-tenant architecture
- 🔐 Secure API key storage
- 📱 Responsive dashboard

## Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ai-chat-saas
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `ENCRYPTION_KEY`: 32-character key for API key encryption

4. Set up the database:
\`\`\`bash
npx prisma db push
npx prisma generate
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Database Setup

For production, use a managed PostgreSQL service like:
- Supabase
- PlanetScale
- Railway
- Neon

## Usage

### Creating a Chat Agent

1. Sign up/login to your dashboard
2. Click "New Chat Agent"
3. Configure your knowledge base
4. Set up your AI API configuration
5. Customize the widget appearance
6. Get the embed code

### Embedding the Widget

Add this code to any website:

\`\`\`html
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-domain.com/widget.js';
    script.setAttribute('data-chat-agent-id', 'your-agent-id');
    script.setAttribute('data-config', '{}');
    document.head.appendChild(script);
  })();
</script>
\`\`\`

## API Configuration

The platform supports any AI API provider. Configure your API with:

- **API Key**: Your provider's API key (encrypted)
- **Endpoint**: API endpoint URL
- **Body Template**: JSON template with placeholders:
  - `{{prompt}}`: User's message
  - `{{context}}`: Relevant knowledge base context

Example for OpenAI:
\`\`\`json
{
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
}
\`\`\`

## Security Features

- 🔐 Encrypted API key storage
- 🏢 Multi-tenant data isolation
- 🛡️ Input validation and sanitization
- 🚦 Rate limiting (implement as needed)
- 🔒 Secure authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
