type PhoneNumberFormatOptions = {
  defaultCountryCode: string
}

function formatPhoneNumber(
  input: string,
  options: PhoneNumberFormatOptions
): string {
  const { defaultCountryCode } = options
  const sanitizedInput = input.replace(/[^0-9+]/g, '')
  if (/^\+\d+$/.test(sanitizedInput)) {
    return sanitizedInput
  }
  if (/^\d+$/.test(sanitizedInput)) {
    return `+${defaultCountryCode}${sanitizedInput}`
  }
  throw new Error('Invalid phone number format')
}

export { formatPhoneNumber }
