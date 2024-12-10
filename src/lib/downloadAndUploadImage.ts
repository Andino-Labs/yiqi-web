import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function downloadAndUploadImage(
  imageUrl?: string | null
): Promise<string | null> {
  if (!imageUrl) return null
  try {
    // Download the image
    const response = await fetch(imageUrl)
    if (!response.ok) throw new Error('Failed to fetch image')

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Generate unique filename
    const fileExtension = contentType.split('/')[1]
    const randomString = crypto.randomBytes(16).toString('hex')
    const fileName = `profile-pictures/${randomString}.${fileExtension}`

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: Buffer.from(imageBuffer),
      ContentType: contentType
    }

    await s3Client.send(new PutObjectCommand(params))

    // Return the public URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
  } catch (error) {
    console.error('Error processing image:', error)
    throw error
  }
}
