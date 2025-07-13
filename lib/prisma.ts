import { PrismaClient } from "@prisma/client"

// Declare a global variable to store the PrismaClient instance
// This is necessary to prevent hot-reloading from creating new instances in development
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined
}

// Initialize PrismaClient once globally
export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

// In development, store the PrismaClient instance on the global object
// This prevents new instances from being created on hot-reloads
if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma
}

// Optional: Function to test database connection (for health checks or debugging)
export async function testConnection() {
  try {
    await prisma.$connect()
    console.log("Database connected successfully")
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
