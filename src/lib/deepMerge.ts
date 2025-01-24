type GenericObject = Record<string, unknown>

/**
 * Recursively merges two objects. If a key exists in both objects and both values are objects,
 * it merges them deeply. Otherwise, the value from `newData` replaces the value in `existingData`.
 */
export function deepMerge<T extends GenericObject, U extends GenericObject>(
  existingData: T,
  newData: U
): T & U {
  const result: GenericObject = { ...existingData }

  for (const key of Object.keys(newData)) {
    if (
      key in existingData &&
      typeof existingData[key] === 'object' &&
      typeof newData[key] === 'object' &&
      !Array.isArray(existingData[key]) &&
      !Array.isArray(newData[key])
    ) {
      result[key] = deepMerge(
        existingData[key] as GenericObject,
        newData[key] as GenericObject
      )
    } else {
      result[key] = newData[key]
    }
  }

  return result as T & U
}
