/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export const defaultValue = `

# Bienvenido al Editor de Markdown

Puedes usar **negrita**, *cursiva*, o ~~tachado~~.

- Elemento de lista 1
- Elemento de lista 2

1. Elemento numerado 1
2. Elemento numerado 2

> Esto es una cita en bloque

[Enlace a Google](https://www.google.com)

![Texto alternativo para una imagen](/placeholder.svg?height=100&width=100)

\`\`\`javascript
console.log("Este es un bloque de código");
\`\`\`

### Cómo incrustar un video de YouTube:

Para incrustar un video de YouTube, usa el siguiente formato:
\`\`\`html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
\`\`\`
Reemplaza \`VIDEO_ID\` con el ID del video que deseas incrustar.

### Ejemplo de un video de YouTube incrustado:
<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Este código insertará el video en el documento Markdown.
`
export function MarkdownEditor(props: { initialValue?: string; name: string }) {
  const name = props.name
  const [markdown, setMarkdown] = useState<string>(
    props.initialValue || defaultValue
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(
    function () {
      if (textareaRef.current) {
        textareaRef.current.value = markdown
      }
    },
    [markdown]
  )

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMarkdown(e.target.value)
  }

  return (
    <Card className="mx-auto max-w-[550px]">
      <CardContent className="p-6">
        <div className="prose prose-sm max-w-none mb-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code: function ({
                node,
                inline,
                className,
                children,
                ...props
              }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as unknown}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Editar contenido</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Markdown Content</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <textarea
                ref={textareaRef}
                name={name}
                onChange={handleInput}
                className="w-full h-[400px] p-4 border rounded-md font-mono resize-none"
                aria-label="Markdown input"
                defaultValue={markdown}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
