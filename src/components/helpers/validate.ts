const stringValidation = {
  length: (value: string, min?: number, max?: number) => {
    if (min === undefined && typeof max === 'number') return value.length <= max
    if (max === undefined && typeof min === 'number') return value.length >= min
    if (min === undefined || max === undefined) return false
    return value.length >= min && value.length <= max
  },
}

const numberValidation = {
  range: (value: number, min?: number, max?: number) => {
    if (min === undefined && typeof max === 'number') return value <= max
    if (max === undefined && typeof min === 'number') return value >= min
    if (min === undefined || max === undefined) return false
    return value >= min && value <= max
  },
}

export default function useValidation() {
  return {
    string: stringValidation,
    number: numberValidation,
  }
}
