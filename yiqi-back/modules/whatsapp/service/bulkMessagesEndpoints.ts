import { Elysia, t } from 'elysia'
import { sendBulkMessages, BulkMessageRequest } from './sendBulkMessages'
import {
  MessageContent,
  TextMessage,
  LocationMessage,
  ContactMessage,
  TemplateMessage,
  InteractiveMessage,
  ReactionMessage
} from './messageRequestTemplate'

const configSchema = t.Object({
  businessPhoneNumberId: t.String(),
  accessToken: t.String()
})

const baseMessageSchema = t.Object({
  messaging_product: t.Literal('whatsapp'),
  recipient_type: t.Literal('individual'),
  to: t.String()
})

const bulkMessagesGroup = new Elysia({ prefix: '/send-bulk-messages' })
  .post(
    '/text',
    async ({ body }) => {
      const requests: BulkMessageRequest<TextMessage>[] = body.map(
        (request: any) => ({
          config: request.config,
          messages: request.messages.map((message: any) => ({
            ...baseMessageSchema.parse(message),
            type: 'text',
            text: t
              .Object({
                body: t.String(),
                preview_url: t.Optional(t.Boolean())
              })
              .parse(message.text)
          }))
        })
      )
      await sendBulkMessages(requests)
      return { success: true }
    },
    {
      body: t.Array(
        t.Object({
          config: configSchema,
          messages: t.Array(
            t.Object({
              ...baseMessageSchema.properties,
              text: t.Object({
                body: t.String(),
                preview_url: t.Optional(t.Boolean())
              })
            })
          )
        })
      )
    }
  )

  .post(
    '/media/:mediaType',
    async ({ body, params: { mediaType } }) => {
      const requests: BulkMessageRequest<MessageContent>[] = body.map(
        (request: any) => ({
          config: request.config,
          messages: request.messages.map((message: any) => {
            const baseMessage = baseMessageSchema.parse(message)
            const mediaContent = t
              .Object({
                link: t.String(),
                caption: t.Optional(t.String()),
                filename:
                  mediaType === 'document'
                    ? t.Optional(t.String())
                    : t.Undefined()
              })
              .parse(message[mediaType])

            return {
              ...baseMessage,
              type: mediaType,
              [mediaType]: mediaContent
            } as MessageContent
          })
        })
      )
      await sendBulkMessages(requests)
      return { success: true }
    },
    {
      params: t.Object({
        mediaType: t.Union([
          t.Literal('image'),
          t.Literal('audio'),
          t.Literal('document'),
          t.Literal('video'),
          t.Literal('sticker')
        ])
      }),
      body: t.Array(
        t.Object({
          config: configSchema,
          messages: t.Array(
            t.Object({
              ...baseMessageSchema.properties,
              image: t.Optional(
                t.Object({
                  link: t.String(),
                  caption: t.Optional(t.String())
                })
              ),
              audio: t.Optional(
                t.Object({
                  link: t.String()
                })
              ),
              document: t.Optional(
                t.Object({
                  link: t.String(),
                  caption: t.Optional(t.String()),
                  filename: t.Optional(t.String())
                })
              ),
              video: t.Optional(
                t.Object({
                  link: t.String(),
                  caption: t.Optional(t.String())
                })
              ),
              sticker: t.Optional(
                t.Object({
                  link: t.String()
                })
              )
            })
          )
        })
      )
    }
  )

  .post(
    '/location',
    async ({ body }) => {
      const requests: BulkMessageRequest<LocationMessage>[] = body.map(
        (request: any) => ({
          config: request.config,
          messages: request.messages.map((message: any) => ({
            ...baseMessageSchema.parse(message),
            type: 'location',
            location: t
              .Object({
                latitude: t.Number(),
                longitude: t.Number(),
                name: t.Optional(t.String()),
                address: t.Optional(t.String())
              })
              .parse(message.location)
          }))
        })
      )
      await sendBulkMessages(requests)
      return { success: true }
    },
    {
      body: t.Array(
        t.Object({
          config: configSchema,
          messages: t.Array(
            t.Object({
              ...baseMessageSchema.properties,
              location: t.Object({
                latitude: t.Number(),
                longitude: t.Number(),
                name: t.Optional(t.String()),
                address: t.Optional(t.String())
              })
            })
          )
        })
      )
    }
  )

  .post(
    '/contacts',
    async ({ body }) => {
      const requests: BulkMessageRequest<ContactMessage>[] = body.map(
        (request: any) => ({
          config: request.config,
          messages: request.messages.map((message: any) => ({
            ...baseMessageSchema.parse(message),
            type: 'contacts',
            contacts: t
              .Array(
                t.Object({
                  addresses: t.Optional(
                    t.Array(
                      t.Object({
                        street: t.Optional(t.String()),
                        city: t.Optional(t.String()),
                        state: t.Optional(t.String()),
                        zip: t.Optional(t.String()),
                        country: t.Optional(t.String()),
                        country_code: t.Optional(t.String()),
                        type: t.Optional(
                          t.Union([t.Literal('HOME'), t.Literal('WORK')])
                        )
                      })
                    )
                  ),
                  birthday: t.Optional(t.String()),
                  emails: t.Optional(
                    t.Array(
                      t.Object({
                        email: t.String(),
                        type: t.Optional(
                          t.Union([t.Literal('HOME'), t.Literal('WORK')])
                        )
                      })
                    )
                  ),
                  name: t.Object({
                    first_name: t.String(),
                    last_name: t.Optional(t.String()),
                    middle_name: t.Optional(t.String()),
                    suffix: t.Optional(t.String()),
                    prefix: t.Optional(t.String())
                  }),
                  org: t.Optional(
                    t.Object({
                      company: t.Optional(t.String()),
                      department: t.Optional(t.String()),
                      title: t.Optional(t.String())
                    })
                  ),
                  phones: t.Optional(
                    t.Array(
                      t.Object({
                        phone: t.String(),
                        type: t.Optional(
                          t.Union([
                            t.Literal('CELL'),
                            t.Literal('MAIN'),
                            t.Literal('IPHONE'),
                            t.Literal('HOME'),
                            t.Literal('WORK')
                          ])
                        ),
                        wa_id: t.Optional(t.String())
                      })
                    )
                  ),
                  urls: t.Optional(
                    t.Array(
                      t.Object({
                        url: t.String(),
                        type: t.Optional(
                          t.Union([t.Literal('HOME'), t.Literal('WORK')])
                        )
                      })
                    )
                  )
                })
              )
              .parse(message.contacts)
          }))
        })
      )
      await sendBulkMessages(requests)
      return { success: true }
    },
    {
      body: t.Array(
        t.Object({
          config: configSchema,
          messages: t.Array(
            t.Object({
              ...baseMessageSchema.properties,
              contacts: t.Array(
                t.Object({
                  addresses: t.Optional(
                    t.Array(
                      t.Object({
                        street: t.Optional(t.String()),
                        city: t.Optional(t.String()),
                        state: t.Optional(t.String()),
                        zip: t.Optional(t.String()),
                        country: t.Optional(t.String()),
                        country_code: t.Optional(t.String()),
                        type: t.Optional(
                          t.Union([t.Literal('HOME'), t.Literal('WORK')])
                        )
                      })
                    )
                  ),
                  birthday: t.Optional(t.String()),
                  emails: t.Optional(
                    t.Array(
                      t.Object({
                        email: t.String(),
                        type: t.Optional(
                          t.Union([t.Literal('HOME'), t.Literal('WORK')])
                        )
                      })
                    )
                  ),
                  name: t.Object({
                    first_name: t.String(),
                    last_name: t.Optional(t.String()),
                    middle_name: t.Optional(t.String()),
                    suffix: t.Optional(t.String()),
                    prefix: t.Optional(t.String())
                  }),
                  org: t.Optional(
                    t.Object({
                      company: t.Optional(t.String()),
                      department: t.Optional(t.String()),
                      title: t.Optional(t.String())
                    })
                  ),
                  phones: t.Optional(
                    t.Array(
                      t.Object({
                        phone: t.String(),
                        type: t.Optional(
                          t.Union([
                            t.Literal('CELL'),
                            t.Literal('MAIN'),
                            t.Literal('IPHONE'),
                            t.Literal('HOME'),
                            t.Literal('WORK')
                          ])
                        ),
                        wa_id: t.Optional(t.String())
                      })
                    )
                  ),
                  urls: t.Optional(
                    t.Array(
                      t.Object({
                        url: t.String(),
                        type: t.Optional(
                          t.Union([t.Literal('HOME'), t.Literal('WORK')])
                        )
                      })
                    )
                  )
                })
              )
            })
          )
        })
      )
    }
  )

  .post(
    '/template',
    async ({ body }) => {
      const requests: BulkMessageRequest<TemplateMessage>[] = body.map(
        (request: any) => ({
          config: request.config,
          messages: request.messages.map((message: any) => ({
            ...baseMessageSchema.parse(message),
            type: 'template',
            template: t
              .Object({
                name: t.String(),
                language: t.Object({ code: t.String() }),
                components: t.Optional(
                  t.Array(
                    t.Object({
                      type: t.Union([
                        t.Literal('header'),
                        t.Literal('body'),
                        t.Literal('button')
                      ]),
                      parameters: t.Array(
                        t.Union([
                          t.Object({
                            type: t.Literal('text'),
                            text: t.String()
                          }),
                          t.Object({
                            type: t.Literal('currency'),
                            currency: t.Object({
                              fallback_value: t.String(),
                              code: t.String(),
                              amount_1000: t.Number()
                            })
                          }),
                          t.Object({
                            type: t.Literal('date_time'),
                            date_time: t.Object({
                              fallback_value: t.String(),
                              day_of_week: t.Number(),
                              year: t.Number(),
                              month: t.Number(),
                              day_of_month: t.Number(),
                              hour: t.Number(),
                              minute: t.Number(),
                              calendar: t.String()
                            })
                          }),
                          t.Object({
                            type: t.Literal('image'),
                            image: t.Object({ link: t.String() })
                          }),
                          t.Object({
                            type: t.Literal('document'),
                            document: t.Object({
                              link: t.String(),
                              filename: t.Optional(t.String())
                            })
                          }),
                          t.Object({
                            type: t.Literal('video'),
                            video: t.Object({ link: t.String() })
                          })
                        ])
                      )
                    })
                  )
                )
              })
              .parse(message.template)
          }))
        })
      )
      await sendBulkMessages(requests)
      return { success: true }
    },
    {
      body: t.Array(
        t.Object({
          config: configSchema,
          messages: t.Array(
            t.Object({
              ...baseMessageSchema.properties,
              template: t.Object({
                name: t.String(),
                language: t.Object({ code: t.String() }),
                components: t.Optional(
                  t.Array(
                    t.Object({
                      type: t.Union([
                        t.Literal('header'),
                        t.Literal('body'),
                        t.Literal('button')
                      ]),
                      parameters: t.Array(
                        t.Union([
                          t.Object({
                            type: t.Literal('text'),
                            text: t.String()
                          }),
                          t.Object({
                            type: t.Literal('currency'),
                            currency: t.Object({
                              fallback_value: t.String(),
                              code: t.String(),
                              amount_1000: t.Number()
                            })
                          }),
                          t.Object({
                            type: t.Literal('date_time'),
                            date_time: t.Object({
                              fallback_value: t.String(),
                              day_of_week: t.Number(),
                              year: t.Number(),
                              month: t.Number(),
                              day_of_month: t.Number(),
                              hour: t.Number(),
                              minute: t.Number(),
                              calendar: t.String()
                            })
                          }),
                          t.Object({
                            type: t.Literal('image'),
                            image: t.Object({ link: t.String() })
                          }),
                          t.Object({
                            type: t.Literal('document'),
                            document: t.Object({
                              link: t.String(),
                              filename: t.Optional(t.String())
                            })
                          }),
                          t.Object({
                            type: t.Literal('video'),
                            video: t.Object({ link: t.String() })
                          })
                        ])
                      )
                    })
                  )
                )
              })
            })
          )
        })
      )
    }
  )

  .post(
    '/interactive',
    async ({ body }) => {
      const requests: BulkMessageRequest<InteractiveMessage>[] = body.map(
        (request: any) => ({
          config: request.config,
          messages: request.messages.map((message: any) => ({
            ...baseMessageSchema.parse(message),
            type: 'interactive',
            interactive: t
              .Object({
                type: t.Union([
                  t.Literal('button'),
                  t.Literal('list'),
                  t.Literal('product'),
                  t.Literal('product_list')
                ]),
                header: t.Optional(
                  t.Object({
                    type: t.Union([
                      t.Literal('text'),
                      t.Literal('video'),
                      t.Literal('image'),
                      t.Literal('document')
                    ]),
                    text: t.Optional(t.String()),
                    video: t.Optional(t.Object({ link: t.String() })),
                    image: t.Optional(t.Object({ link: t.String() })),
                    document: t.Optional(
                      t.Object({
                        link: t.String(),
                        filename: t.Optional(t.String())
                      })
                    )
                  })
                ),
                body: t.Object({ text: t.String() }),
                footer: t.Optional(t.Object({ text: t.String() })),
                action: t.Object({
                  button: t.Optional(t.String()),
                  buttons: t.Optional(
                    t.Array(
                      t.Object({
                        type: t.Literal('reply'),
                        reply: t.Object({ id: t.String(), title: t.String() })
                      })
                    )
                  ),
                  sections: t.Optional(
                    t.Array(
                      t.Object({
                        title: t.Optional(t.String()),
                        rows: t.Array(
                          t.Object({
                            id: t.String(),
                            title: t.String(),
                            description: t.Optional(t.String())
                          })
                        )
                      })
                    )
                  ),
                  catalog_id: t.Optional(t.String()),
                  product_retailer_id: t.Optional(t.String())
                })
              })
              .parse(message.interactive)
          }))
        })
      )
      await sendBulkMessages(requests)
      return { success: true }
    },
    {
      body: t.Array(
        t.Object({
          config: configSchema,
          messages: t.Array(
            t.Object({
              ...baseMessageSchema.properties,
              interactive: t.Object({
                type: t.Union([
                  t.Literal('button'),
                  t.Literal('list'),
                  t.Literal('product'),
                  t.Literal('product_list')
                ]),
                header: t.Optional(
                  t.Object({
                    type: t.Union([
                      t.Literal('text'),
                      t.Literal('video'),
                      t.Literal('image'),
                      t.Literal('document')
                    ]),
                    text: t.Optional(t.String()),
                    video: t.Optional(t.Object({ link: t.String() })),
                    image: t.Optional(t.Object({ link: t.String() })),
                    document: t.Optional(
                      t.Object({
                        link: t.String(),
                        filename: t.Optional(t.String())
                      })
                    )
                  })
                ),
                body: t.Object({ text: t.String() }),
                footer: t.Optional(t.Object({ text: t.String() })),
                action: t.Object({
                  button: t.Optional(t.String()),
                  buttons: t.Optional(
                    t.Array(
                      t.Object({
                        type: t.Literal('reply'),
                        reply: t.Object({ id: t.String(), title: t.String() })
                      })
                    )
                  ),
                  sections: t.Optional(
                    t.Array(
                      t.Object({
                        title: t.Optional(t.String()),
                        rows: t.Array(
                          t.Object({
                            id: t.String(),
                            title: t.String(),
                            description: t.Optional(t.String())
                          })
                        )
                      })
                    )
                  ),
                  catalog_id: t.Optional(t.String()),
                  product_retailer_id: t.Optional(t.String())
                })
              })
            })
          )
        })
      )
    }
  )

  .post(
    '/reaction',
    async ({ body }) => {
      const requests: BulkMessageRequest<ReactionMessage>[] = body.map(
        (request: any) => ({
          config: request.config,
          messages: request.messages.map((message: any) => ({
            ...baseMessageSchema.parse(message),
            type: 'reaction',
            reaction: t
              .Object({
                message_id: t.String(),
                emoji: t.String()
              })
              .parse(message.reaction)
          }))
        })
      )
      await sendBulkMessages(requests)
      return { success: true }
    },
    {
      body: t.Array(
        t.Object({
          config: configSchema,
          messages: t.Array(
            t.Object({
              ...baseMessageSchema.properties,
              reaction: t.Object({
                message_id: t.String(),
                emoji: t.String()
              })
            })
          )
        })
      )
    }
  )

export { bulkMessagesGroup }
