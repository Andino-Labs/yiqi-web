import React, { useCallback, useMemo } from 'react'
import { Copy, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { FormProps } from '../../../schemas/yiqiFormSchema'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { generateUniqueId } from '../utils'
import { translations } from '@/lib/translations/translations'
interface FieldFooterProps {
  id: string
  fields: FormProps[]
  removeCard: (cardId: string) => void
  copyCard: (cardId: string, copiedCardId: string) => void
  toggleIsRequired: (id: string) => void
}

const FieldFooter = ({
  id,
  fields,
  removeCard,
  copyCard,
  toggleIsRequired
}: FieldFooterProps) => {
  const currentField = useMemo(
    () => fields.find(field => field.id === id),
    [fields, id]
  )

  const isRequired = useMemo(
    () => currentField?.isRequired ?? false,
    [currentField]
  )

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      copyCard(id, generateUniqueId())
    },
    [copyCard, id]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      removeCard(id)
    },
    [removeCard, id]
  )

  const handleRequiredChange = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleIsRequired(id)
    },
    [toggleIsRequired, id]
  )

  return (
    <footer className="h-14 flex items-center justify-end border-t border-border/40 px-4 sm:px-6 bg-transparent">
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-9 w-9 rounded-full hover:bg-accent"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">
                    {translations.es.copyQuestion}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {translations.es.copyField}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">
                    {translations.es.deleteQuestion}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {translations.es.deleteQuestion}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center gap-3">
          <Label
            htmlFor="required-toggle"
            className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
          >
            {translations.es.required}
          </Label>
          <Switch
            id="required-toggle"
            checked={isRequired}
            onClick={handleRequiredChange}
            className={cn(
              'data-[state=checked]:bg-primary text-white',
              'transition-colors duration-200'
            )}
          />
        </div>
      </div>
    </footer>
  )
}

export default FieldFooter
