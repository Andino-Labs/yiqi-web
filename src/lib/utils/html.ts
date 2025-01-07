'use client'

import { useEffect, useState } from 'react'
import { EMAIL_MAIN_CONTENT_CLASS, EMAIL_CONTENT_CLASS } from '@/lib/utils'

interface StripHtmlProps {
  html: string
  isPlatformMessage?: boolean
}

export function useStripHtml({
  html,
  isPlatformMessage = false
}: StripHtmlProps) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const tmp = window.document.createElement('DIV')
    tmp.innerHTML = html

    let text = ''

    if (isPlatformMessage) {
      // For platform messages, get content from within EMAIL_MAIN_CONTENT_CLASS
      const mainContent = tmp.getElementsByClassName(
        EMAIL_MAIN_CONTENT_CLASS
      )[0] as HTMLElement
      if (mainContent) {
        text = mainContent.textContent || mainContent.innerText || ''
      }
    } else {
      // For user replies, exclude content within EMAIL_CONTENT_CLASS
      const emailContent = tmp.getElementsByClassName(EMAIL_CONTENT_CLASS)
      if (emailContent.length > 0) {
        // Remove all elements with EMAIL_CONTENT_CLASS
        Array.from(emailContent).forEach(el => el.remove())
      }
      // Get remaining content
      text = tmp.textContent || tmp.innerText || ''
    }

    // Process line breaks and clean up
    const processedText = text
      .replace(/\n\s*\n/g, '\n\n') // Convert multiple line breaks to double line breaks
      .replace(/\n\n\n+/g, '\n\n') // Remove excessive line breaks (more than 2)
      .trim()

    setContent(processedText)
  }, [html, isPlatformMessage])

  return content
}
