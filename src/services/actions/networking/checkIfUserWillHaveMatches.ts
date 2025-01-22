'use server'

import prisma from '@/lib/prisma'
import { userDataCollectedShema } from '@/schemas/userSchema'

// check if user filled out their profile and networking stuff
// this returns a boolean but also queues the job for the match making to occur.
export const checkIfUserWillHaveMatches = async (registrationId: string) => {
  const registration = await prisma.eventRegistration.findUniqueOrThrow({
    where: { id: registrationId },
    include: { user: true }
  })
  const dataCollected = userDataCollectedShema.parse(
    registration.user.dataCollected
  )

  if (
    !dataCollected.resumeText &&
    !dataCollected.careerAspirations &&
    !dataCollected.communicationStyle &&
    !dataCollected.professionalMotivations &&
    !dataCollected.professionalValues &&
    !dataCollected.significantChallenge
  ) {
    return false
  }

  //   todo trigger the AI match maker by starting a queue job.
  //   in UI must just show a loader saying we are working on it.
  return true
}
