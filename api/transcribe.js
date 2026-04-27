export const config = {
  api: { bodyParser: false }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Leer el body raw (audio binario)
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)

    // Obtener el content-type del audio enviado
    const contentType = req.headers['content-type'] || 'audio/webm'

    // Crear FormData para enviar a Groq Whisper
    const { FormData, Blob } = await import('node-fetch').catch(() => globalThis)

    const formData = new FormData()
    const audioBlob = new Blob([buffer], { type: contentType })
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-large-v3')
    formData.append('language', 'es')
    formData.append('response_format', 'json')

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_ANTHROPIC_KEY}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Groq Whisper error:', data)
      return res.status(500).json({ error: data.error?.message || 'Error al transcribir' })
    }

    return res.status(200).json({ text: data.text })

  } catch (error) {
    console.error('Transcribe error:', error)
    return res.status(500).json({ error: error.message })
  }
}
