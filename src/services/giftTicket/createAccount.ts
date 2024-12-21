'use server'
import prisma from '@/lib/prisma'

// function to create the user
export async function createNewUser(name: string, email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          name,
          email
        }
      })

      return newUser
    }
  } catch (error) {
    throw new Error(`${error}`)
  } finally {
    await prisma.$disconnect()
  }
}
