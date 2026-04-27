import { useState } from 'react'

const EMOCIONES = [
  { emoji: '😄', label: 'Muy bien',  valor: 5 },
  { emoji: '🙂', label: 'Bien',      valor: 4 },
  { emoji: '😐', label: 'Regular',   valor: 3 },
  { emoji: '😔', label: 'Mal',       valor: 2 },
  { emoji: '😢', label: 'Muy mal',   valor: 1 },
]

const MOTIVOS = [
  { id: 'estres',    emoji: '😤', label: 'Me siento estresado/ansioso' },
  { id: 'entender',  emoji: '🔍', label: 'Quiero entenderme mejor' },
  { id: 'dificil',   emoji: '🌧️', label: 'Estoy pasando por algo difícil' },
  { id: 'explorar',  emoji: '🌱', label: 'Solo quiero explorar' },
]

const FRECUENCIAS = [
  { id: 'diario',    emoji: '📅', label: 'Cada día' },
  { id: 'cada3',     emoji: '🗓️', label: 'Cada 2-3 días' },
  { id: 'necesite',  emoji: '💫', label: 'Cuando lo necesite' },
]

const PRONOMBRES = [
  { id: 'el',    label: 'Él / His' },
  { id: 'ella',  label: 'Ella / Her' },
  { id: 'ellos', label: 'Ellos / Them' },
  { id: 'libre', label: 'Como quieras' },
]

