import { PrismaClient } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2'

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

  try {
    const twitterClient = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: post.account.accessToken,
      accessSecret: post.account.accessTokenSecret
    })

    await twitterClient.v2.deleteTweet(postTwitterId)
    console.log(`Post ${post.id} deleted successfully from Twitter.`)

    await prisma.post.delete({
      where: { id: post.id }
    })
  } catch (error) {
    console.error(`Error deleting post ${post.id}:`, error)
  }
}
