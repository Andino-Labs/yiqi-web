'use client'

import { useEffect, useState } from 'react'

export function useStripHtml({ html }: { html: string }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    // First, replace common text tags with their content plus line breaks
    const processedHtml = html
      .replace(/<\/(p|div|h[1-6]|table|tr|li|br)[^>]*>/gi, '$&\n\n') // Add double line break after closing tags
      .replace(/<br[^>]*>/gi, '\n') // Replace <br> with single line break

    const tmp = window.document.createElement('DIV')
    tmp.innerHTML = processedHtml
    const text = tmp.textContent || tmp.innerText || ''

    // Clean up excessive line breaks while preserving intentional ones
    text
      .replace(/\n\s*\n/g, '\n\n') // Convert multiple line breaks to double line breaks
      .replace(/\n\n\n+/g, '\n\n') // Remove excessive line breaks (more than 2)
      .trim()
    setContent(text)
  }, [html])

  return content
}
