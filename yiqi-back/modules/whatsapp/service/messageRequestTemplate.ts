import { CLOUD_API_URL } from './config'

export type MakeMessageRequestConfig = {
  businessPhoneNumberId: string
  accessToken: string
}

type Language = {
  code: string
}

type Name = {
  first_name: string
  last_name?: string
  middle_name?: string
  suffix?: string
  prefix?: string
}

type TextMessage = {
  type: 'text'
  text: {
    body: string
    preview_url?: boolean
  }
}

type MediaData<T extends 'image' | 'audio' | 'document' | 'video' | 'sticker'> =
  {
    link: string
    caption?: T extends 'image' | 'video' | 'document' ? string : never
    filename?: T extends 'document' ? string : never
  }

type MediaMessage<
  T extends 'image' | 'audio' | 'document' | 'video' | 'sticker'
> = {
  type: T
} & {
  [K in T]: MediaData<T>
}

type LocationMessage = {
  type: 'location'
  location: {
    latitude: number
    longitude: number
    name?: string
    address?: string
  }
}

type ContactMessage = {
  type: 'contacts'
  contacts: Array<{
    addresses?: Array<{
      street?: string
      city?: string
      state?: string
      zip?: string
      country?: string
      country_code?: string
      type?: 'HOME' | 'WORK'
    }>
    birthday?: string
    emails?: Array<{
      email: string
      type?: 'HOME' | 'WORK'
    }>
    name: Name
    org?: {
      company?: string
      department?: string
      title?: string
    }
    phones?: Array<{
      phone: string
      type?: 'CELL' | 'MAIN' | 'IPHONE' | 'HOME' | 'WORK'
      wa_id?: string
    }>
    urls?: Array<{
      url: string
      type?: 'HOME' | 'WORK'
    }>
  }>
}

type TemplateMessage = {
  type: 'template'
  template: {
    name: string
    language: Language
    components?: Array<{
      type: 'header' | 'body' | 'button'
      parameters: Array<
        | { type: 'text'; text: string }
        | {
            type: 'currency'
            currency: {
              fallback_value: string
              code: string
              amount_1000: number
            }
          }
        | {
            type: 'date_time'
            date_time: {
              fallback_value: string
              day_of_week: number
              year: number
              month: number
              day_of_month: number
              hour: number
              minute: number
              calendar: string
            }
          }
        | { type: 'image'; image: { link: string } }
        | { type: 'document'; document: { link: string; filename?: string } }
        | { type: 'video'; video: { link: string } }
      >
    }>
  }
}

type InteractiveMessage = {
  type: 'interactive'
  interactive: {
    type: 'button' | 'list' | 'product' | 'product_list'
    header?: {
      type: 'text' | 'video' | 'image' | 'document'
      text?: string
      video?: { link: string }
      image?: { link: string }
      document?: { link: string; filename?: string }
    }
    body: {
      text: string
    }
    footer?: {
      text: string
    }
    action: {
      button?: string
      buttons?: Array<{
        type: 'reply'
        reply: {
          id: string
          title: string
        }
      }>
      sections?: Array<{
        title?: string
        rows: Array<{
          id: string
          title: string
          description?: string
        }>
      }>
      catalog_id?: string
      product_retailer_id?: string
    }
  }
}

type ReactionMessage = {
  type: 'reaction'
  reaction: {
    message_id: string
    emoji: string
  }
}

type MessageContent =
  | TextMessage
  | MediaMessage<'image'>
  | MediaMessage<'audio'>
  | MediaMessage<'document'>
  | MediaMessage<'video'>
  | MediaMessage<'sticker'>
  | LocationMessage
  | ContactMessage
  | TemplateMessage
  | InteractiveMessage
  | ReactionMessage

type MakeMessageRequestBody<T extends MessageContent> = {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
} & T

async function makeMessageRequest<T extends MessageContent>(
  config: MakeMessageRequestConfig,
  body: MakeMessageRequestBody<T>
) {
  const res = await fetch(
    `${CLOUD_API_URL}/${config.businessPhoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
  if (!res.ok) {
    let error
    try {
      error = await res.json()
    } catch {
      throw new Error(`Error sending message: ${res.statusText}`)
    }
    throw new Error(`Error sending message: ${error.error.message}`)
  }
}

export { makeMessageRequest }
export type {
  MakeMessageRequestBody,
  MessageContent,
  TextMessage,
  MediaMessage,
  LocationMessage,
  ContactMessage,
  TemplateMessage,
  InteractiveMessage,
  ReactionMessage
}
