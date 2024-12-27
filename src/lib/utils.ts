import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLocationDetails = (
  components: google.maps.GeocoderAddressComponent[] | undefined
) => {
  if (!components) return null

  let city = ''
  let state = ''
  let country = ''

  components.forEach(component => {
    if (component.types.includes('locality')) {
      city = component.long_name
    } else if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name
    } else if (component.types.includes('country')) {
      country = component.short_name
    }
  })

  return { city, state, country }
}

export function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}
