'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Copy } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

interface ButtonClipboardProps {
  text: string
  className?: string
  variant?: 'default' | 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'lg'
  textCopy: string
  textCopied: string
  icon?: React.ReactNode
}

function ButtonClipboard({
  text,
  className = '',
  variant = 'ghost',
  size = 'sm',
  textCopied,
  textCopy,
  icon = <Copy className="h-4 w-4" />
}: ButtonClipboardProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState<boolean>(false)
  const t = useTranslations('YiqiForm')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: t('copied'),
        description: t('copyDescription'),
        duration: 2000
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
      toast({
        title: t('copyFailed'),
        description: t('retryDescription'),
        variant: 'destructive'
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={`shrink-0 gap-1.5 ${className}`}
    >
      {icon}
      {copied ? textCopied : textCopy}
    </Button>
  )
}

export default ButtonClipboard
