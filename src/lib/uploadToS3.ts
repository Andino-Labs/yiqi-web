export async function UploadToS3(file: File): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type
    })
  })

  const { presignedUrl, publicUrl } = await res.json()

  await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  })

  return publicUrl
}

export async function UploadManyToS3(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async file => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type
        })
      })

      const { presignedUrl, publicUrl } = await res.json()

      await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      })

      return publicUrl
    } catch (error) {
      console.error(`Failed to upload file: ${file.name}`, error)
      return null
    }
  })

  const publicUrls = await Promise.all(uploadPromises)

  return publicUrls.filter(url => url !== null)
}
