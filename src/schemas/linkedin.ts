import { z } from 'zod'

export const LinkedInProfileSchema = z.object({
  id: z.string(),
  firstName: z.object({
    localized: z.record(z.string()),
    preferredLocale: z.object({
      country: z.string(),
      language: z.string()
    })
  }),
  lastName: z.object({
    localized: z.record(z.string()),
    preferredLocale: z.object({
      country: z.string(),
      language: z.string()
    })
  }),
  localizedFirstName: z.string(),
  localizedLastName: z.string(),
  headline: z.object({
    localized: z.record(z.string()),
    preferredLocale: z.object({
      country: z.string(),
      language: z.string()
    })
  }),
  localizedHeadline: z.string(),
  vanityName: z.string().optional(),
  profilePicture: z
    .object({
      displayImage: z.string()
    })
    .optional(),
  positions: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        companyName: z.string(),
        locationName: z.string().optional(),
        description: z.string().optional(),
        timePeriod: z.object({
          startDate: z.object({
            year: z.number(),
            month: z.number().optional()
          }),
          endDate: z
            .object({
              year: z.number(),
              month: z.number().optional()
            })
            .optional(),
          present: z.boolean().optional()
        })
      })
    )
    .optional()
})

export const ShareMediaSchema = z.object({
  description: z
    .object({
      text: z.string().optional()
    })
    .optional(),
  media: z.string(),
  status: z.enum(['PROCESSING', 'READY', 'FAILED']),
  originalUrl: z.string().optional(),
  title: z
    .object({
      text: z.string().optional()
    })
    .optional()
})

const ShareContentSchema = z.object({
  shareCommentary: z.object({
    text: z.string()
  }),
  shareMediaCategory: z.enum([
    'NONE',
    'IMAGE',
    'VIDEO',
    'ARTICLE',
    'RICH',
    'CAROUSEL',
    'DOCUMENT',
    'POLL',
    'EVENT',
    'JOB',
    'QUESTION',
    'ANSWER',
    'TOPIC',
    'NATIVE_DOCUMENT',
    'URN_REFERENCE',
    'LIVE_VIDEO'
  ]),
  media: z.array(ShareMediaSchema).optional()
})

const SpecificContentSchema = z.object({
  'com.linkedin.ugc.ShareContent': ShareContentSchema
})

export const UGCPostSchema = z.object({
  author: z.string(),
  lifecycleState: z.enum([
    'DRAFT',
    'PUBLISHED',
    'PROCESSING',
    'PROCESSING_FAILED',
    'DELETED',
    'PUBLISHED_EDITED',
    'ARCHIVED'
  ]),
  specificContent: SpecificContentSchema,
  visibility: z.object({
    'com.linkedin.ugc.MemberNetworkVisibility': z.enum([
      'PUBLIC',
      'CONNECTIONS',
      'LOGGED_IN',
      'CONTAINER'
    ])
  }),
  created: z.object({
    time: z.number()
  }),
  id: z.string(),
  lastModified: z.object({
    time: z.number()
  })
})

export const UGCPostsResponseSchema = z.object({
  elements: z.array(UGCPostSchema),
  paging: z.object({
    count: z.number(),
    start: z.number(),
    links: z.array(
      z.object({
        rel: z.string(),
        href: z.string(),
        type: z.string().optional()
      })
    )
  })
})

const SocialActionsSchema = z.object({
  likesSummary: z
    .object({
      selectedLikes: z.array(z.string()).optional(),
      aggregatedTotalLikes: z.number().optional(),
      likedByCurrentUser: z.boolean().optional(),
      totalLikes: z.number().optional()
    })
    .optional(),
  commentsSummary: z
    .object({
      selectedComments: z.array(z.string()).optional(),
      totalFirstLevelComments: z.number().optional(),
      commentsState: z
        .enum(['OPEN', 'CLOSED', 'PROCESSING', 'DELETED'])
        .optional(),
      aggregatedTotalComments: z.number().optional()
    })
    .optional(),
  target: z.string().optional()
})

export const SocialActionsResponseSchema = z.object({
  elements: z.array(SocialActionsSchema),
  paging: z
    .object({
      count: z.number(),
      start: z.number(),
      links: z
        .array(
          z.object({
            rel: z.string(),
            href: z.string(),
            type: z.string().optional()
          })
        )
        .optional()
    })
    .optional()
})

export type SocialActionsResponse = z.infer<typeof SocialActionsResponseSchema>

export type UGCPostsResponse = z.infer<typeof UGCPostsResponseSchema>

export type LinkedInProfileType = z.infer<typeof LinkedInProfileSchema>
