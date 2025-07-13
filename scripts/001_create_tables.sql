-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Table: Account
CREATE TABLE "Account" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
);

-- Table: Session
CREATE TABLE "Session" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Table: VerificationToken
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
);

-- Table: ChatAgent
CREATE TABLE "ChatAgent" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatAgent_pkey" PRIMARY KEY ("id")
);

-- Table: KnowledgeBase
CREATE TABLE "KnowledgeBase" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatAgentId" TEXT NOT NULL,

    CONSTRAINT "KnowledgeBase_pkey" PRIMARY KEY ("id")
);

-- Table: ApiConfig
CREATE TABLE "ApiConfig" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "bodyTemplate" TEXT NOT NULL,
    "headers" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApiConfig_pkey" PRIMARY KEY ("id")
);

-- Table: WidgetConfig
CREATE TABLE "WidgetConfig" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#1F2937',
    "position" TEXT NOT NULL DEFAULT 'bottom-right',
    "welcomeMessage" TEXT NOT NULL DEFAULT 'Hi! How can I help you today?',
    "placeholder" TEXT NOT NULL DEFAULT 'Type your message...',
    "chatAgentId" TEXT NOT NULL UNIQUE,

    CONSTRAINT "WidgetConfig_pkey" PRIMARY KEY ("id")
);

-- Table: ChatSession
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "chatAgentId" TEXT NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- Table: ChatMessage
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatSessionId" TEXT NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints

ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChatAgent" ADD CONSTRAINT "ChatAgent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "KnowledgeBase" ADD CONSTRAINT "KnowledgeBase_chatAgentId_fkey" FOREIGN KEY ("chatAgentId") REFERENCES "ChatAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApiConfig" ADD CONSTRAINT "ApiConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WidgetConfig" ADD CONSTRAINT "WidgetConfig_chatAgentId_fkey" FOREIGN KEY ("chatAgentId") REFERENCES "ChatAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_chatAgentId_fkey" FOREIGN KEY ("chatAgentId") REFERENCES "ChatAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for foreign keys
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "ChatAgent_userId_idx" ON "ChatAgent"("userId");
CREATE INDEX "KnowledgeBase_chatAgentId_idx" ON "KnowledgeBase"("chatAgentId");
CREATE INDEX "ApiConfig_userId_idx" ON "ApiConfig"("userId");
CREATE INDEX "ChatSession_userId_idx" ON "ChatSession"("userId");
CREATE INDEX "ChatSession_chatAgentId_idx" ON "ChatSession"("chatAgentId");
CREATE INDEX "ChatMessage_chatSessionId_idx" ON "ChatMessage"("chatSessionId");
