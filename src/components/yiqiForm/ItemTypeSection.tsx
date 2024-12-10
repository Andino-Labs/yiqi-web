import React from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Circle, Square, Plus, Settings2 } from 'lucide-react'
import {
  FormProps,
  InputTypes,
  ItemTypeProps
} from '../../schemas/yiqiFormSchema'
import { cn } from '@/lib/utils'
import { generateUniqueId } from './utils'
interface ItemTypeSectionProps {
  id: string
  fields: FormProps[]
  addEtcItem: (id: string, contentId: string) => void
  addSelectItem: (id: string, contentId: string, text: string) => void
  removeSelectItem: (cardId: string, contentId: string) => void
  setText: (cardId: string, text: string, contentId?: string) => void
}
const ItemTypeSection = ({
  id,
  fields,
  addEtcItem,
  addSelectItem,
  removeSelectItem,
  setText
}: ItemTypeSectionProps) => {
  const { control } = useForm()
  const currentField = fields.find(field => field.id === id) as FormProps
  const inputType = currentField?.inputType
  const isFocused = currentField?.isFocused
  const contents = currentField?.contents as ItemTypeProps[]

  const haveEtc = () => {
    if (currentField.inputType === InputTypes.CHECKBOX) {
      return true
    }
    return (currentField.contents as ItemTypeProps[]).some(
      content => content.isEtc
    )
  }
  const handleChangeContentText = (
    e: React.ChangeEvent<HTMLInputElement>,
    contentId: string
  ) => {
    setText(id, e.target.value, contentId)
  }
  return (
    <div className="w-full">
      <div className="space-y-3">
        {contents.map((content, index) => (
          <motion.div
            key={content.id + String(index)}
            className="group relative flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {inputType === InputTypes.RADIO && (
                <Circle className="w-5 h-5 text-primary/60" />
              )}
              {inputType === InputTypes.CHECKBOX && (
                <Square className="w-5 h-5 text-primary/60" />
              )}
              {inputType === InputTypes.SELECT && (
                <span className="w-8 h-8 flex items-center justify-center text-muted-foreground font-medium">
                  {index + 1}
                </span>
              )}
            </div>

            <Controller
              name="TextFieldInput"
              control={control}
              render={() => (
                <Input
                  className={cn(
                    'flex-1 h-10 bg-background/50 border-0 border-b focus-visible:ring-0 rounded-md',
                    'placeholder:text-muted-foreground/60',
                    'transition-all duration-200',
                    isFocused && 'hover:bg-background/80',
                    content.isEtc && 'text-muted-foreground italic'
                  )}
                  value={content.isEtc ? 'Otros...' : content.text}
                  onChange={e => handleChangeContentText(e, content.id)}
                  disabled={content.isEtc}
                />
              )}
            />

            {isFocused && contents.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeSelectItem(id, content.id)}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {isFocused && (
        <div className="mt-4 flex items-center gap-2 pl-8">
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={() => {
              const contentId = generateUniqueId()
              addSelectItem(
                id,
                contentId,
                `Opción ${contents.filter(content => !content.isEtc).length + 1}`
              )
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir opción
          </Button>

          {inputType !== InputTypes.SELECT && !haveEtc() && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={() => {
                const contentId = generateUniqueId()
                addEtcItem(id, contentId)
              }}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Agregar &quot;Otros&quot;
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default ItemTypeSection
