// app/api/aws/textract/route.ts
import { NextResponse } from 'next/server'
import {
  TextractClient,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
  type Block,
  type GetDocumentTextDetectionCommandOutput
} from '@aws-sdk/client-textract'

const textractClient = new TextractClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

async function getTextDetectionResult(jobId: string): Promise<string> {
  let text = ''
  let nextToken: string | undefined = undefined
  let status = 'IN_PROGRESS'

  while (status === 'IN_PROGRESS') {
    const response: GetDocumentTextDetectionCommandOutput =
      await textractClient.send(
        new GetDocumentTextDetectionCommand({
          JobId: jobId,
          NextToken: nextToken
        })
      )

    status = response.JobStatus || 'FAILED'
    nextToken = response.NextToken

    if (status === 'SUCCEEDED') {
      text +=
        response.Blocks?.filter((block: Block) => block.BlockType === 'LINE')
          .map(block => block.Text)
          .join('\n') || ''
    }

    if (status === 'IN_PROGRESS') {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  if (status !== 'SUCCEEDED') throw new Error('Textract job failed')
  return text
}

export async function POST(req: Request) {
  const { s3Key } = await req.json()

  try {
    const { JobId } = await textractClient.send(
      new StartDocumentTextDetectionCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Name: s3Key
          }
        }
      })
    )

    if (!JobId) throw new Error('Failed to start Textract job')

    const extractedText = await getTextDetectionResult(JobId)
    return NextResponse.json({ text: extractedText })
  } catch (error) {
    console.error('Textract error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}
