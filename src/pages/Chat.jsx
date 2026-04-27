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

const MENSAJE_INICIAL = { role: 'assistant', content: '¡Hola! Soy SerenIA 🌿 Estoy aquí para escucharte. ¿Cómo te sientes hoy?' }

export default function Chat({ navigate }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('serenia_messages')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return [MENSAJE_INICIAL]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmNew, setConfirmNew] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Persistir mensajes en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('serenia_messages', JSON.stringify(messages))
    } catch (e) {}
  }, [messages])

  // Visual Viewport API — ancla al viewport real cuando abre teclado
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const reposition = () => {
      const el = containerRef.current
      if (!el) return
      el.style.top = `${vv.offsetTop}px`
      el.style.left = `${vv.offsetLeft}px`
      el.style.width = `${vv.width}px`
      el.style.height = `${vv.height}px`
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
    reposition()
    vv.addEventListener('resize', reposition)
    vv.addEventListener('scroll', reposition)
    return () => {
      vv.removeEventListener('resize', reposition)
      vv.removeEventListener('scroll', reposition)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Fix autocomplete readonly trick
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.setAttribute('readonly', 'readonly')
    const t = setTimeout(() => el.removeAttribute('readonly'), 100)
    return () => clearTimeout(t)
  }, [])

  const nuevaConversacion = () => {
    if (confirmNew) {
      setMessages([MENSAJE_INICIAL])
      localStorage.removeItem('serenia_messages')
      setConfirmNew(false)
    } else {
      setConfirmNew(true)
      // Auto-cancelar si no confirma en 3 segundos
      setTimeout(() => setConfirmNew(false), 3000)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    setConfirmNew(false)
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
          model: 'llama-3.3-70b-versatile',
          max_tokens: 300,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newMessages]
        })
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Lo siento, hubo un error.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Intenta de nuevo.' }])
    }
    setLoading(false)
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: `${window.visualViewport?.height || window.innerHeight}px`,
        maxWidth: 430,
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f0',
        zIndex: 200,
        overflow: 'hidden'
      }}
    >
      {/* HEADER */}
      <div style={{
        flexShrink: 0,
        background: 'white',
        padding: '0 16px',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 56
      }}>
        <button onClick={() => navigate('home')} style={{
          background: '#f0f0eb', border: 'none',
          width: 34, height: 34, borderRadius: '50%',
          fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>←</button>

        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0
        }}>🌿</div>

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 15, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.3 }}>SerenIA</p>
          <p style={{ fontSize: 11, color: '#3d7a5e', fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.3 }}>● En línea</p>
        </div>

        {/* Botón nueva conversación */}
        <button
          onClick={nuevaConversacion}
          title="Nueva conversación"
          style={{
            background: confirmNew ? '#fff0f0' : '#f0f0eb',
            border: confirmNew ? '1.5px solid #e07a5f' : '1.5px solid transparent',
            width: 34, height: 34, borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s'
          }}
        >
          {confirmNew ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e07a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Banner de confirmación */}
      {confirmNew && (
        <div style={{
          background: '#fff3f0',
          borderBottom: '1px solid #f5c5b8',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <p style={{ fontSize: 13, color: '#c0392b', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
            ¿Borrar conversación?
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setConfirmNew(false)}
              style={{
                background: 'white', border: '1px solid #ddd',
                borderRadius: 8, padding: '4px 12px',
                fontSize: 12, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >Cancelar</button>
            <button
              onClick={nuevaConversacion}
              style={{
                background: '#e07a5f', border: 'none',
                borderRadius: 8, padding: '4px 12px',
                fontSize: 12, color: 'white', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600
              }}
            >Sí, nueva</button>
          </div>
        </div>
      )}

      {/* MENSAJES */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '16px 14px 8px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 10, alignItems: 'flex-end', gap: 8
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0
              }}>🌿</div>
            )}
            <div style={{
              maxWidth: '75%',
              background: m.role === 'user' ? '#3d7a5e' : 'white',
              color: m.role === 'user' ? 'white' : '#1a1a1a',
              padding: '10px 14px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              fontSize: 14, lineHeight: 1.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
            }}>🌿</div>
            <div style={{
              background: 'white', padding: '12px 16px',
              borderRadius: '18px 18px 18px 4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontSize: 16, letterSpacing: 4, color: '#3d7a5e'
            }}>•••</div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 4 }} />
      </div>

      {/* INPUT */}
      <div style={{
        flexShrink: 0,
        background: 'white',
        padding: '10px 14px',
        borderTop: '1px solid #eee',
        display: 'flex', gap: 8, alignItems: 'center'
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          onFocus={e => {
            if (e.target.hasAttribute('readonly')) e.target.removeAttribute('readonly')
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 350)
          }}
          placeholder="Escribe cómo te sientes..."
          type="search"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck="false"
          name={`serenia-chat-${Date.now()}`}
          style={{
            flex: 1, border: '1.5px solid #e5e7eb', borderRadius: 50,
            padding: '11px 18px', fontSize: 14,
            fontFamily: 'DM Sans, sans-serif', outline: 'none',
            background: '#f5f5f5', WebkitAppearance: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            background: input.trim() && !loading ? '#3d7a5e' : '#d1d5db',
            border: 'none', color: 'white', fontSize: 17,
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            transition: 'background 0.2s', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >↑</button>
      </div>
    </div>
  )
}
