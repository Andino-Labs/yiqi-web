import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { translations } from '@/lib/translations/translations'

interface PublishSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  formUrl: string
}
export function PublishSuccessModal({
  isOpen,
  onClose,
  formUrl
}: PublishSuccessModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl)
      setCopied(true)
      toast({
        title: translations.es.copied,
        description: translations.es.copyDescription,
        duration: 2000
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
      toast({
        title: translations.es.copyFailed,
        description: translations.es.retryDescription,
        variant: 'destructive'
      })
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[760px]">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2 text-2xl">
            {translations.es.formPublished}
            <PartyPopper className="h-6 w-6 text-yellow-500 animate-bounce" />
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          <div className="flex items-center gap-2 p-1 rounded-lg border bg-background/50 backdrop-blur-sm">
            <Input
              value={formUrl}
              readOnly
              className="border-0 bg-transparent focus-visible:ring-0 dark:text-white dark:border-slate-700 dark:placeholder:text-muted-foreground"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 gap-1.5"
            >
              <Copy className="h-4 w-4" />
              {copied ? translations.es.copied : translations.es.copy}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
