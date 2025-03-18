'use server'

import { getTwitterPostsByOrganizationId } from '@/services/actions/management-tool/channels/twitter/getTwitterPostsByOrganizationId'
import { TwitterApi } from 'twitter-api-v2'
import { isOrganizerAdmin } from '../auth/lucia'
import { PrismaClient } from '@prisma/client'
import { refreshAccessToken } from './refreshTwitterToken'

const prisma = new PrismaClient()

export default async function getTwitterAnalytics(
  accountId: string,
  organizationId: string,
  userId: string
) {
  const isAllowed = await isOrganizerAdmin(organizationId, userId)
  if (!isAllowed) {
    throw new Error('Unauthorized: You don´t have permission.')
  }

  const twitterAccount = await prisma.twitterAccount.findFirst({
    where: { organizationId }
  })

  if (!twitterAccount) {
    console.error('Twitter account not found for this organization.')
    return null
  }

  let accessToken = twitterAccount.accessToken

  if (twitterAccount.expiresAt && twitterAccount.expiresAt.getTime() <= Date.now()) {
    const newAccessToken = await refreshAccessToken(twitterAccount)
    if (!newAccessToken) {
      console.error(`The access token could not be refreshed for ${twitterAccount.accountUsername}`)
      return null
    }
    accessToken = newAccessToken
  }

  try {
    const posts = await getTwitterPostsByOrganizationId(organizationId, userId)
    const twitterClient = new TwitterApi(accessToken)
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

    return analytics
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching user tweets:', error.message)
    } else {
      console.log('Error fetching user tweets:', error)
    }
    return null
  }
}
