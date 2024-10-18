import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { revalidateTag } from 'next/cache'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function POST(req: Request) {
  const { fileName, fileType } = await req.json()

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType
  }

  const command = new PutObjectCommand(params)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

  revalidateTag('upload')

  return new Response(JSON.stringify({ presignedUrl: url, publicUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
