'use server'
import { Preference } from 'mercadopago'
import { revalidatePath } from 'next/cache'
import { MPclient } from '@/lib/payments/mercadopago/mercadopago'
import { randomUUID } from 'crypto'

type payment = {
  amount: number
  unitPrice: number
  title: string
}

export async function NewPayment(props: payment) {
  try {
    const preference = await new Preference(MPclient).create({
      body: {
        items: [
          {
            id: randomUUID(),
            title: props.title,
            quantity: props.amount,
            unit_price: props.unitPrice
          }
        ]
      }
    })

    console.log('Preference created:', preference.init_point)

    return preference.init_point || null
  } catch (error) {
    console.error('Error creating payment preference:', error)
    throw new Error('Failed to create the payment preference')
  } finally {
    revalidatePath('/', 'layout')
  }
}
