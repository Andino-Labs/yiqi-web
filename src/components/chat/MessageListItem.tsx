import { useStripHtml } from '@/lib/utils/html'
import { Message } from '@/schemas/messagesSchema'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function MessageListItem({ message }: { message: Message }) {
  const stripHtml = useStripHtml({ html: message.content || '' })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const handleToggleExpand = () => setIsExpanded(prev => !prev)
  const messageDate = new Date(message.createdAt).toLocaleString()
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
    <div key={message.id} className="mb-6 border-b pb-4 relative">
      {/* Botón de Preview en la esquina superior derecha */}
      <div className="absolute top-0 right-0  ">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {t('previewHTML')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('emailPreview')}</DialogTitle>
            </DialogHeader>
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{
                __html: message.content || ''
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cabecera con detalles del remitente */}
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={message.senderUser?.picture || '/default-avatar.png'}
            alt="User"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-bold text-sm">
            {message.senderUser?.name || 'Desconocido'}
          </p>
        </div>
        <div className="ml-auto text-xs text-gray-400">{messageDate}</div>
      </div>

      {isMobile && (
        <div className="mt-2 ml-auto text-xs text-gray-400">{messageDate}</div>
      )}

      {/* Tipo de mensaje */}
      <div>
        <span className="font-semibold text-sm text-gray-600">
          {message.messageThread.type}
        </span>
      </div>
      {/* Contenido del mensaje */}
      <div className="mt-4">
        <div className="prose text-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          {isExpanded ? (
            <div>{stripHtml || ''}</div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: stripHtml.substring(0, 35) + '...'
              }}
            />
          )}
        </div>

        <button onClick={handleToggleExpand} className="mt-2 text-gray-500">
          {isExpanded ? t('seeLess') : t('seeMore')}
        </button>
      </div>

      {/* Archivo adjunto */}
      {message.attachement && (
        <div className="mt-2">
          <a
            href={message.attachement}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-sm"
          >
            Ver archivo adjunto
          </a>
        </div>
      )}
    </div>
  )
}
