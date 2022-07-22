export const convertNumberToString = (value?: number) => (value || value === 0 ? String(value) : undefined)

export const separateWords = (keywordsString: string) => {
  // regEpx replaces all punctuation marks with white spaces and turns any sequence of white spaces into single white space
  const keywords = keywordsString.replace(/\p{P}/gu, ' ').replace(/\s+/g, ' ').trim().split(' ')

  return keywords
}
