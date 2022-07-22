export const initialIItems = <T extends unknown>(items: T[], itemsCount: number) => {
  const copy = [...items]
  copy.length = Math.min(items.length, itemsCount)
  return copy
}
