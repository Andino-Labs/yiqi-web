import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessagesSquare, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrgMessageListItemSchemaType } from '@/schemas/messagesSchema'
import { translations } from '@/lib/translations/translations'

function Chats({
  contextUserName,
  lastMessage,
  userId
}: OrgMessageListItemSchemaType) {
  function getFirst5Words(str: string): string {
    const words = str.split(' ')
    const first5Words = words.slice(0, 5)
    return first5Words.join(' ') + (words.length > 5 ? '...' : '')
  }

  return (
    <Link prefetch={true} href={`/chat/${userId}`}>
      <div className="border-b last:border-b-0">
        <div className="flex flex-row items-start gap-3 p-3 hover:bg-accent">
          <Avatar>
            <AvatarFallback>
              <Users />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <p className="font-bold">{contextUserName}</p>
            <p className="text-muted-foreground text-sm">
              {getFirst5Words(lastMessage.content)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ChatComponent({
  chats
}: {
  chats: OrgMessageListItemSchemaType[]
}) {
  return (
    <Card className="h-[80vh]">
      <CardContent className="p-0 h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {translations.es.chats}
                </h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="pr-4">
                  {chats.map((chat, index) => (
                    <Chats key={index} {...chat} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex flex-col h-full items-center justify-center p-6">
              <MessagesSquare className="w-10 h-10 mb-4" />
              <span className="font-semibold text-2xl">
                {translations.es.clickToContinue}
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  )
}
