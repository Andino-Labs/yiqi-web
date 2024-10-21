import * as _trpc_server from '@trpc/server'
import * as _trpc_server_unstable_core_do_not_import from '@trpc/server/unstable-core-do-not-import'

declare const appRouter: _trpc_server_unstable_core_do_not_import.BuiltRouter<
  {
    ctx: object
    meta: object
    errorShape: _trpc_server_unstable_core_do_not_import.DefaultErrorShape
    transformer: true
  },
  {
    searchUsers: _trpc_server.TRPCQueryProcedure<{
      input: {
        query: string
      }
      output: {
        id: string
        name: string
        email: string
        emailVerified: Date | null
        picture: string | null
        phoneNumber: string | null
      }[]
    }>
  }
>
type AppRouter = typeof appRouter

export type { AppRouter }
