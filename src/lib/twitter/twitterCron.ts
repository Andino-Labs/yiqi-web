import cron from 'node-cron'
import { publishScheduledPosts } from './publishScheduledPosts.js'

export const startCronJob = async () => {
  cron.schedule('* * * * *', async () => {
    console.log('Cron job executed successfully.')
    try {
      await publishScheduledPosts()
      console.log('Task completed successfully.')
    } catch (error) {
      console.error('Error executing scheduled task:', error)
    }
  })
}

startCronJob()
