export interface MessageRequestBody {
  messaging_product: string
  to: string
  text: {
    body: string
  }
}

export interface MessageResponse {
  messaging_product: string
  contacts: {
    input: string
    wa_id: string
  }[]
  messages: {
    id: string
  }[]
}
