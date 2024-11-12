'use server'

import prisma from './prisma'
import { parse } from 'csv-parse/sync'
type RowType = {
  email: string
  phone: string
  name: string
  [key: string]: string
}
export default async function importUsers(orgId: string, csvText: string) {
  const BATCH_SIZE = 1000 // Adjust based on your database capabilities
  const rows = parse(csvText, { columns: true })

  const results = []

  // Process in batches
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)

    try {
      // Create batch operation
      await prisma.$transaction(async tx => {
        const batchPromises = batch.map(
          async ({ email, phone, name, ...rest }: RowType) => {
            const savedUser = await tx.user.upsert({
              where: { email },
              update: {
                phoneNumber: phone.includes('+') ? phone : `+51${phone.trim()}`
              },
              create: {
                email,
                name: name || email.split('@')[0],
                phoneNumber: phone.includes('+') ? phone : `+51${phone.trim()}`,
                dataCollected: {
                  importedData: rest
                }
              }
            })

            return tx.organizationContact.create({
              data: {
                organizationId: orgId,
                userId: savedUser.id
              }
            })
          }
        )

        await Promise.all(batchPromises)
        results.push(
          ...batch.map((row: RowType) => ({ success: true, email: row.email }))
        )
      })
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
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  }
}
