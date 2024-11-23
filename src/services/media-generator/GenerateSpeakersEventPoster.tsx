export async function GenerateSpeakersEventPoster() {
  return null
}

// import { createCanvas, loadImage } from 'canvas'

// interface Speaker {
//   name: string
//   title: string
//   company: string
//   image: string
// }

// interface EventDetails {
//   date: string
//   time: string
//   location: string
//   eventTitle: string // Add the event title as a property
// }

// interface GeneratePosterProps {
//   speakers: Speaker[]
//   eventDetails: EventDetails
//   backgroundImage: string
//   sponsorLogos: string[]
// }

// export async function GenerateSpeakersEventPoster({
//   speakers,
//   eventDetails,
//   backgroundImage,
//   sponsorLogos
// }: GeneratePosterProps) {
//   // Define canvas dimensions
//   const width = 1200
//   const height = 1600
//   const canvas = createCanvas(width, height)
//   const ctx = canvas.getContext('2d')

//   // Load background image
//   const background = await loadImage(backgroundImage)
//   ctx.drawImage(background, 0, 0, width, height)

//   // Set general font and color styles
//   ctx.font = 'bold 50px Arial'
//   ctx.fillStyle = '#FFFFFF'
//   ctx.textAlign = 'center'

//   // Event title (custom input)
//   ctx.fillText(eventDetails.eventTitle.toUpperCase(), width / 2, 100)

//   // Draw event details (Date, time, location)
//   ctx.font = 'bold 40px Arial'
//   ctx.fillStyle = '#00FF00'
//   ctx.fillText(`Fecha: ${eventDetails.date}`, width / 2, 200)
//   ctx.fillText(`Hora: ${eventDetails.time}`, width / 2, 260)
//   ctx.fillText(`Ubicación: ${eventDetails.location}`, width / 2, 320)

//   // Dynamically calculate speaker positions
//   const maxPerRow = speakers.length <= 3 ? speakers.length : 3 // Max 3 per row
//   const speakerWidth = 250
//   const speakerHeight = 300
//   const rowGap = 450 // Vertical spacing between rows
//   const xOffset = (width - speakerWidth * maxPerRow - 50 * (maxPerRow - 1)) / 2 // Centering speakers

//   let xPos = xOffset
//   let yPos = 400

//   for (let i = 0; i < speakers.length; i++) {
//     const speaker = speakers[i]
//     const speakerImage = await loadImage(speaker.image)
//     ctx.drawImage(speakerImage, xPos, yPos, speakerWidth, speakerHeight)

//     // Speaker name and title
//     ctx.font = 'bold 30px Arial'
//     ctx.fillStyle = '#FFFFFF'
//     ctx.fillText(
//       speaker.name,
//       xPos + speakerWidth / 2,
//       yPos + speakerHeight + 40
//     )

//     ctx.font = 'italic 25px Arial'
//     ctx.fillText(
//       speaker.title,
//       xPos + speakerWidth / 2,
//       yPos + speakerHeight + 80
//     )
//     ctx.fillText(
//       speaker.company,
//       xPos + speakerWidth / 2,
//       yPos + speakerHeight + 120
//     )

//     xPos += speakerWidth + 50 // Move x position for next speaker

//     // Move to next row if maxPerRow is reached
//     if ((i + 1) % maxPerRow === 0) {
//       xPos = xOffset // Reset x position for next row
//       yPos += rowGap // Move y position for next row
//     }
//   }

//   // Draw sponsor logos at the bottom
//   let logoXPos = 100
//   const logoYPos = height - 200
//   const logoWidth = 200
//   const logoHeight = 100

//   for (const logo of sponsorLogos) {
//     const sponsorLogo = await loadImage(logo)
//     ctx.drawImage(sponsorLogo, logoXPos, logoYPos, logoWidth, logoHeight)
//     logoXPos += logoWidth + 50
//   }

//   // Save the image to a buffer
//   return canvas.toBuffer('image/png')

//   console.log('Poster image uploaded to S3')
// }

// // Example usage
// // GenerateSpeakersEventPoster({
// //   speakers: [
// //     {
// //       name: "Sebastian Burgos",
// //       title: "CTO - Cofundador",
// //       company: "Preauth",
// //       image: "path/to/sebastian.jpg",
// //     },
// //     {
// //       name: "Antonella Puntriano",
// //       title: "CEO - Cofundadora",
// //       company: "Softlandero",
// //       image: "path/to/antonella.jpg",
// //     },
// //     {
// //       name: "José Zarate",
// //       title: "CTO - Cofundador",
// //       company: "Stamping.io",
// //       image: "path/to/jose.jpg",
// //     },
// //     {
// //       name: "Abner Ballardo",
// //       title: "CTO de OKA",
// //       company: "OKA",
// //       image: "path/to/abner.jpg",
// //     },
// //   ],
// //   eventDetails: {
// //     date: "27 Septiembre",
// //     time: "7:00 PM",
// //     location: "Ubicación Secreta",
// //     eventTitle: "Innovation Night", // Custom input title
// //   },
// //   backgroundImage: "path/to/background.jpg",
// //   sponsorLogos: ["path/to/sponsor1.png", "path/to/sponsor2.png"],
// // });
