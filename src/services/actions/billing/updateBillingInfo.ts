'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'

const bankAccountSchema = z.object({
  accountName: z.string().min(2, 'Account name must be at least 2 characters'),
  accountNumber: z.string().min(10, 'Please enter a valid CCI number'),
  country: z.string().min(2, 'Please select a country')
})

export type BillingInfo = z.infer<typeof bankAccountSchema>

export async function updateBillingInfo(
  organizationId: string,
  billingInfo: BillingInfo
) {
  try {
    const validatedInfo = bankAccountSchema.parse(billingInfo)

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        billingInfo: validatedInfo
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating billing info:', error)
    return { success: false, error: 'Failed to update billing information' }
  }
}
