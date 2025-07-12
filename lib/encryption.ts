import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key-change-in-production"
const ALGORITHM = "aes-256-gcm"

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + ":" + encrypted
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
