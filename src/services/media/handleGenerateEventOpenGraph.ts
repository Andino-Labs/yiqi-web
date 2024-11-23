'use server'
import { GenerateEventOpenGraphJobData } from '@/schemas/mediaJobs'

export async function handleGenerateEventOpenGraph({
  eventId
}: GenerateEventOpenGraphJobData) {
  console.log('Generating event open graph for event:', eventId)
  // const openGraphImage = await GenerateSpeakersEventPoster({
  //   eventDetails: {
  //     eventTitle: event.title,
  //     time: event.startDate.toISOString(),
  //     date: event.startDate.toISOString(),
  //     location: event.location!
  //   },
  //   backgroundImage: ' event.backgroundImage',
  //   sponsorLogos: [''],
  //   speakers: []
  // })
  // const posterFile = new File(
  //   [openGraphImage],
  //   `${event.id}/openGraphImage.png`,
  //   {
  //     type: 'image/png'
  //   }
  // )
  // const openGraphImageUrl = await UploadToS3(posterFile)
  // await prisma.event.update({
  //   where: { id: eventId },
  //   data: { openGraphImage: openGraphImageUrl }
  // })

  // return openGraphImageUrl
  return ''
}
