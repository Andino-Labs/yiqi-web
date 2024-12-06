'use client'

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select
} from '@/components/ui/select'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { setCookie } from 'cookies-next'

type Language = 'en' | 'es' | 'fr' | 'pt'

function getLanguageName(lang: Language): string {
  const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese'
  }
  return languageNames[lang]
}

interface LangSelectorProps {
  className?: string
}

export default function LangSelector({ className }: LangSelectorProps) {
  const localActive = useLocale() as Language
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(localActive)

  function handleLanguageChange(value: string): void {
    const nextLocale = value as Language
    setSelectedLanguage(nextLocale)
    setCookie('locale', nextLocale, { maxAge: 60 * 60 * 24 * 365 })
    window.location.reload()
  }

  return (
    <div className={`w-25 ${className}`}>
      <Select defaultValue={localActive} onValueChange={handleLanguageChange}>
        <SelectTrigger
          id="language"
          className="w-[180px] bg-transparent text-white"
        >
          <SelectValue
            placeholder="Select Language"
            className="bg-transparent text-white"
          >
            {getLanguageName(selectedLanguage)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="bg-zinc-900 border-none text-white"
        >
          <SelectItem
            className="focus:bg-accent/35 focus:text-[#61f1f8]"
            value="en"
          >
            English
          </SelectItem>
          <SelectItem
            className="focus:bg-accent/35 focus:text-[#61f1f8]"
            value="es"
          >
            Spanish
          </SelectItem>
          <SelectItem
            className="focus:bg-accent/35 focus:text-[#61f1f8]"
            value="fr"
          >
            French
          </SelectItem>
          <SelectItem
            className="focus:bg-accent/35 focus:text-[#61f1f8]"
            value="pt"
          >
            Portuguese
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
