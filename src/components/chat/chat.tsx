'use client'
import { Card, CardContent } from '@/components/ui/card'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { MessagesSquare } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrgMessageListItemSchemaType } from '@/schemas/messagesSchema'
import { useTranslations } from 'next-intl'
import ChatSelector from './ChatSelector'
import { useEffect, useState } from 'react'

export default function ChatComponent({
  chats
}: {
  chats: OrgMessageListItemSchemaType[]
}) {
  const [isMobile, setIsMobile] = useState(false)
  const t = useTranslations('Chat')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 450)
    }
    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Card className="h-[80vh] md:h-[90vh] w-full max-w-7xl mx-auto">
      <CardContent className="p-0 h-full">
        <ResizablePanelGroup
          direction={isMobile ? 'vertical' : 'horizontal'}
          className="h-full flex flex-col md:flex-row"
        >
          <ResizablePanel
            defaultSize={isMobile ? 100 : 25}
            minSize={20}
            className={`min-w-[250px] ${isMobile ? 'w-full' : ''}`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4">
                <h2 className="text-lg font-semibold">{t('messages')}</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="pr-4 space-y-2">
                  {chats.map((chat, index) => (
                    <ChatSelector key={index} {...chat} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          {/* Panel de conversación solo visible en escritorio */}
          {!isMobile && <ResizableHandle className="hidden md:block" />}

          {!isMobile && (
            <ResizablePanel defaultSize={75} minSize={50}>
              <div className="flex flex-col h-full items-center justify-center p-6 text-center space-y-4">
                <MessagesSquare className="w-16 h-16 text-gray-400" />
                <span className="font-semibold text-2xl text-gray-700">
                  {t('clickToContinue')}
                </span>
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  )
}
