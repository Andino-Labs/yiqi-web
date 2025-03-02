'use server'

import { getTwitterPostsByUserId } from '@/services/actions/management-tool/channels/twitter/getTwitterPostsByUserId'
import { TwitterApi } from 'twitter-api-v2'

const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN

export default async function getTwitterAnalytics(accountId: string) {
  try {
    const posts = await getTwitterPostsByUserId(accountId)
    const twitterClient = new TwitterApi(X_BEARER_TOKEN!)
    const userTweets = await twitterClient.v2.userTimeline(accountId, {
      'tweet.fields': 'public_metrics'
    })
    const tweets = userTweets.data?.data || []
    const validPostIds = new Set(posts.map(post => post.postTwitterId))
    const filteredTweets = tweets.filter(tweet => validPostIds.has(tweet.id))
    const analytics = filteredTweets.reduce(
      (acc, tweet) => {
        if (tweet.public_metrics) {
          acc.comments += tweet.public_metrics.reply_count || 0
          acc.likes += tweet.public_metrics.like_count || 0
          acc.shares += tweet.public_metrics.retweet_count || 0
          acc.impressions += tweet.public_metrics.impression_count || 0
        }
        return acc
      },
      { comments: 0, likes: 0, shares: 0, impressions: 0 }
    )

    console.log('User tweets:', analytics)

    return analytics
  } catch (error) {
    console.log('Error fetching user tweets:', error)
    return null
  }
}
