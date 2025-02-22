import prisma from '@/lib/prisma'
import { userDataCollectedShema, UserDataCollected } from '@/schemas/userSchema'
import { scheduleUserDataProcessing } from '@/services/actions/networking/scheduleUserDataProcessing'

export async function updateNetworkingProfile(
  userId: string,
  formData: UserDataCollected
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { dataCollected: true }
    })

    const existingData = userDataCollectedShema.parse(
      existingUser?.dataCollected || {}
    )

    const resumeUrl = formData.resumeUrl as string | null
    const resumeLastUpdated = formData.resumeLastUpdated as string | null

    let resumeText = existingData.resumeText
    if (
      resumeUrl &&
      resumeLastUpdated &&
      resumeLastUpdated !== existingData.resumeLastUpdated
    ) {
      try {
        // Extract S3 key from resume URL
        const urlParts = resumeUrl.split('/')
        const s3Key = urlParts.slice(3).join('/') // Adjust index based on your URL structure

        // Call Textract endpoint
        const response = await fetch('/api/aws/textract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ s3Key })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const { text } = await response.json()
        resumeText = text
        console.log('Extracted text:', resumeText)
      } catch (error) {
        console.error('Text extraction failed:', error)
      }
    }

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

    await scheduleUserDataProcessing(userId)

    return { success: true }
  } catch (error) {
    console.error('Error in saveNetworkingProfile:', error)
    return { success: false, error: 'Failed to save networking profile' }
  }
}
