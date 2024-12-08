import { Elysia, t } from 'elysia'

type WhatsAppWebhookPayload = {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          text?: {
            body: string
          }
          type: string
          interactive?: {
            type: string
            list_reply?: {
              id: string
              title: string
            }
            button_reply?: {
              id: string
              title: string
            }
          }
          image?: {
            mime_type: string
            sha256: string
            id: string
          }
          audio?: {
            mime_type: string
            sha256: string
            id: string
            voice: boolean
          }
          video?: {
            mime_type: string
            sha256: string
            id: string
          }
          document?: {
            mime_type: string
            sha256: string
            id: string
            filename: string
          }
          location?: {
            latitude: number
            longitude: number
          }
          errors?: Array<{
            code: number
            title: string
          }>
        }>
        statuses?: Array<{
          id: string
          status: string
          timestamp: string
          recipient_id: string
        }>
      }
      field: string
    }>
  }>
}

function handleTextMessage(
  message: NonNullable<
    WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['messages']
  >[number]
): void {
  console.log('Received text message:', message.text?.body)
}

function handleInteractiveMessage(
  message: NonNullable<
    WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['messages']
  >[number]
): void {
  if (message.interactive?.list_reply) {
    console.log('Received list reply:', message.interactive.list_reply)
  } else if (message.interactive?.button_reply) {
    console.log('Received button reply:', message.interactive.button_reply)
  }
}

function handleMediaMessage(
  message: NonNullable<
    WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['messages']
  >[number]
): void {
  if (message.image) {
    console.log('Received image message:', message.image)
  } else if (message.audio) {
    console.log('Received audio message:', message.audio)
  } else if (message.video) {
    console.log('Received video message:', message.video)
  } else if (message.document) {
    console.log('Received document message:', message.document)
  }
}

function handleLocationMessage(
  message: NonNullable<
    WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['messages']
  >[number]
): void {
  console.log('Received location message:', message.location)
}

function handleStatus(
  status: NonNullable<
    WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['statuses']
  >[number]
): void {
  console.log('Received status update:', status)
}

function handleError(
  error: NonNullable<
    NonNullable<
      WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['messages']
    >[number]['errors']
  >[number]
): void {
  console.error('Received error:', error)
}

export const whatsappWebhook = new Elysia().post(
  '/webhook',
  function (request) {
    const payload = request.body as WhatsAppWebhookPayload

    payload.entry.forEach(function (entry) {
      entry.changes.forEach(function (change) {
        if (change.field === 'messages') {
          const value = change.value

          if (value.messages) {
            value.messages.forEach(function (message) {
              switch (message.type) {
                case 'text':
                  handleTextMessage(message)
                  break
                case 'interactive':
                  handleInteractiveMessage(message)
                  break
                case 'image':
                case 'audio':
                case 'video':
                case 'document':
                  handleMediaMessage(message)
                  break
                case 'location':
                  handleLocationMessage(message)
                  break
                default:
                  console.log('Unhandled message type:', message.type)
              }
            })
          }

          if (value.statuses) {
            value.statuses.forEach(handleStatus)
          }

          if (
            value.messages &&
            value.messages.length > 0 &&
            value.messages[0].errors
          ) {
            value.messages[0].errors.forEach(handleError)
          }
        }
      })
    })

    return { success: true }
  },
  {
    body: t.Object({
      object: t.String(),
      entry: t.Array(
        t.Object({
          id: t.String(),
          changes: t.Array(
            t.Object({
              value: t.Object({
                messaging_product: t.String(),
                metadata: t.Object({
                  display_phone_number: t.String(),
                  phone_number_id: t.String()
                }),
                contacts: t.Optional(
                  t.Array(
                    t.Object({
                      profile: t.Object({
                        name: t.String()
                      }),
                      wa_id: t.String()
                    })
                  )
                ),
                messages: t.Optional(
                  t.Array(
                    t.Object({
                      from: t.String(),
                      id: t.String(),
                      timestamp: t.String(),
                      text: t.Optional(
                        t.Object({
                          body: t.String()
                        })
                      ),
                      type: t.String(),
                      interactive: t.Optional(
                        t.Object({
                          type: t.String(),
                          list_reply: t.Optional(
                            t.Object({
                              id: t.String(),
                              title: t.String()
                            })
                          ),
                          button_reply: t.Optional(
                            t.Object({
                              id: t.String(),
                              title: t.String()
                            })
                          )
                        })
                      ),
                      image: t.Optional(
                        t.Object({
                          mime_type: t.String(),
                          sha256: t.String(),
                          id: t.String()
                        })
                      ),
                      audio: t.Optional(
                        t.Object({
                          mime_type: t.String(),
                          sha256: t.String(),
                          id: t.String(),
                          voice: t.Boolean()
                        })
                      ),
                      video: t.Optional(
                        t.Object({
                          mime_type: t.String(),
                          sha256: t.String(),
                          id: t.String()
                        })
                      ),
                      document: t.Optional(
                        t.Object({
                          mime_type: t.String(),
                          sha256: t.String(),
                          id: t.String(),
                          filename: t.String()
                        })
                      ),
                      location: t.Optional(
                        t.Object({
                          latitude: t.Number(),
                          longitude: t.Number()
                        })
                      ),
                      errors: t.Optional(
                        t.Array(
                          t.Object({
                            code: t.Number(),
                            title: t.String()
                          })
                        )
                      )
                    })
                  )
                ),
                statuses: t.Optional(
                  t.Array(
                    t.Object({
                      id: t.String(),
                      status: t.String(),
                      timestamp: t.String(),
                      recipient_id: t.String()
                    })
                  )
                )
              }),
              field: t.String()
            })
          )
        })
      )
    })
  }
)
