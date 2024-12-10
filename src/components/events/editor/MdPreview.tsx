'use client'

import { useMemo, useEffect, useState } from 'react'

interface MdPreviewProps {
  content: string
  darkMode?: boolean
  stripStyles?: boolean
  textOnly?: boolean
}

// very cool
export function MdPreview({
  content,
  darkMode = false,
  stripStyles = false,
  textOnly = false
}: MdPreviewProps) {
  const [processedContent, setProcessedContent] = useState(
    textOnly ? '' : content
  )

  useEffect(() => {
    if (textOnly) {
      try {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = content

        // Remove images, iframes, and videos
        const elementsToRemove = tempDiv.querySelectorAll('img, iframe, video')
        elementsToRemove.forEach(el => el.remove())

        setProcessedContent(tempDiv.innerHTML)
      } catch (error) {
        console.error('Error processing content:', error)
        setProcessedContent('')
      }
    } else {
      setProcessedContent(content)
    }
  }, [content, textOnly])

  return useMemo(() => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: processedContent }}
        className={`
          ${
            textOnly
              ? ''
              : `
            prose-video:w-full 
            prose-video:aspect-video 
            prose-img:max-w-full 
            prose-img:h-auto 
            [&_iframe]:w-full 
            [&_iframe]:aspect-video
          `
          }
          ${
            stripStyles
              ? ''
              : darkMode
                ? `
                prose-headings:text-primary
                prose-p:text-primary
                prose-strong:text-primary
                prose-em:text-primary
                prose-li:text-primary
                prose-code:text-primary
                prose-blockquote:text-primary
                prose-a:text-primary
                hover:prose-a:text-primary
                prose-pre:bg-primary
              `
                : `
                prose-headings:text-gray-900
                prose-p:text-gray-700
                prose-strong:text-gray-900
                prose-em:text-gray-700
                prose-li:text-gray-700
                prose-code:text-gray-700
                prose-blockquote:text-gray-700
                prose-a:text-blue-600
                hover:prose-a:text-blue-700
              `
          }
        `}
      />
    )
  }, [processedContent, darkMode, stripStyles, textOnly])
}
