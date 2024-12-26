import prisma from '@/lib/prisma'

export async function deleteUser(userId: string) {
  try {
    // Eliminar todas las sesiones asociadas al usuario
    await prisma.session.deleteMany({
      where: { userId: userId }
    })

    // Eliminar la cuenta del usuario
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
