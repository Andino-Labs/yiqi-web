import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, PartyPopper, Share2, Webhook } from 'lucide-react'
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
      <DialogContent className="sm:max-w-[600px]">
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
              className="border-0 bg-transparent focus-visible:ring-0"
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
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              {translations.es.whatToDoNext}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="group relative overflow-hidden rounded-lg border p-4 hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-3">
                  <div className="flex gap-2">
                    <div className="bg-pink-100 p-2 rounded-md">
                      <Webhook className="h-5 w-5 text-pink-500" />
                    </div>
                  </div>
                  <h4 className="font-medium">
                    {translations.es.configureIntegrations}
                  </h4>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border p-4 hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-3">
                  <div className="flex gap-2">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <Share2 className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                  <h4 className="font-medium">
                    {translations.es.shareEmbedForm}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
