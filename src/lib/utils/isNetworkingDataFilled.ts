import { ProfileWithPrivacy } from '@/schemas/userSchema'

/**
 * Helper function to check if `resumeUrl` is provided and at least one other networking data field is filled.
 * This includes fields like professional motivations, communication style, etc.
 *
 * @param {ProfileWithPrivacy} user - The user object containing networking-related data.
 * @returns {boolean} - Returns `true` if `resumeUrl` is provided and at least one other field is filled, otherwise `false`.
 */
export default function isNetworkingDataFilled(
  user: ProfileWithPrivacy
): boolean {
  const { resumeUrl, ...otherNetworkingData } = {
    professionalMotivations: user.professionalMotivations,
    communicationStyle: user.communicationStyle,
    professionalValues: user.professionalValues,
    careerAspirations: user.careerAspirations,
    significantChallenge: user.significantChallenge,
    resumeUrl: user.resumeUrl
  }

  // Check if `resumeUrl` is filled and at least one other field is non-empty
  const isResumeUrlProvided =
    resumeUrl !== '' && resumeUrl !== null && resumeUrl !== undefined
  const isOtherFieldFilled = Object.values(otherNetworkingData).some(
    value => value !== '' && value !== null && value !== undefined
  )

  return isResumeUrlProvided && isOtherFieldFilled
}
