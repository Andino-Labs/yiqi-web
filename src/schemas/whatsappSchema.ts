import { z } from 'zod'

// Common schemas
const MetadataSchema = z.object({
  display_phone_number: z.string(),
  phone_number_id: z.string()
})

const ContactSchema = z.object({
  profile: z.object({
    name: z.string()
  }),
  wa_id: z.string()
})

// Message schemas
const TextMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  text: z.object({
    body: z.string()
  }),
  type: z.literal('text')
})

const ReactionMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  reaction: z.object({
    message_id: z.string(),
    emoji: z.string()
  }),
  type: z.literal('reaction')
})

const MediaMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.union([
    z.literal('image'),
    z.literal('video'),
    z.literal('audio'),
    z.literal('document')
  ]),
  image: z
    .object({
      caption: z.string().optional(),
      mime_type: z.string(),
      sha256: z.string(),
      id: z.string()
    })
    .optional(),
  video: z
    .object({
      caption: z.string().optional(),
      mime_type: z.string(),
      sha256: z.string(),
      id: z.string()
    })
    .optional(),
  audio: z
    .object({
      mime_type: z.string(),
      sha256: z.string(),
      id: z.string(),
      voice: z.boolean().optional()
    })
    .optional(),
  document: z
    .object({
      caption: z.string().optional(),
      filename: z.string(),
      mime_type: z.string(),
      sha256: z.string(),
      id: z.string()
    })
    .optional()
})

const LocationMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().optional(),
    address: z.string().optional()
  }),
  type: z.literal('location')
})

const ButtonReplyMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('button'),
  button: z.object({
    text: z.string(),
    payload: z.string()
  })
})

const ListReplyMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('interactive'),
  interactive: z.object({
    type: z.literal('list_reply'),
    list_reply: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional()
    })
  })
})

// Status schemas
const MessageStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['sent', 'delivered', 'read', 'failed']),
  timestamp: z.string(),
  recipient_id: z.string(),
  conversation: z
    .object({
      id: z.string(),
      expiration_timestamp: z.string().optional(),
      origin: z.object({
        type: z.string()
      })
    })
    .optional(),
  pricing: z
    .object({
      billable: z.boolean(),
      pricing_model: z.string(),
      category: z.string()
    })
    .optional()
})

// Create a specific schema for text messages
export const TextMessagePayloadSchema = z.object({
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          value: z.object({
            messaging_product: z.literal('whatsapp'),
            metadata: MetadataSchema,
            contacts: z.array(ContactSchema),
            messages: z.array(
              z.object({
                from: z.string(),
                id: z.string(),
                timestamp: z.string(),
                text: z.object({
                  body: z.string()
                }),
                type: z.literal('text')
              })
            )
          }),
          field: z.literal('messages')
        })
      )
    })
  )
})

// Update the main webhook schema to be more flexible
export const WhatsAppWebhookSchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          value: z.object({
            messaging_product: z.literal('whatsapp'),
            metadata: MetadataSchema,
            contacts: z.array(ContactSchema).optional(),
            messages: z
              .array(
                z.union([
                  TextMessageSchema,
                  ReactionMessageSchema,
                  MediaMessageSchema,
                  LocationMessageSchema,
                  ButtonReplyMessageSchema,
                  ListReplyMessageSchema
                ])
              )
              .optional(),
            statuses: z.array(MessageStatusSchema).optional()
          }),
          field: z.literal('messages')
        })
      )
    })
  )
})

export type WhatsAppWebhookPayload = z.infer<typeof WhatsAppWebhookSchema>
export type TextMessagePayload = z.infer<typeof TextMessagePayloadSchema>
