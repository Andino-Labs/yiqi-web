import MercadoPagoConfig, { Preference } from 'mercadopago'

const access = 'add mercadopago token'

export const MPclient = new MercadoPagoConfig({
  accessToken: access
})

export const MPpreference = new Preference(MPclient)
