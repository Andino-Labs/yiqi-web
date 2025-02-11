import { useTranslations } from 'next-intl'

const toCamelCase = (input: string) => {
  return input
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('')
}
export const useTranslationByGroup = (translationGroup: string) => {
  const t = useTranslations(translationGroup)
  const getTranslation = (key: string) => t(toCamelCase(key))
  return {
    getTranslation
  }
}
