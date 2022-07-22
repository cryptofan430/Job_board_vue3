export const withoutNullishValues = <T extends Record<string, unknown>>(object: T): T => {
  const objectEntries = Object.entries(object)

  const notNullishEntries = objectEntries
    .filter((paramsPair) => paramsPair[1] || paramsPair[1] === 0)
    .filter((paramsPair) => (Array.isArray(paramsPair[1]) ? paramsPair[1].length : true))

  const withoutNullishValues = Object.fromEntries(notNullishEntries)
  return withoutNullishValues as T
}
