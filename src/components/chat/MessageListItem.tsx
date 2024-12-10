import { useStripHtml } from '@/lib/utils/html'
import { Message } from '@/schemas/messagesSchema'

export default function MessageListItem({ message }: { message: Message }) {
  const stripHtml = useStripHtml({ html: message.content || '' })
  return (
    <div key={message.id} className="mb-4">
      <p className="font-bold">{message.messageThread.type}</p>
      <p className="font-bold">{message.senderUser?.name || 'Unknown'}</p>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          {stripHtml}
        </div>
      </div>
    </div>
  )
}
