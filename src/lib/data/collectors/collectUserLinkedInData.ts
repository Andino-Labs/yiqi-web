'user server'

import { fetchUserProfile } from '@/lib/linkedin/fetchUserProfile'
import { fetchUserPosts } from '@/lib/linkedin/fetchUserPosts'
import { fetchLikedPosts } from '@/lib/linkedin/fetchLikedPosts'

export default async function collectUserLinkedInData(
  linkedinAccessToken: string
) {
  const userLinkedInProfile = await fetchUserProfile(linkedinAccessToken)

  const userPosts = await fetchUserPosts(
    userLinkedInProfile.id,
    linkedinAccessToken
  )

  const userLikedPosts = await fetchLikedPosts(linkedinAccessToken)

  return {
    userLinkedInProfile,
    userPosts,
    userLikedPosts
  }
}
