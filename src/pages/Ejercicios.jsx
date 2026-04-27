import { useState, useEffect, useRef } from 'react'

// ── Técnicas de respiración ───────────────────────────────────
const TECNICAS = [
  {
    id: '478',
    nombre: '4-7-8',
    emoji: '🫁',
    descripcion: 'Calma el sistema nervioso. Ideal para dormir o bajar ansiedad.',
    color: '#3d7a5e',
    bg: '#e8f5ee',
    fases: [
      { label: 'Inhala', duracion: 4, escala: 1.4 },
      { label: 'Sostén',  duracion: 7, escala: 1.4 },
      { label: 'Exhala', duracion: 8, escala: 0.7 },
    ],
    ciclos: 4,
  },
  {
    id: 'box',
    nombre: 'Box Breathing',
    emoji: '⬛',
    descripcion: 'Usada por atletas y militares. Reduce estrés y mejora el foco.',
    color: '#5b4fcf',
    bg: '#eeecff',
    fases: [
      { label: 'Inhala', duracion: 4, escala: 1.4 },
      { label: 'Sostén',  duracion: 4, escala: 1.4 },
      { label: 'Exhala', duracion: 4, escala: 0.7 },
      { label: 'Sostén',  duracion: 4, escala: 0.7 },
    ],
    ciclos: 4,
  },
  {
    id: '444',
    nombre: '4-4-4',
    emoji: '🌊',
    descripcion: 'Respiración rítmica. Perfecta para momentos de pánico.',
    color: '#0891b2',
    bg: '#e0f7fa',
    fases: [
      { label: 'Inhala', duracion: 4, escala: 1.4 },
      { label: 'Sostén',  duracion: 4, escala: 1.4 },
      { label: 'Exhala', duracion: 4, escala: 0.7 },
    ],
    ciclos: 5,
  },
  {
    id: 'coherente',
    nombre: 'Coherencia cardíaca',
    emoji: '💚',
    descripcion: '5 minutos que regulan el corazón y la mente.',
    color: '#16a34a',
    bg: '#dcfce7',
    fases: [
      { label: 'Inhala', duracion: 5, escala: 1.4 },
      { label: 'Exhala', duracion: 5, escala: 0.7 },
    ],
    ciclos: 6,
  },
]

const MENSAJES_FIN = [
  '¡Excelente! Tu sistema nervioso te lo agradece 🌿',
  '¡Lo lograste! Eres más fuerte de lo que crees 💪',
  'Unos minutos de calma pueden cambiar todo el día ✨',
  '¡Bien hecho! Respira así siempre que lo necesites 🫁',
  'Tu mente y cuerpo están más tranquilos ahora 💚',
]

// ── Generador de sonido ambient con Web Audio API ─────────────
function crearSonidoAmbient() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const nodos = []

    // Ruido blanco suave
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.04, ctx.currentTime)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400

    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)
    source.start()

    nodos.push(source, gainNode, filter)

    return {
      detener: () => {
        gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
        setTimeout(() => {
          try { source.stop(); ctx.close() } catch (e) {}
        }, 500)
      }
    }
  } catch (e) {
    return { detener: () => {} }
  }
}

// ── Componente círculo animado ────────────────────────────────
function CirculoRespiracion({ fase, progreso, color, escala }) {
  const size = 200
  const center = size / 2
  const escalaActual = 0.7 + (escala - 0.7) * progreso

  return (
    <div style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', margin: '0 auto'
    }}>
      {/* Anillos exteriores */}
      {[1.8, 1.5, 1.2].map((r, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 80 * r * escalaActual,
          height: 80 * r * escalaActual,
          borderRadius: '50%',
          background: `${color}${['0a', '14', '1e'][i]}`,
          transition: `width ${fase?.duracion || 4}s ease-in-out, height ${fase?.duracion || 4}s ease-in-out`,
        }} />
      ))}

      {/* Círculo principal */}
      <div style={{
        width: 80 * escalaActual,
        height: 80 * escalaActual,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: `width ${fase?.duracion || 4}s ease-in-out, height ${fase?.duracion || 4}s ease-in-out`,
        boxShadow: `0 0 30px ${color}44`,
        zIndex: 1
      }}>
        <span style={{ fontSize: 28, userSelect: 'none' }}>🌿</span>
      </div>
    </div>
  )
}

