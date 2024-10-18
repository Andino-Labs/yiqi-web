import axios from 'axios'

export const getLinkedInData = async (accessToken: string) => {
  const profileUrl = 'https://api.linkedin.com/v2/me'
  const postsUrl =
    'https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:YOUR_PERSON_URN'

  try {
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const postsResponse = await axios.get(postsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const profileData = profileResponse.data
    const postsData = postsResponse.data

    return {
      profile: profileData,
      posts: postsData
    }
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error)
    throw error
  }
}
