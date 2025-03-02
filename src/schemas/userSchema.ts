import { z } from 'zod'

// inputs and output must always be zod based so that we can export
// Todo: Update this shema , delete userSchema
//  role: 'USER' | 'ADMIN' | 'ANDINO_ADMIN' | 'NEW_USER';
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.date().nullable().optional(),
  picture: z.string().nullable(),
  phoneNumber: z.string().nullable().optional()
})

export const userDataCollectedShema = z.object({
  company: z.string().optional().nullish(),
  position: z.string().optional().nullish(),
  shortDescription: z.string().optional().nullish(),
  linkedin: z
    .string()
    .url('Invalid URL for LinkedIn')
    .optional()
    .nullish()
    .or(z.literal('')),
  x: z.string().url('Invalid URL for X').optional().nullish().or(z.literal('')),
  instagram: z
    .string()
    .url('Invalid URL for Instagram')
    .optional()
    .nullish()
    .or(z.literal('')),
  website: z
    .string()
    .url('Invalid URL for Website')
    .optional()
    .nullish()
    .or(z.literal('')),
  professionalMotivations: z.string().optional().nullish(),
  communicationStyle: z.string().optional().nullish(),
  professionalValues: z.string().optional().nullish(),
  careerAspirations: z.string().optional().nullish(),
  significantChallenge: z.string().optional().nullish(),
  resumeFileName: z.string().optional().nullish(),
  resumeUrl: z.string().optional().nullish(),
  resumeText: z.string().optional().nullish(),
  resumeLastUpdated: z.string().optional().nullish()
})

export const privacySettingsSchema = z
  .object({
    email: z.boolean().default(false),
    phoneNumber: z.boolean().default(false),
    linkedin: z.boolean().default(true),
    x: z.boolean().default(true),
    website: z.boolean().default(true)
  })
  .default({
    email: true,
    phoneNumber: true,
    linkedin: true,
    x: true,
    website: true
  })

export type UserType = z.infer<typeof userSchema>
export const baseProfileSchema = userDataCollectedShema.extend({
  name: z.string().min(4, 'Name must be at least 4 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  stopCommunication: z.boolean().default(false)
})
export const profileFormSchema = baseProfileSchema.extend({
  picture: z.any()
})
export const profileDataSchema = baseProfileSchema.extend({
  picture: z.string(),
  id: z.string(),
  role: z.string()
})
export const profileWithPrivacySchema = baseProfileSchema.extend({
  id: z.string(),
  picture: z.string().optional().nullable(),
  privacySettings: privacySettingsSchema,
  linkedinAccessToken: z.string().optional().nullable(),
  isLinkedinLinked: z.boolean().default(false),
  role: z.string(),
  userDetailedProfile: z.string().optional().nullable(),
  userContentPreferences: z.string().optional().nullable()
})
export const createOrgContactSchema = profileWithPrivacySchema.extend({
  id: z.string().optional().nullish()
})

export const luciaUserSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'ANDINO_ADMIN', 'NEW_USER']),
  id: z.string(),
  name: z.string(),
  email: z.string(),
  picture: z.string().nullable(),
  dataCollected: userDataCollectedShema,
  userContentPreferences: z.string().nullable(),
  userDetailedProfile: z.string().nullable(),
  userEmbeddableProfile: z.string().nullable()
})

export type LuciaUserType = z.infer<typeof luciaUserSchema>
export type UserDataCollected = z.infer<typeof userDataCollectedShema>
export type ProfileDataValues = z.infer<typeof profileDataSchema>
export type ProfileFormValues = z.infer<typeof profileFormSchema>
export type ProfileWithPrivacy = z.infer<typeof profileWithPrivacySchema>
export type PrivacySettings = z.infer<typeof privacySettingsSchema>
export type CreateOrgContactType = z.infer<typeof createOrgContactSchema>
