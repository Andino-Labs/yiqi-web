'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrgMessageListItemSchemaType } from '@/schemas/messagesSchema'
import { useTranslations } from 'next-intl'
import ChatSelector from './ChatSelector'
import { useEffect, useState } from 'react'

export default function ActiveChatComponent({
  chats,
  children,
  activeUserId
}: {
  orgId: string
  chats: OrgMessageListItemSchemaType[]
  children: React.ReactNode
  activeUserId: string
}) {
  const t = useTranslations('Chat')
  const [isMobile, setIsMobile] = useState(false)

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
          {!isMobile && (
            <ResizablePanel
              defaultSize={25}
              minSize={20}
              className="min-w-[250px]"
            >
              <div className="h-full flex flex-col">
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{t('messages')}</h2>
                </div>
                <ScrollArea className="flex-1">
                  <div className="pr-4 space-y-2">
                    {chats.map((chat, index) => (
                      <ChatSelector
                        key={index}
                        {...chat}
                        isActive={chat.contextUserId === activeUserId}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
          )}

          {!isMobile && <ResizableHandle className="hidden md:block" />}

          {activeUserId && (
            <ResizablePanel defaultSize={75} minSize={50}>
              <div className="flex flex-col h-full">{children}</div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  )
}
