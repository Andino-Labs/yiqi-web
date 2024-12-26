import prisma from '@/lib/prisma'
import { userDataCollectedShema, UserDataCollected } from '@/schemas/userSchema'
import { extractTextFromFile } from '@/lib/data/parser/extractTextFromFile'

export async function updateNetworkingProfile(
  userId: string,
  formData: UserDataCollected
) {
  try {
    // Get existing user data
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { dataCollected: true }
    })

    const existingData = userDataCollectedShema.parse(
      existingUser?.dataCollected || {}
    )

    // Get the new resume URL and last updated timestamp
    const resumeUrl = formData.resumeUrl as string | null
    const resumeLastUpdated = formData.resumeLastUpdated as string | null

    // Check if we need to extract new text
    let resumeText = existingData.resumeText
    if (
      resumeUrl &&
      resumeLastUpdated &&
      resumeLastUpdated !== existingData.resumeLastUpdated
    ) {
      try {
        const response = await fetch(resumeUrl)
        const fileBlob = await response.blob()
        const file = new File([fileBlob], 'resume', { type: fileBlob.type })
        resumeText = await extractTextFromFile(file)
        console.log(resumeText)
      } catch (error) {
        console.error('Error extracting text:', error)
        // Continue with existing text if extraction fails
      }
    }

    // Prepare new data
    const newData = {
      professionalMotivations: formData.professionalMotivations,
      communicationStyle: formData.communicationStyle,
      professionalValues: formData.professionalValues,
      careerAspirations: formData.careerAspirations,
      significantChallenge: formData.significantChallenge,
      resumeUrl,
      resumeText,
      resumeLastUpdated
    }

    // Merge with existing data
    const mergedData = {
      ...(existingData as Record<string, unknown>),
      ...newData
    }

    const validatedData = userDataCollectedShema.parse(mergedData)

    await prisma.user.update({
      where: { id: userId },
      data: {
        dataCollected: validatedData
      }
    })

    // this triggers the AI profile builder cron job.
    // if u developing locally u will have to trigger it manually by going to the route using browser.
    await prisma.queueJob.create({
      data: {
        type: 'COLLECT_USER_DATA',
        data: { userId },
        priority: 1
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error in saveNetworkingProfile:', error)
    return { success: false, error: 'Failed to save networking profile' }
  }
}
