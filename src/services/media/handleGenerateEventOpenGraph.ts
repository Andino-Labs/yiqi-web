'use server'
import prisma from '@/lib/prisma'
import { GenerateSpeakersEventPoster } from '../media-generator/GenerateSpeakersEventPoster'
import { UploadToS3 } from '@/lib/uploadToS3'
import { GenerateEventOpenGraphJobData } from '@/schemas/mediaJobs'

export async function handleGenerateEventOpenGraph({
  eventId
}: GenerateEventOpenGraphJobData) {
  const event = await prisma.event.findUniqueOrThrow({
    where: { id: eventId }
  })
  const openGraphImage = await GenerateSpeakersEventPoster({
    eventDetails: {
      eventTitle: event.title,
      time: event.startDate.toISOString(),
      date: event.startDate.toISOString(),
      location: event.location!
    },
    backgroundImage: ' event.backgroundImage',
    sponsorLogos: [''],
    speakers: []
  })
  const posterFile = new File(
    [openGraphImage],
    `${event.id}/openGraphImage.png`,
    {
      type: 'image/png'
    }
  )
  const openGraphImageUrl = await UploadToS3(posterFile)
  await prisma.event.update({
    where: { id: eventId },
    data: { openGraphImage: openGraphImageUrl }
  })

  return openGraphImageUrl
}