// ── Pantalla de ejercicio activo ──────────────────────────────
function EjercicioActivo({ tecnica, onTerminar }) {
  const [faseIdx, setFaseIdx]       = useState(0)
  const [cicloActual, setCicloActual] = useState(1)
  const [seg, setSeg]               = useState(0)
  const [progreso, setProgreso]     = useState(0)
  const [terminado, setTerminado]   = useState(false)
  const [sonidoOn, setSonidoOn]     = useState(false)
  const [mensaje]                   = useState(() =>
    MENSAJES_FIN[Math.floor(Math.random() * MENSAJES_FIN.length)]
  )
  const sonidoRef = useRef(null)
  const intervaloRef = useRef(null)

  const fase = tecnica.fases[faseIdx]
  const totalFases = tecnica.fases.length

  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      setSeg(s => {
        const nuevo = s + 0.1
        setProgreso(nuevo / fase.duracion)
        if (nuevo >= fase.duracion) {
          const sigFase = faseIdx + 1
          if (sigFase >= totalFases) {
            const sigCiclo = cicloActual + 1
            if (sigCiclo > tecnica.ciclos) {
              clearInterval(intervaloRef.current)
              setTerminado(true)
              sonidoRef.current?.detener()
              return 0
            }
            setCicloActual(sigCiclo)
            setFaseIdx(0)
          } else {
            setFaseIdx(sigFase)
          }
          setProgreso(0)
          return 0
        }
        return nuevo
      })
    }, 100)

    return () => clearInterval(intervaloRef.current)
  }, [faseIdx, cicloActual, fase.duracion, totalFases, tecnica.ciclos])

  const toggleSonido = () => {
    if (sonidoOn) {
      sonidoRef.current?.detener()
      sonidoRef.current = null
      setSonidoOn(false)
    } else {
      sonidoRef.current = crearSonidoAmbient()
      setSonidoOn(true)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(intervaloRef.current)
      sonidoRef.current?.detener()
    }
  }, [])

  if (terminado) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '40px 0', gap: 20
      }}>
        <div style={{ fontSize: 72 }}>🎉</div>
        <h2 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 24, fontWeight: 400, color: '#1a1a1a'
        }}>
          ¡Completado!
        </h2>
        <p style={{
          fontSize: 15, color: '#374151',
          fontFamily: 'DM Sans, sans-serif',
          lineHeight: 1.6, maxWidth: 280
        }}>
          {mensaje}
        </p>
        <div style={{
          background: tecnica.bg, borderRadius: 16,
          padding: '12px 20px', marginTop: 8
        }}>
          <p style={{ fontSize: 13, color: tecnica.color, fontWeight: 600 }}>
            {tecnica.ciclos} ciclos de {tecnica.nombre} completados ✓
          </p>
        </div>
        <button onClick={onTerminar} style={{
          marginTop: 16, background: tecnica.color,
          color: 'white', border: 'none', borderRadius: 16,
          padding: '14px 32px', fontSize: 15, fontWeight: 600,
          fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
        }}>
          Volver a ejercicios
        </button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 24, padding: '16px 0'
    }}>
      {/* Info */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'DM Sans, sans-serif' }}>
          Ciclo {cicloActual} de {tecnica.ciclos}
        </p>
        <h2 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 22, fontWeight: 400, color: '#1a1a1a', marginTop: 4
        }}>
          {fase.label}
        </h2>
        <p style={{
          fontSize: 32, fontWeight: 700, color: tecnica.color,
          fontFamily: 'DM Sans, sans-serif', marginTop: 4
        }}>
          {Math.ceil(fase.duracion - seg)}
        </p>
      </div>

      {/* Círculo */}
      <CirculoRespiracion
        fase={fase}
        progreso={progreso}
        color={tecnica.color}
        escala={fase.escala}
      />

      {/* Barra de progreso del ciclo */}
      <div style={{ width: '100%', maxWidth: 280 }}>
        <div style={{
          display: 'flex', gap: 4, marginBottom: 8,
          justifyContent: 'center'
        }}>
          {tecnica.fases.map((f, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i < faseIdx
                ? tecnica.color
                : i === faseIdx
                ? `linear-gradient(to right, ${tecnica.color} ${progreso * 100}%, #e5e7eb ${progreso * 100}%)`
                : '#e5e7eb',
              transition: 'background 0.1s'
            }} />
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '0 2px'
        }}>
          {tecnica.fases.map((f, i) => (
            <p key={i} style={{
              fontSize: 9, color: i === faseIdx ? tecnica.color : '#9ca3af',
              fontFamily: 'DM Sans, sans-serif', fontWeight: i === faseIdx ? 700 : 400
            }}>
              {f.label} {f.duracion}s
            </p>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={toggleSonido} style={{
          background: sonidoOn ? '#e8f5ee' : '#f0f0eb',
          border: `2px solid ${sonidoOn ? tecnica.color : 'transparent'}`,
          borderRadius: 12, padding: '10px 16px',
          fontSize: 13, cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          color: sonidoOn ? tecnica.color : '#6b7280',
          fontWeight: sonidoOn ? 600 : 400,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          {sonidoOn ? '🔊' : '🔇'} Ambient
        </button>

        <button onClick={() => { sonidoRef.current?.detener(); onTerminar() }} style={{
          background: '#f0f0eb', border: 'none',
          borderRadius: 12, padding: '10px 16px',
          fontSize: 13, cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif', color: '#6b7280'
        }}>
          ✕ Detener
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function Ejercicios() {
  const [tecnicaActiva, setTecnicaActiva] = useState(null)
  const [tab, setTab] = useState('respiracion')

  if (tecnicaActiva) {
    return (
      <div style={{ padding: '0 24px 24px' }}>
        <div className="page-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <p style={{
            color: '#3d7a5e', fontWeight: 600, fontSize: 12,
            letterSpacing: 1, textTransform: 'uppercase'
          }}>
            {tecnicaActiva.nombre}
          </p>
          <h1 style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 26, fontWeight: 400
          }}>
            Ejercicio activo
          </h1>
        </div>
        <EjercicioActivo
          tecnica={tecnicaActiva}
          onTerminar={() => setTecnicaActiva(null)}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <p style={{
          color: '#3d7a5e', fontWeight: 600, fontSize: 12,
          letterSpacing: 1, textTransform: 'uppercase'
        }}>
          Bienestar
        </p>
        <h1>Ejercicios para<br />calmarte 🧘</h1>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 24px 16px' }}>
        <div style={{
          display: 'flex', background: '#efefea',
          borderRadius: 14, padding: 4, gap: 2
        }}>
          {[
            { id: 'respiracion', label: '🫁 Respiración' },
            { id: 'pausas',      label: '☁️ Pausas' },
            { id: 'mensajes',    label: '💚 Mensajes' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '9px 4px',
              background: tab === t.id ? 'white' : 'transparent',
              border: 'none', borderRadius: 11,
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? '#3d7a5e' : '#6b7280',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── TAB RESPIRACIÓN ── */}
        {tab === 'respiracion' && TECNICAS.map(t => (
          <div key={t.id} className="card" style={{ background: t.bg }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{t.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 16, color: t.color }}>{t.nombre}</p>
                <p style={{ fontSize: 13, color: '#555', marginTop: 3, lineHeight: 1.5 }}>
                  {t.descripcion}
                </p>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {t.fases.map((f, i) => (
                    <span key={i} style={{
                      background: `${t.color}22`,
                      color: t.color, borderRadius: 8,
                      padding: '3px 8px', fontSize: 11, fontWeight: 600
                    }}>
                      {f.label} {f.duracion}s
                    </span>
                  ))}
                  <span style={{
                    background: `${t.color}22`,
                    color: t.color, borderRadius: 8,
                    padding: '3px 8px', fontSize: 11, fontWeight: 600
                  }}>
                    × {t.ciclos} ciclos
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setTecnicaActiva(t)} style={{
              marginTop: 14, background: t.color, color: 'white',
              border: 'none', borderRadius: 12, padding: '11px 20px',
              fontSize: 14, fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
              width: '100%'
            }}>
              Comenzar {t.nombre}
            </button>
          </div>
        ))}

        {/* ── TAB PAUSAS ── */}
        {tab === 'pausas' && [
          {
            emoji: '👁️', titulo: 'Regla 20-20-20',
            desc: 'Cada 20 minutos, mira algo a 20 pies por 20 segundos. Descansa tus ojos.',
            color: '#0891b2', bg: '#e0f7fa'
          },
          {
            emoji: '🚶', titulo: 'Pausa activa',
            desc: 'Levántate, estira los brazos, mueve el cuello. 2 minutos bastan para resetear.',
            color: '#7c3aed', bg: '#ede9fe'
          },
          {
            emoji: '🙏', titulo: 'Minuto de gratitud',
            desc: 'Piensa en 3 cosas pequeñas por las que estás agradecido ahora mismo.',
            color: '#d97706', bg: '#fef3c7'
          },
          {
            emoji: '📵', titulo: 'Pausa digital',
            desc: 'Pon el teléfono boca abajo por 5 minutos. Observa lo que te rodea.',
            color: '#059669', bg: '#d1fae5'
          },
        ].map((p, i) => (
          <div key={i} className="card" style={{ background: p.bg }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{p.emoji}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: p.color }}>{p.titulo}</p>
                <p style={{ fontSize: 13, color: '#374151', marginTop: 4, lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* ── TAB MENSAJES ── */}
        {tab === 'mensajes' && [
          '"Estás haciendo lo mejor que puedes. Eso es suficiente."',
          '"Cada respiración es un nuevo comienzo."',
          '"No tienes que resolverlo todo hoy."',
          '"Eres más fuerte de lo que crees."',
          '"Está bien pedir ayuda. Es un acto de valentía."',
          '"Este momento difícil también pasará."',
          '"Tu bienestar importa. Cuídate."',
          '"Respira. Estás aquí. Eso cuenta."',
        ].map((msg, i) => (
          <div key={i} className="card" style={{
            background: i % 2 === 0 ? '#e8f5ee' : '#f0f9ff',
            borderLeft: `4px solid ${i % 2 === 0 ? '#3d7a5e' : '#0891b2'}`
          }}>
            <p style={{
              fontSize: 15, color: '#374151',
              fontFamily: 'DM Serif Display, serif',
              fontWeight: 400, lineHeight: 1.7,
              fontStyle: 'italic'
            }}>
              {msg}
            </p>
          </div>
        ))}

      </div>
    </div>
  )
}
