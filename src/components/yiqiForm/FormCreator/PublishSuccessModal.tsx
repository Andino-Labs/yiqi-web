import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Copy, PartyPopper } from 'lucide-react'
import { translations } from '@/lib/translations/translations'
import ButtonClipboard from './ButtonClipboard'
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
            <ButtonClipboard
              text={formUrl}
              textCopied={translations.es.copied}
              textCopy={translations.es.copy}
              icon={<Copy className="h-4 w-4" />}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
