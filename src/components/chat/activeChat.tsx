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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

export default function ActiveChatComponent({
  chats,
  children,
  activeUserId
}: {
  chats: OrgMessageListItemSchemaType[]
  children: React.ReactNode
  activeUserId: string
}) {
  const t = useTranslations('Chat')

  // Find active chat
  const activeChat = chats.find(chat => chat.contextUserId === activeUserId)

  return (
    <Card className="h-[80vh]">
      <CardContent className="p-0 h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">{t('chats')}</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="pr-4">
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
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex flex-col h-full">
              {activeChat?.type === 'email' && activeChat.lastMessage && (
                <div className="p-4 border-b flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview HTML
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Email Preview</DialogTitle>
                      </DialogHeader>
                      <div
                        className="mt-4"
                        dangerouslySetInnerHTML={{
                          __html: activeChat.lastMessage.content
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              <ScrollArea className="flex-1">
                <div className="flex flex-col h-full">
                  <div className="p-4">{children}</div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  )
}
