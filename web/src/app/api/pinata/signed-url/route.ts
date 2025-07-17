import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

async function getSignedURL() {
  try {
    const response = await fetch('https://api.pinata.cloud/v3/files/generate-upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        name: `upload-${uuidv4()}`,
        keyvalues: {
          company: 'CryptoChange',
        },
        pinataOptions: {
          wrapWithDirectory: false,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get signed URL from Pinata: ${error}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function POST() {
  try {
    const data = await getSignedURL()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
} 