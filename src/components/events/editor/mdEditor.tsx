'use client'

import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MdPreview } from './MdPreview'
import { MantineProvider } from '@mantine/core'
import { useUpload } from '@/hooks/useUpload'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

export function MarkdownEditor({
  initialValue,
  onChange
}: {
  initialValue?: string
  onChange: (value: string) => void
}) {
  const t = useTranslations('EventsPage')
  const defaultValue = `
  <h1>${t('defaultValueH1')}</h1>
  <p>
    ${t('defaultValueP') + ' '}<strong>${t('defaultValueStrong') + ', '}</strong>
    <em>${t('defaultValueItalic') + ', '}</em>
    ${' ' + t('defaultValueP2') + '.'}
  </p>
  `
  const [content, setContent] = useState(initialValue || defaultValue)
  const [stagingContent, setStagingContent] = useState(initialValue || t(''))
  const { toast } = useToast()
  const { uploadSingle, isUploading } = useUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadSingle(file)
      editor?.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      Image.configure({
        HTMLAttributes: {
          style: 'width: 100%; max-width: 500px;'
        }
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        modestBranding: true,
        HTMLAttributes: {
          class: 'w-full aspect-video'
        },
        inline: false
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      setStagingContent(newContent)
    }
  })

  useEffect(() => {
    if (editor && initialValue && !content) {
      editor.commands.setContent(initialValue)
    }
  }, [content, editor, initialValue])

  if (!editor) {
    return null
  }

  return (
    <MantineProvider>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) {
            handleImageUpload(file)
          }
        }}
      />
      <Card className="mx-auto max-w-full">
        <CardContent className="p-3">
          <Dialog>
            <DialogTrigger asChild>
              <div className="prose prose-sm max-w-none mb-4 cursor-pointer dark:prose-invert">
                <MdPreview darkMode={true} content={content} />
              </div>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto"
              closeIcon={
                <Button
                  onClick={() => {
                    const editorContent =
                      stagingContent === '<p></p>'
                        ? `<p>${t('defaultContent')}</p>`
                        : stagingContent
                    onChange(editorContent)
                    setContent(editorContent)
                  }}
                >
                  <Check className="h-12 w-12 text-primary" />
                </Button>
              }
            >
              <DialogHeader>
                <DialogTitle>{t(`editorTitle`)}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <RichTextEditor
                  editor={editor}
                  style={{ backgroundColor: 'black' }}
                  className="max-w-full [&_.mantine-RichTextEditor-content]:min-h-[300px] [&_.mantine-RichTextEditor-content]:max-w-full [&_iframe]:w-full [&_iframe]:aspect-video dark:bg-primary dark:text-primary rounded-md shadow-md dark:border-gray-700"
                >
                  <RichTextEditor.Toolbar className="dark:bg-primary dark:border-gray-700 border-b sticky stickyOffset={0} px-2 sm:px-4 py-2">
                    {/* Grupo de controles básicos */}
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Highlight />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    {/* Encabezados */}
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.AlignLeft />
                      <RichTextEditor.AlignCenter />
                      <RichTextEditor.AlignJustify />
                      <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Control
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Insert image"
                        title="Insert image"
                        className="hover:bg-gray-700 focus:outline-none transition dark:bg-primary dark:text-primary"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin dark:text-primary" />
                        ) : (
                          '🖼️'
                        )}
                      </RichTextEditor.Control>

                      <RichTextEditor.Control
                        onClick={() => {
                          const url = window.prompt('Enter YouTube URL:')
                          if (url) {
                            editor.commands.setYoutubeVideo({
                              src: url
                            })
                          }
                        }}
                        aria-label="Insert YouTube video"
                        title="Insert YouTube video"
                        className="hover:bg-gray-700 focus:outline-none transition dark:bg-primary dark:text-primary"
                      >
                        📺
                      </RichTextEditor.Control>
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content className="px-4 py-3 focus:outline-none rounded-md" />
                </RichTextEditor>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </MantineProvider>
  )
}
