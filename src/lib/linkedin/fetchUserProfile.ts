import { LinkedInProfileSchema } from '@/schemas/linkedin'
import { RestliClient } from 'linkedin-api-client'

export async function fetchUserProfile(accessToken: string) {
  const restliClient = new RestliClient()

  try {
    const response = await restliClient.get({
      resourcePath: '/me',
      queryParams: {
        projection:
          '(id,firstName,lastName,headline,vanityName,profilePicture,positions)'
      },
      accessToken
    })

    return LinkedInProfileSchema.parse(response.data)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 401
    ) {
      // Handle token expiration
      throw new Error('Access token expired. Please re-authenticate.')
    }
    throw error
  }
}
