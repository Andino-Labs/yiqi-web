import prisma from './prisma'

export async function acquireLock(jobName: string): Promise<boolean> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 2 * 60 * 1000) // 2 minutes from now

  try {
    await prisma.cronLock.upsert({
      where: { jobName },
      update: {
        lockedAt: now,
        expiresAt
      },
      create: {
        jobName,
        lockedAt: now,
        expiresAt
      }
    })
    return true
  } catch (error) {
    console.error(`Failed to acquire lock for ${jobName}:`, error)
    return false
  }
}

export async function releaseLock(jobName: string): Promise<void> {
  try {
    await prisma.cronLock.delete({
      where: { jobName }
    })
  } catch (error) {
    console.error(`Failed to release lock for ${jobName}:`, error)
  }
}

export async function isLocked(jobName: string): Promise<boolean> {
  const lock = await prisma.cronLock.findUnique({
    where: { jobName }
  })

  if (!lock) return false

  const now = new Date()
  if (lock.expiresAt < now) {
    // Lock has expired, delete it
    await prisma.cronLock.delete({
      where: { jobName }
    })
    return false
  }

  return true
}

export async function tryToGetLock(jobName: string) {
  if (await isLocked(jobName)) {
    throw 'Job is already running'
  }

  if (!(await acquireLock(jobName))) {
    throw 'Failed to acquire lock'
  }
}
