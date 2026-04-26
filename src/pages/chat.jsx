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
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: newMessages
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Lo siento, hubo un error. Intenta de nuevo.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hubo un error de conexión. Intenta de nuevo.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'white', padding: '52px 24px 16px',
        borderBottom: '1px solid #eee', display: 'flex',
        alignItems: 'center', gap: 12
      }}>
        <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
        }}>🌿</div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15 }}>SerenIA</p>
          <p style={{ fontSize: 11, color: '#3d7a5e' }}>● En línea</p>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12, alignItems: 'flex-end', gap: 8
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0
              }}>🌿</div>
            )}
            <div style={{
              maxWidth: '75%',
              background: m.role === 'user' ? '#3d7a5e' : 'white',
              color: m.role === 'user' ? 'white' : '#1a1a1a',
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              fontSize: 14, lineHeight: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
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
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>🌿</div>
            <div style={{
              background: 'white', padding: '12px 16px', borderRadius: '20px 20px 20px 4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontSize: 20
            }}>•••</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'white', padding: '12px 16px 28px',
        borderTop: '1px solid #eee', display: 'flex', gap: 10
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe cómo te sientes..."
          style={{
            flex: 1, border: '1.5px solid #e5e7eb', borderRadius: 50,
            padding: '12px 18px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
            outline: 'none', background: '#f9f9f9'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            width: 46, height: 46, borderRadius: '50%',
            background: input.trim() ? '#3d7a5e' : '#ccc',
            border: 'none', color: 'white', fontSize: 18,
            cursor: input.trim() ? 'pointer' : 'default',
            transition: 'background 0.2s', flexShrink: 0
          }}
        >↑</button>
      </div>
    </div>
  )
            }
