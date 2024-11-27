import {
  SocialActionsResponseSchema,
  UGCPostsResponseSchema
} from '@/schemas/linkedin'
import { RestliClient } from 'linkedin-api-client'

export async function fetchLikedPosts(accessToken: string) {
  const restliClient = new RestliClient()

  try {
    const response = await restliClient.get({
      resourcePath: '/socialActions',
      queryParams: {
        q: 'likes',
        count: 100
      },
      accessToken
    })

    const likedPosts = SocialActionsResponseSchema.parse(response.data)

    const likedPostIds = likedPosts.elements.map(element => element.target)

    const postsResponse = await restliClient.get({
      resourcePath: '/ugcPosts',
      queryParams: {
        ids: `List(${likedPostIds.join(',')})`
      },
      accessToken
    })

    return UGCPostsResponseSchema.parse(postsResponse.data)
  } catch (error) {
    console.error('Error fetching liked posts:', error)
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
