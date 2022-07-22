export const getEnvironmentVariable = (variableName: string, defaultValue?: string | null) => {
  const variables = process.env || {}
  const variableValue = variables[variableName]

  if (variableValue === undefined) {
    console.log(`Environment variable ${variableName} is not set`)
    return defaultValue
  }

  return variableValue
}