export default function Onboarding({ onComplete }) {
  const [slide, setSlide]       = useState(0)
  const [nombre, setNombre]     = useState('')
  const [edad, setEdad]         = useState('')
  const [pronombre, setPronombre] = useState('')
  const [emocion, setEmocion]   = useState(null)
  const [motivo, setMotivo]     = useState('')
  const [frecuencia, setFrecuencia] = useState('')
  const [acepto, setAcepto]     = useState(false)
  const [saliendo, setSaliendo] = useState(false)

  const total = 7

  const siguiente = () => {
    setSaliendo(true)
    setTimeout(() => {
      setSlide(s => s + 1)
      setSaliendo(false)
    }, 200)
  }

  const terminar = () => {
    // Guardar perfil en localStorage
    const perfil = { nombre, edad, pronombre, motivo, frecuencia }
    localStorage.setItem('serenia_perfil', JSON.stringify(perfil))
    localStorage.setItem('serenia_onboarding', 'done')

    // Guardar emoción inicial como primer registro
    if (emocion) {
      const hoy = new Date().toISOString().split('T')[0]
      const registros = []
      registros.push({ fecha: hoy, valor: emocion, nota: 'Registro inicial del onboarding' })
      localStorage.setItem('serenia_registros', JSON.stringify(registros))
    }

    onComplete(perfil)
  }

  const puedeAvanzar = [
    true,                          // slide 0 — bienvenida
    nombre.trim().length > 0,      // slide 1 — nombre
    pronombre !== '',              // slide 2 — pronombre
    emocion !== null,              // slide 3 — emoción
    motivo !== '',                 // slide 4 — motivo
    frecuencia !== '',             // slide 5 — frecuencia
    acepto,                        // slide 6 — consentimiento
  ][slide]

  const slides = [

    // ── SLIDE 0 — Bienvenida ──────────────────────────────
    <div key={0} style={estilos.slide}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🌿</div>
      <h1 style={estilos.titulo}>SerenIA</h1>
      <p style={estilos.subtitulo}>Tu espacio seguro para<br />expresarte y sentirte mejor</p>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { emoji: '💬', texto: 'Chat empático con IA' },
          { emoji: '📓', texto: 'Registro emocional diario' },
          { emoji: '🧘', texto: 'Ejercicios de bienestar' },
        ].map((item, i) => (
          <div key={i} style={estilos.featureRow}>
            <span style={{ fontSize: 22 }}>{item.emoji}</span>
            <p style={{ fontSize: 14, color: '#374151', fontFamily: 'DM Sans, sans-serif' }}>{item.texto}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── SLIDE 1 — Nombre + Edad ───────────────────────────
    <div key={1} style={estilos.slide}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>👋</div>
      <h2 style={estilos.titulo2}>¿Cómo te llamas?</h2>
      <p style={estilos.subtitulo}>Para personalizar tu experiencia</p>
      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Tu nombre..."
        autoComplete="off"
        type="search"
        name={`serenia-nombre-${Date.now()}`}
        style={estilos.input}
      />
      <p style={{ ...estilos.subtitulo, marginTop: 20 }}>¿Cuántos años tienes?</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        {['12-14', '15-17', '18-20', '21-25', '26+'].map(r => (
          <button key={r} onClick={() => setEdad(r)} style={{
            ...estilos.chip,
            background: edad === r ? '#3d7a5e' : '#f0f0eb',
            color: edad === r ? 'white' : '#374151',
          }}>{r}</button>
        ))}
      </div>
    </div>,

    // ── SLIDE 2 — Pronombre ───────────────────────────────
    <div key={2} style={estilos.slide}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>🏳️‍🌈</div>
      <h2 style={estilos.titulo2}>¿Cómo prefieres<br />que te llame?</h2>
      <p style={estilos.subtitulo}>SerenIA usará esto al hablarte</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, width: '100%' }}>
        {PRONOMBRES.map(p => (
          <button key={p.id} onClick={() => setPronombre(p.id)} style={{
            ...estilos.opcionBtn,
            background: pronombre === p.id ? '#e8f5ee' : 'white',
            border: `2px solid ${pronombre === p.id ? '#3d7a5e' : '#e5e7eb'}`,
            color: pronombre === p.id ? '#3d7a5e' : '#374151',
            fontWeight: pronombre === p.id ? 700 : 400,
          }}>{p.label}</button>
        ))}
      </div>
    </div>,

    // ── SLIDE 3 — Emoción inicial ─────────────────────────
    <div key={3} style={estilos.slide}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>🌡️</div>
      <h2 style={estilos.titulo2}>¿Cómo te has sentido<br />esta semana?</h2>
      <p style={estilos.subtitulo}>Tu primer registro emocional</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 24, width: '100%' }}>
        {EMOCIONES.map(e => (
          <button key={e.valor} onClick={() => setEmocion(e.valor)} style={{
            flex: 1,
            background: emocion === e.valor ? '#e8f5ee' : 'white',
            border: `2px solid ${emocion === e.valor ? '#3d7a5e' : '#e5e7eb'}`,
            borderRadius: 16, padding: '12px 4px',
            cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 6,
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 28 }}>{e.emoji}</span>
            <small style={{ fontSize: 9, color: '#6b7280', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
              {e.label}
            </small>
          </button>
        ))}
      </div>
    </div>,

    // ── SLIDE 4 — Motivo ──────────────────────────────────
    <div key={4} style={estilos.slide}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>🎯</div>
      <h2 style={estilos.titulo2}>¿Qué te trae<br />a SerenIA?</h2>
      <p style={estilos.subtitulo}>Personalizamos tu experiencia</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, width: '100%' }}>
        {MOTIVOS.map(m => (
          <button key={m.id} onClick={() => setMotivo(m.id)} style={{
            ...estilos.opcionBtn,
            background: motivo === m.id ? '#e8f5ee' : 'white',
            border: `2px solid ${motivo === m.id ? '#3d7a5e' : '#e5e7eb'}`,
            color: motivo === m.id ? '#3d7a5e' : '#374151',
            fontWeight: motivo === m.id ? 700 : 400,
            display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start'
          }}>
            <span style={{ fontSize: 20 }}>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>,

    // ── SLIDE 5 — Frecuencia ──────────────────────────────
    <div key={5} style={estilos.slide}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>⏰</div>
      <h2 style={estilos.titulo2}>¿Con qué frecuencia<br />quieres registrar?</h2>
      <p style={estilos.subtitulo}>Puedes cambiarlo después</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, width: '100%' }}>
        {FRECUENCIAS.map(f => (
          <button key={f.id} onClick={() => setFrecuencia(f.id)} style={{
            ...estilos.opcionBtn,
            background: frecuencia === f.id ? '#e8f5ee' : 'white',
            border: `2px solid ${frecuencia === f.id ? '#3d7a5e' : '#e5e7eb'}`,
            color: frecuencia === f.id ? '#3d7a5e' : '#374151',
            fontWeight: frecuencia === f.id ? 700 : 400,
            display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start'
          }}>
            <span style={{ fontSize: 20 }}>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>
    </div>,

    // ── SLIDE 6 — Ético + Consentimiento ──────────────────
    <div key={6} style={estilos.slide}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
      <h2 style={estilos.titulo2}>Antes de comenzar</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, width: '100%' }}>
        {[
          { emoji: '❌', texto: 'No realiza diagnósticos médicos' },
          { emoji: '❌', texto: 'No reemplaza a un psicólogo' },
          { emoji: '✅', texto: 'Es un espacio de acompañamiento' },
          { emoji: '✅', texto: 'Protege tu privacidad' },
          { emoji: '✅', texto: 'Te sugiere ayuda profesional si es necesario' },
        ].map((item, i) => (
          <div key={i} style={{
            background: item.emoji === '✅' ? '#e8f5ee' : '#fff5f5',
            borderRadius: 12, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{ fontSize: 16 }}>{item.emoji}</span>
            <p style={{ fontSize: 13, color: '#374151', fontFamily: 'DM Sans, sans-serif' }}>{item.texto}</p>
          </div>
        ))}
      </div>

      {/* Consentimiento */}
      <button
        onClick={() => setAcepto(a => !a)}
        style={{
          marginTop: 20, width: '100%',
          background: acepto ? '#e8f5ee' : 'white',
          border: `2px solid ${acepto ? '#3d7a5e' : '#e5e7eb'}`,
          borderRadius: 14, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', transition: 'all 0.2s'
        }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: acepto ? '#3d7a5e' : 'white',
          border: `2px solid ${acepto ? '#3d7a5e' : '#d1d5db'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.2s'
        }}>
          {acepto && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
        </div>
        <p style={{
          fontSize: 13, color: '#374151',
          fontFamily: 'DM Sans, sans-serif',
          textAlign: 'left', lineHeight: 1.4
        }}>
          Entiendo que SerenIA es un asistente de apoyo emocional, no un profesional de salud mental.
        </p>
      </button>
    </div>,
  ]

  return (
    <div style={{
      width: '100%', maxWidth: 430,
      height: '100dvh', margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      background: '#f5f5f0', overflow: 'hidden',
      position: 'fixed', top: 0, left: '50%',
      transform: 'translateX(-50%)'
    }}>

      {/* Barra de progreso */}
      <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 4,
              background: i <= slide ? '#3d7a5e' : '#e5e7eb',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>
      </div>

      {/* Contenido del slide */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px 24px 16px',
        opacity: saliendo ? 0 : 1,
        transform: saliendo ? 'translateX(-20px)' : 'translateX(0)',
        transition: 'opacity 0.2s, transform 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {slides[slide]}
      </div>

      {/* Botones de navegación */}
      <div style={{
        flexShrink: 0, padding: '12px 24px 32px',
        display: 'flex', gap: 10, alignItems: 'center'
      }}>
        {slide > 0 && (
          <button onClick={() => setSlide(s => s - 1)} style={{
            background: '#f0f0eb', border: 'none',
            borderRadius: 14, padding: '14px 20px',
            fontSize: 14, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', color: '#6b7280'
          }}>← Atrás</button>
        )}

        <button
          onClick={slide === total - 1 ? terminar : siguiente}
          disabled={!puedeAvanzar}
          style={{
            flex: 1, background: puedeAvanzar ? '#3d7a5e' : '#d1d5db',
            border: 'none', borderRadius: 14, padding: '14px',
            fontSize: 15, fontWeight: 700, color: 'white',
            cursor: puedeAvanzar ? 'pointer' : 'default',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'background 0.2s'
          }}
        >
          {slide === total - 1 ? '🌿 Comenzar' : 'Siguiente →'}
        </button>
      </div>
    </div>
  )
}

// ── Estilos compartidos ──────────────────────────────────────
const estilos = {
  slide: {
    width: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', textAlign: 'center'
  },
  titulo: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: 36, fontWeight: 400,
    color: '#1a1a1a', margin: 0
  },
  titulo2: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: 26, fontWeight: 400,
    color: '#1a1a1a', margin: 0, lineHeight: 1.3
  },
  subtitulo: {
    fontSize: 14, color: '#6b7280',
    fontFamily: 'DM Sans, sans-serif',
    marginTop: 8, lineHeight: 1.5
  },
  input: {
    width: '100%', marginTop: 20,
    border: '1.5px solid #e5e7eb', borderRadius: 14,
    padding: '14px 18px', fontSize: 16,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none', background: 'white',
    WebkitAppearance: 'none', textAlign: 'center'
  },
  chip: {
    border: 'none', borderRadius: 20,
    padding: '8px 16px', fontSize: 13,
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer', fontWeight: 500,
    transition: 'all 0.2s'
  },
  opcionBtn: {
    width: '100%', border: 'none',
    borderRadius: 14, padding: '14px 16px',
    fontSize: 14, cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all 0.2s', textAlign: 'left'
  },
  featureRow: {
    display: 'flex', alignItems: 'center',
    gap: 12, background: 'white',
    borderRadius: 12, padding: '12px 16px',
    width: '100%'
  }
}
