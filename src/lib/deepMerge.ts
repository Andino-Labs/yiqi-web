type JsonValue = JsonObject | JsonArray | string | number | boolean | null
export type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

/**
 * Deeply merges two or more JSON-serializable objects.
 *
 * This function merges properties from source objects into a target object recursively.
 * Arrays are replaced entirely, while objects are deeply merged. Only JSON-serializable
 * objects are valid inputs (e.g., no functions, undefined values, or circular references).
 *
 * @template T The type of the target object.
 * @param target The target object to merge into.
 * @param sources One or more source objects to merge from.
 * @returns The deeply merged object.
 *
 * @throws {TypeError} If any input is not a plain object or is not JSON-serializable.
 */
export function deepMerge<T extends JsonObject>(
  target: T,
  ...sources: JsonObject[]
): T {
  if (!isPlainObject(target)) {
    throw new TypeError('Target must be a plain JSON-serializable object.')
  }

  for (const source of sources) {
    if (!isPlainObject(source)) {
      throw new TypeError('Sources must be plain JSON-serializable objects.')
    }

    for (const key of Object.keys(source)) {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        ;(target as Record<string, JsonValue>)[key] = deepMerge(
          targetValue,
          sourceValue
        )
      } else if (Array.isArray(sourceValue)) {
        ;(target as Record<string, JsonValue>)[key] = [...sourceValue]
      } else {
        ;(target as Record<string, JsonValue>)[key] = sourceValue
      }
    }
  }

  return target
}

/**
 * Checks if a value is a plain JSON-serializable object.
 *
 * @param value The value to check.
 * @returns True if the value is a plain object, otherwise false.
 */
function isPlainObject(value: unknown): value is JsonObject {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}
