import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'

// Lazy initialization of S3Client to handle missing env vars gracefully
function getS3Client() {
  const region = process.env.REGION
  const accessKeyId = process.env.ACCESS_KEY_ID
  const secretAccessKey = process.env.SECRET_ACCESS_KEY

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are not configured. Please set REGION, ACCESS_KEY_ID, and SECRET_ACCESS_KEY in your environment variables.')
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const bucketName = process.env.S3_BUCKET_NAME
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not configured')
    }

    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const key = `thumbnails/${filename}`

    const s3Client = getS3Client()
    
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Note: ACL 'public-read' may not work if bucket has Block Public Access enabled
      // In that case, use bucket policy instead
      ACL: 'public-read',
    }))

    // Construct S3 URL - works for all regions
    const region = process.env.REGION
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}