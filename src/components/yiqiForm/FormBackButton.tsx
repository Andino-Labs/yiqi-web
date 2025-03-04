import React from 'react'
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip
} from '../ui/tooltip'
import { Button } from '../ui/button'
import { Undo2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

function FormBackButton({ url: orgId }: { url: string }) {
  const router = useRouter()
  const t = useTranslations('YiqiForm')

  const handleBack = () => {
    router.push(`/admin/organizations/${orgId}/forms`)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            style={{
              borderRadius: '50%',
              width: '36px',
              height: '36px'
            }}
            variant="ghost"
            size="sm"
            className="    
                    bg-transparent 
                    hover:bg-secondary/10 
                    dark:hover:bg-secondary/20
                    text-secondary-foreground mr-2 
                    dark:border-primary/50
                    dark:border
        "
            onClick={handleBack}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t('back')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default FormBackButton
