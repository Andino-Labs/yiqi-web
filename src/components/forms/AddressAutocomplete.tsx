'use client'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
  onSetAddress: (value: string) => void
  defaultValue?: string
  fieldName: string
  placeholder?: string
}
const PlaceAutocomplete = ({
  onPlaceSelect,
  defaultValue,
  onSetAddress,
  fieldName,
  placeholder = 'Dirección'
}: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const places = useMapsLibrary('places')

  useEffect(() => {
    if (!places || !inputRef.current) return

    const options = {
      fields: ['geometry', 'name', 'formatted_address', 'address_components']
    }
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
  }, [places])

  useEffect(() => {
    if (!placeAutocomplete) return

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace())
    })
  }, [onPlaceSelect, placeAutocomplete])

  return (
    <input
      ref={inputRef}
      className={`p-2 rounded-lg w-full text-green-dark placeholder-green-dark border-2 border-grey-secondary
      focus:border-white-dark dark:bg-primary dark:text-primary`}
      name={fieldName}
      onBlur={() => {
        onSetAddress('')
      }}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  )
}

export const AddressAutocomplete = ({
  fieldName,
  onSetAddress,
  onAfterSelection,
  defaultValue,
  placeholder
}: {
  fieldName: string
  onSetAddress: (value: string) => void
  onAfterSelection?: (
    selectedPlace: google.maps.places.PlaceResult | null
  ) => void
  defaultValue?: string
  placeholder?: string
}) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>()

  useEffect(() => {
    if (selectedPlace?.formatted_address) {
      onSetAddress(selectedPlace.formatted_address)
      if (onAfterSelection) onAfterSelection(selectedPlace)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlace])

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <PlaceAutocomplete
        onPlaceSelect={setSelectedPlace}
        fieldName={fieldName}
        onSetAddress={onSetAddress}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </APIProvider>
  )
}
