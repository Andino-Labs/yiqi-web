'use server'

export const verifyTwitterVariables = async () => {
  return Boolean(
    process.env.X_API_KEY &&
      process.env.X_API_SECRET &&
      process.env.X_BEARER_TOKEN
  )
}
