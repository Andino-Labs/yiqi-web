import { PrismaClient } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2'
import { refreshAccessToken } from './refreshTwitterToken'

const prisma = new PrismaClient()

export async function deletePublishedPost(postTwitterId: string) {
  if (!postTwitterId) {
    console.log('No Twitter ID provided.')
    return
  }

  const post = await prisma.post.findFirst({
    where: {
      postTwitterId,
      status: 'PUBLISHED'
    },
    include: {
      account: true
    }
  })

  if (!post || !post.account) {
    console.log('Post not found or no associated Twitter account.')
    return
  }

  let accessToken = post.account.accessToken

  if (
    post.account.expiresAt &&
    post.account.expiresAt.getTime() <= Date.now()
  ) {
    const newAccessToken = await refreshAccessToken(post.account)
    if (!newAccessToken) {
      console.error(
        `The access token could not be refreshed for ${post.account.accountUsername}`
      )
      return
    }
    accessToken = newAccessToken
  }

  try {
    const twitterClient = new TwitterApi(accessToken)

    await twitterClient.v2.deleteTweet(postTwitterId)
    console.log(`Post ${post.id} deleted successfully from Twitter.`)

    await prisma.post.delete({
      where: { id: post.id }
    })
  } catch (error) {
    console.error(`Error deleting post ${post.id}:`, error)
  }
}
