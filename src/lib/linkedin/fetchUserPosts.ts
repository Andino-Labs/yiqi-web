import { UGCPostsResponseSchema } from '@/schemas/linkedin'
import { RestliClient } from 'linkedin-api-client'

export async function fetchUserPosts(userUrn: string, accessToken: string) {
  const restliClient = new RestliClient()

  try {
    const response = await restliClient.get({
      resourcePath: '/ugcPosts',
      queryParams: {
        q: 'authors',
        authors: `List(${userUrn})`,
        count: 100
      },
      accessToken
    })

    return UGCPostsResponseSchema.parse(response.data)
  } catch (error: unknown) {
    console.error('Error fetching user posts:', error)
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
