import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function POST(req: Request) {
  const { fileName } = await req.json()
  const s3Key = `uploads/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: s3Key,
    ContentType: 'application/pdf'
  })

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600
    })

    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

    return NextResponse.json({
      presignedUrl,
      s3Key,
      publicUrl
    })
  } catch (error) {
    console.error('Presigned URL error:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}
