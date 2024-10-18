import { initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create({
  transformer: SuperJSON // Optional if using superjson
})

export const router = t.router
export const publicProcedure = t.procedure
