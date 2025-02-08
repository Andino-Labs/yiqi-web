export function generateUniqueIdYiqiForm(): string {
  const timestamp = Date.now().toString(36)
  const randomNum = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomNum}`
}
export const truncateText = (title: string, maxLength: number = 20) => {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title
}
