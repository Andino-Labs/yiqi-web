import { type NextRequest, NextResponse } from 'next/server'
import {
  TextractClient,
  DetectDocumentTextCommand,
  type DetectDocumentTextCommandInput
} from '@aws-sdk/client-textract'

const textractClient = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
})

export const config = {
  api: { bodyParser: false }
}

const SUPPORTED_MIME_TYPES = ['application/pdf', 'image/tiff', 'image/png']

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { file, fileType } = body

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!SUPPORTED_MIME_TYPES.includes(fileType)) {
      return NextResponse.json(
        {
          error:
            'Unsupported file type. Please upload a PDF, TIFF, or PNG file.'
        },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(file, 'base64')

    const params: DetectDocumentTextCommandInput = {
      Document: {
        Bytes: buffer
      }
    }

    const textractResponse = await textractClient.send(
      new DetectDocumentTextCommand(params)
    )

    const extractedText =
      textractResponse.Blocks?.filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join('\n') ?? ''

    return NextResponse.json({ text: extractedText })
  } catch (error) {
    console.error('Error processing file:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error processing file: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'An unknown error occurred while processing the file' },
      { status: 500 }
    )
  }
}
