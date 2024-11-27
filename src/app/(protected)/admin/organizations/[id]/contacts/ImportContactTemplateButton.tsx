'use client'

import { translations } from '@/lib/translations/translations'

/*
const exampleCsv = `email,phone,name,age,city
john.doe@example.com,123456789,John Doe,25,New York
jane.smith@example.com,987654321,Jane Smith,30,Los Angeles
robert.brown@example.com,567890123,Robert Brown,35,Chicago
emily.davis@example.com,345678901,Emily Davis,28,Miami
michael.wilson@example.com,123098456,Michael Wilson,40,Seattle
sarah.johnson@example.com,789012345,Sarah Johnson,32,Houston
david.martinez@example.com,456789012,David Martinez,29,Dallas
linda.hernandez@example.com,890123456,Linda Hernandez,34,San Diego
james.lopez@example.com,234567890,James Lopez,26,Phoenix
patricia.gonzalez@example.com,678901234,Patricia Gonzalez,38,San Francisco`
*/

export function ImportContactTemplateButton() {
  function handleOnClickButton() {
    const exampleCsv = translations.es.exampleCsvContent
    const blob = new Blob([exampleCsv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'example.csv')
    link.click()
  }

  return (
    <button
      className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
      onClick={handleOnClickButton}
    >
      {translations.es.downloadCsvTemplate}
    </button>
  )
}
