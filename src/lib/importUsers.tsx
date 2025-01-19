'use server'

import prisma from './prisma'
import { parse } from 'csv-parse/sync'
import { z } from 'zod'
import setupInitialEventNotifications from '@/services/notifications/setupInitialNotifications'

type RowType = {
  email: string
  phone: string
  name: string
  [key: string]: string
}

const RowTypeSchema = z
  .object({
    email: z.string().email(),
    phone: z.string().min(1),
    name: z.string().min(1)
  })
  .passthrough()

export default async function importUsers(orgId: string, csvText: string) {
  const BATCH_SIZE = 1000 // Adjust based on your database capabilities
  const rows = parse(csvText, { columns: true })

  const results = []

  // Process in batches
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)

    try {
      // Create batch operation
      await prisma.$transaction(
        async tx => {
          const batchPromises = batch.map(
            async ({ email, phone, name, ...rest }: RowType) => {
              const parsedRow = RowTypeSchema.safeParse({
                email,
                phone,
                name,
                ...rest
              })
              let updated = true

              if (!parsedRow.success) {
                results.push(
                  ...parsedRow.error.errors.map(error => ({
                    success: false,
                    email: email,
                    error: `the field ${error.path.join('.')} ${error.message.toLowerCase()}`
                  }))
                )
                return
              }

              const savedUser = await tx.user.upsert({
                where: { email },
                update: {
                  phoneNumber: phone.includes('+')
                    ? phone
                    : `+51${phone.trim()}`
                },
                create: {
                  email,
                  name: name || email.split('@')[0],
                  phoneNumber: phone.includes('+')
                    ? phone
                    : `+51${phone.trim()}`,
                  dataCollected: {
                    importedData: rest
                  }
                }
              })

              const existingContact = await tx.organizationContact.findFirst({
                where: {
                  organizationId: orgId,
                  userId: savedUser.id
                }
              })

              if (!existingContact) {
                await tx.organizationContact.create({
                  data: {
                    organizationId: orgId,
                    userId: savedUser.id
                  }
                })
                updated = false

                // Setup initial notifications for new users
                await setupInitialEventNotifications({
                  orgId,
                  userId: savedUser.id
                })
              }

              return { ...savedUser, updated }
            }
          )

          const batchResults = await Promise.all(batchPromises)
          results.push(
            ...batchResults
              .filter((row: RowType) => row)
              .map((row: RowType) => ({
                success: row.success ?? true,
                email: row.email,
                updated: row
              }))
          )
        },
        {
          maxWait: 5000, // Adjust based on your database capabilities
          timeout: 10000 // Adjust based on your database capabilities
        }
      )
    } catch (error) {
      // If batch fails, mark all rows in batch as failed
      results.push(
        ...batch.map((row: RowType) => ({
          success: false,
          email: row.email,
          error
        }))
      )
    }
  }

  return {
    total: rows.length,
    successful: results.filter(r => r.success).length,
    created: results.filter(r => !r.updated && r.success).length,
    updated: results.filter(r => r.updated).length,
    failed: results.filter(r => !r.success).length,
    results
  }
}
