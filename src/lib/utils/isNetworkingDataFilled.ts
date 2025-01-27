import { ProfileWithPrivacy } from '@/schemas/userSchema'

/**
 * Helper function to check if any of the Networking data fields are filled.
 * This includes fields like professional motivations, communication style, etc.
 * It returns `true` if at least one field contains data, and `false` otherwise.
 *
 * @param {ProfileWithPrivacy} user - The user object containing networking-related data.
 * @returns {boolean} - Returns `true` if any networking field is filled, otherwise `false`.
 */
export default function isNetworkingDataFilled(user: ProfileWithPrivacy) {
  // Create an object with the relevant networking data fields
  const networkingData = {
    professionalMotivations: user.professionalMotivations,
    communicationStyle: user.communicationStyle,
    professionalValues: user.professionalValues,
    careerAspirations: user.careerAspirations,
    significantChallenge: user.significantChallenge,
    resumeUrl: user.resumeUrl
  }

  // Check if at least one field is filled (non-empty, non-null, non-undefined)
  return Object.values(networkingData).some(
    value => value !== '' && value !== null && value !== undefined
  )
}
