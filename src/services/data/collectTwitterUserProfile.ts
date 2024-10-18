import axios from 'axios'

export const getTwitterData = async (
  accessToken: string,
  twitterUsername: string
) => {
  const url = `https://api.twitter.com/2/users/by/username/${twitterUsername}?user.fields=description,created_at`
  const tweetsUrl = `https://api.twitter.com/2/users/by/username/${twitterUsername}/tweets`

  try {
    const profileResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const tweetsResponse = await axios.get(tweetsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const profileData = profileResponse.data
    const tweetsData = tweetsResponse.data

    return {
      profile: profileData,
      tweets: tweetsData
    }
  } catch (error) {
    console.error('Error fetching Twitter data:', error)
    throw error
  }
}
