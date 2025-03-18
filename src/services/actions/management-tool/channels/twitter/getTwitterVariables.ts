'use server'

export const verifyTwitterVariables = async () => {
  return Boolean(process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET)
}
