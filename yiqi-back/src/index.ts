import { Elysia, redirect } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { whatsappModule } from '../modules'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
  .use(swagger())
  .get('/', function () {
    return redirect('/swagger')
  })
  .use(whatsappModule)
  .use(cors())
  .listen(3001)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
