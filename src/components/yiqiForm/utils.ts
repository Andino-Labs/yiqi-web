export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36)
  const randomNum = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomNum}`
}
