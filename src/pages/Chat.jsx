import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `Eres SerenIA, un asistente emocional empático y cálido. 
Tu misión es acompañar emocionalmente a adolescentes y jóvenes.
Reglas importantes:
- Responde siempre en español
- Sé breve, cálido y empático (máximo 3 oraciones)
- Nunca hagas diagnósticos médicos
- Si detectas crisis grave, sugiere buscar ayuda profesional
- Usa lenguaje sencillo y respetuoso
- Sugiere ejercicios de respiración cuando sea útil
- No reemplazas a un psicólogo`

export default function Chat({ navigate }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy SerenIA 🌿 Estoy aquí para escucharte. ¿Cómo te sientes hoy?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_ANTHROPIC_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          max_tokens: 300,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages
          ]
        })
      })
      const data = await res.json()
      console.log('Groq response:', JSON.stringify(data))
      const reply = data.choices?.[0]?.message?.content || 'Lo siento, hubo un error.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      console.log('Error:', e.message)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Intenta de nuevo.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f5f5f0',
      zIndex: 200
    }}>

      {/* Header fijo */}
      <div style={{
        background: 'white',
        padding: '52px 20px 14px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
      }}>
        <button
          onClick={() => navigate('home')}
          style={{
            background: '#f5f5f0', border: 'none',
            width: 36, height: 36, borderRadius: '50%',
            fontSize: 18, cursor: 'pointer'
          }}
        >←</button>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20
        }}>🌿</div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'DM Sans, sans-serif' }}>SerenIA</p>
          <p style={{ fontSize: 11, color: '#3d7a5e', fontFamily: 'DM Sans, sans-serif' }}>● En línea</p>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 8px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12,
            alignItems: 'flex-end',
            gap: 8
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 16, flexShrink: 0
              }}>🌿</div>
            )}
            <div style={{
              maxWidth: '75%',
              background: m.role === 'user' ? '#3d7a5e' : 'white',
              color: m.role === 'user' ? 'white' : '#1a1a1a',
              padding: '12px 16px',
              borderRadius: m.role === 'user'
                ? '20px 20px 4px 20px'
                : '20px 20px 20px 4px',
              fontSize: 14,
              lineHeight: 1.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16
            }}>🌿</div>
            <div style={{
              background: 'white', padding: '14px 18px',
              borderRadius: '20px 20px 20px 4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontSize: 18, letterSpacing: 4, color: '#3d7a5e'
            }}>•••</div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* Input */}
      <div style={{
        background: 'white',
        padding: '12px 16px 32px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexShrink: 0
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe cómo te sientes..."
          style={{
            flex: 1,
            border: '1.5px solid #e5e7eb',
            borderRadius: 50,
            padding: '12px 18px',
            fontSize: 14,
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
            background: '#f9f9f9'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            width: 46, height: 46,
            borderRadius: '50%',
            background: input.trim() && !loading ? '#3d7a5e' : '#ccc',
            border: 'none', color: 'white',
            fontSize: 18,
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            transition: 'background 0.2s',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >↑</button>
      </div>
    </div>
  )
}