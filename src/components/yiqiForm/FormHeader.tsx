'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, SendHorizonal } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'
import { createTypeForm } from '@/services/actions/typeForm/typeFormActions'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { translations } from '@/lib/translations/translations'
import { generateUniqueId } from './utils'
import { Form, FormProps } from '../../schemas/yiqiFormSchema'
import { PublishSuccessModal } from './PublishSuccessModal'
import { useRouter } from 'next/navigation'

export function FormHeader({
  form,
  orgId,
  onNavigate,
  currentView
}: {
  form: FormProps[]
  orgId: string
  onNavigate: (view: 'create' | 'results') => void
  currentView: 'create' | 'results'
}) {
  const navigationItems = [
    {
      title: 'Preguntas',
      view: 'create' as const,
      disabled: false
    }
    // {
    //   title: 'Respuestas',
    //   view: 'results' as const,
    //   disabled: false
    // }
  ]

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [publishedFormUrl, setPublishedFormUrl] = useState('')
  const { toast } = useToast()
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }
  const handlePublish = async () => {
    if (form.length < 2) {
      toast({
        title: translations.es.formEmptyErrorTitle,
        description: translations.es.formEmptyErrorDescription,
        variant: 'destructive'
      })
      return
    }
    const description = Array.isArray(form[0]?.contents)
      ? form[0]?.contents.map(item => item.text).join(', ')
      : (form[0]?.contents ?? '')
    try {
      const formToSubmit: Form = {
        id: generateUniqueId(),
        name: form[0]?.cardTitle,
        description: description,
        fields: form,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const response = await createTypeForm(orgId, formToSubmit)
      if (response.success) {
        setPublishedFormUrl(
          `${process.env.NEXT_PUBLIC_URL}/form/${formToSubmit.id}`
        )
        setIsPublishModalOpen(true)
      } else {
        toast({
          title: `${translations.es.publishErrorTitle}`,
          description: `${translations.es.publishErrorDescription}`,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: `${translations.es.formErrorTitle}`,
        description: `${translations.es.formErrorDescription}`,
        variant: 'destructive'
      })
      console.info(error)
    }
  }
  return (
    <>
      <header
        style={{ boxShadow: 'inset 0 -1px #ffffff24' }}
        className="bg-white dark:bg-[#0A0A0A] z-30 w-full"
      >
        <div className="flex flex-col ">
          <div className="relative flex flex-col sm:flex-row items-center justify-between px-4 pr-4 md:pr-8 pt-4 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="bg-gradient-to-r from-black to-[#04F1FF]/10 dark:from-gray-900 dark:to-[#04F1FF]/20 p-2 rounded-full shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              <span className="text-base font-bold dark:text-white text-black">
                YiqiForm
              </span>
              <span className="hidden md:block text-muted-foreground">/</span>
              <span className="hidden md:block text-base font-bold dark:text-white text-black">
                {form[0]?.cardTitle?.length > 30
                  ? form[0]?.cardTitle.slice(0, 30) + '...'
                  : form[0]?.cardTitle}
              </span>
            </div>

            <div className="absolute top-4 right-8 sm:static">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 mr-2 
    bg-secondary/10 
    text-secondary-foreground 
    hover:bg-secondary/20 
    dark:bg-secondary/20 
    dark:hover:bg-secondary/30"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                {translations.es.back}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 
    relative 
    overflow-hidden 
    border-primary/50 
    text-primary 
    before:absolute 
    before:inset-0 
    before:bg-gradient-to-r 
    before:from-blue-500/20 
    before:via-primary/20 
    before:to-purple-500/20 
    before:opacity-0 
    before:transition-opacity 
    before:-z-10 
    hover:before:opacity-100 
    hover:border-primary/80 
    hover:text-white 
    hover:shadow-lg 
    active:scale-100 
    dark:border-primary/30 
    dark:text-primary/80 
    dark:hover:border-primary/60"
                onClick={handlePublish}
              >
                <SendHorizonal className="h-4 w-4" />
                {translations.es.publish}
              </Button>
            </div>
          </div>

          <div className="flex justify-center w-full px-4 py-2">
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex flex-col sm:flex-row justify-center gap-6">
                {navigationItems.map(({ title, view }) => (
                  <NavigationMenuItem
                    key={view}
                    className="text-center group relative"
                    onClick={() => onNavigate(view)}
                  >
                    <NavigationMenuLink
                      className={`
                      text-black dark:text-white
                      transition-colors
                      pb-1
                      relative
                      cursor-pointer
                      
                      ${currentView === view ? 'font-semibold' : 'hover:opacity-70 hover:text-gray-700 dark:hover:text-gray-300'}
                    `}
                    >
                      <span
                        className={`
                        absolute
                        -bottom-2
                        left-0
                        right-0
                        h-1
                        rounded-tl-sm rounded-tr-sm
                        transition-all
                        duration-300
                        ${currentView === view ? 'bg-gray-400 dark:bg-gray-500 scale-x-100' : 'bg-transparent scale-x-0'}
                      `}
                      />
                      {title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>
      <PublishSuccessModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        formUrl={publishedFormUrl}
      />
    </>
  )
}
