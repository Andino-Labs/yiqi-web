import { PrismaClient } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2'

const prisma = new PrismaClient()

export async function publishScheduledPosts() {
  const now = new Date()

  const scheduledPosts = await prisma.twitterAccount.findMany({
    include: { posts: true },
    where: {
      posts: {
        some: {
          status: 'SCHEDULED',
          scheduledDate: {
            lte: now
          }
        }
      }
    }
  })

  if (scheduledPosts.length === 0) {
    return
  }

  for (const twitterAccount of scheduledPosts) {
    for (const post of twitterAccount.posts) {
      try {
        if (post.status === 'PUBLISHED') {
          console.log(`The post ${post.id} has already been published.`)
          continue
        }

        const twitterClient = new TwitterApi({
          appKey: process.env.NEXT_PUBLIC_X_API_KEY!,
          appSecret: process.env.NEXT_PUBLIC_X_API_SECRET!,
          accessToken: twitterAccount.accessToken,
          accessSecret: twitterAccount.accessTokenSecret
        })

        const tweetResponse = await twitterClient.v2.tweet(post.content)
        console.log(
          `Post ${post.id} of ${twitterAccount.accountUsername} account published successfully.`
        )

        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: 'PUBLISHED',
            postTwitterId: tweetResponse.data.id
          }
        })
      } catch (error) {
        console.error(
          `Error publishing the post ${post.id} from the account ${twitterAccount.accountUsername}:`,
          error
        )
      }
    }
  }
}
