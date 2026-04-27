import { useState, useEffect, useRef } from 'react'

const TECNICAS = [
  {
    id: '478', nombre: '4-7-8', emoji: '🫁',
    descripcion: 'Calma el sistema nervioso. Ideal para dormir o bajar ansiedad.',
    color: '#3d7a5e', bg: '#e8f5ee',
    fases: [
      { label: 'Inhala', duracion: 4, escala: 1.4 },
      { label: 'Sostén', duracion: 7, escala: 1.4 },
      { label: 'Exhala', duracion: 8, escala: 0.7 },
    ], ciclos: 4,
    prep: 'Siéntate cómodamente. Coloca la punta de la lengua detrás de los dientes superiores. Cierra los ojos y relaja los hombros.',
  },
  {
    id: 'box', nombre: 'Box Breathing', emoji: '⬛',
    descripcion: 'Usada por atletas y militares. Reduce estrés y mejora el foco.',
    color: '#5b4fcf', bg: '#eeecff',
    fases: [
      { label: 'Inhala', duracion: 4, escala: 1.4 },
      { label: 'Sostén', duracion: 4, escala: 1.4 },
      { label: 'Exhala', duracion: 4, escala: 0.7 },
      { label: 'Sostén', duracion: 4, escala: 0.7 },
    ], ciclos: 4,
    prep: 'Siéntate con la espalda recta. Exhala completamente para vaciar los pulmones. Respira por la nariz durante todo el ejercicio.',
  },
  {
    id: '444', nombre: '4-4-4', emoji: '🌊',
    descripcion: 'Respiración rítmica. Perfecta para momentos de pánico.',
    color: '#0891b2', bg: '#e0f7fa',
    fases: [
      { label: 'Inhala', duracion: 4, escala: 1.4 },
      { label: 'Sostén', duracion: 4, escala: 1.4 },
      { label: 'Exhala', duracion: 4, escala: 0.7 },
    ], ciclos: 5,
    prep: 'Busca un lugar tranquilo. Pon una mano en el pecho y otra en el abdomen. Siente cómo se mueve tu cuerpo al respirar.',
  },
  {
    id: 'coherente', nombre: 'Coherencia cardíaca', emoji: '💚',
    descripcion: '5 minutos que regulan el corazón y la mente.',
    color: '#16a34a', bg: '#dcfce7',
    fases: [
      { label: 'Inhala', duracion: 5, escala: 1.4 },
      { label: 'Exhala', duracion: 5, escala: 0.7 },
    ], ciclos: 6,
    prep: 'Siéntate o recuéstate. Imagina que respiras desde el centro de tu pecho. Trata de mantener un ritmo constante y suave.',
  },
]

const MENSAJES_FIN = [
  '¡Excelente! Tu sistema nervioso te lo agradece 🌿',
  '¡Lo lograste! Eres más fuerte de lo que crees 💪',
  'Unos minutos de calma pueden cambiar todo el día ✨',
  '¡Bien hecho! Respira así siempre que lo necesites 🫁',
  'Tu mente y cuerpo están más tranquilos ahora 💚',
]

const QUOTES = [
  { texto: 'Estás haciendo lo mejor que puedes. Eso es suficiente.', gradiente: 'linear-gradient(135deg, #e8f5ee 0%, #b8ddc8 100%)', color: '#2d5a42' },
  { texto: 'Cada respiración es un nuevo comienzo.', gradiente: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', color: '#0369a1' },
  { texto: 'No tienes que resolverlo todo hoy.', gradiente: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#92400e' },
  { texto: 'Eres más fuerte de lo que crees.', gradiente: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', color: '#5b21b6' },
  { texto: 'Está bien pedir ayuda. Es un acto de valentía.', gradiente: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', color: '#9d174d' },
  { texto: 'Este momento difícil también pasará.', gradiente: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)', color: '#9a3412' },
  { texto: 'Tu bienestar importa. Cuídate.', gradiente: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)', color: '#166534' },
  { texto: 'Respira. Estás aquí. Eso cuenta.', gradiente: 'linear-gradient(135deg, #f5f3ff 0%, #e9d5ff 100%)', color: '#6d28d9' },
]

function crearSonidoAmbient() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const source = ctx.createBufferSource()
    source.buffer = buffer; source.loop = true
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.04, ctx.currentTime)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 400
    source.connect(filter); filter.connect(gainNode); gainNode.connect(ctx.destination)
    source.start()
    return {
      detener: () => {
        gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
        setTimeout(() => { try { source.stop(); ctx.close() } catch (e) {} }, 500)
      }
    }
  } catch (e) { return { detener: () => {} } }
}

function BtnFlotante({ onClick, children, color, bg, width, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: 36,
      width: width || 36,
      borderRadius: width ? 18 : '50%',
      background: bg || 'rgba(255,255,255,0.92)',
      border: 'none',
      boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      gap: 5, padding: width ? '0 12px' : 0,
      color: color || '#6b7280',
      fontSize: 12, fontWeight: 600,
      fontFamily: 'DM Sans, sans-serif',
      transition: 'all 0.2s', flexShrink: 0,
      opacity: disabled ? 0.5 : 1,
    }}>
      {children}
    </button>
  )
}

function CirculoRespiracion({ fase, progreso, color }) {
  const escalaTarget = fase?.escala || 1
  const escalaActual = 0.7 + (escalaTarget - 0.7) * progreso
  return (
    <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '0 auto' }}>
      {[1.8, 1.5, 1.2].map((r, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 72 * r * escalaActual, height: 72 * r * escalaActual,
          borderRadius: '50%',
          background: `${color}${['0a', '14', '1e'][i]}`,
          transition: `width ${fase?.duracion || 4}s ease-in-out, height ${fase?.duracion || 4}s ease-in-out`,
        }} />
      ))}
      <div style={{
        width: 72 * escalaActual, height: 72 * escalaActual,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: `width ${fase?.duracion || 4}s ease-in-out, height ${fase?.duracion || 4}s ease-in-out`,
        boxShadow: `0 0 28px ${color}44`, zIndex: 1
      }}>
        <span style={{ fontSize: 24 }}>🌿</span>
      </div>
    </div>
  )
}

function PantallaPrep({ tecnica, onIniciar, onCancelar }) {
  const [conteo, setConteo] = useState(null)

  useEffect(() => {
    if (conteo === null) return
    if (conteo === 0) { onIniciar(); return }
    const t = setTimeout(() => setConteo(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [conteo])

  if (conteo !== null) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: 12, textAlign: 'center'
      }}>
        <p style={{ fontSize: 14, color: '#6b7280', fontFamily: 'DM Sans, sans-serif' }}>
          Comenzando {tecnica.nombre}...
        </p>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: `linear-gradient(135deg, ${tecnica.color}, ${tecnica.color}99)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 50px ${tecnica.color}55`,
        }}>
          <span style={{ fontSize: 64, fontWeight: 700, color: 'white', fontFamily: 'Libre Baskerville, serif', lineHeight: 1 }}>
            {conteo}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', fontFamily: 'DM Sans, sans-serif' }}>Prepárate...</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Mini header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <BtnFlotante onClick={onCancelar}>←</BtnFlotante>
        <div>
          <p style={{ fontSize: 11, color: tecnica.color, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
            Preparación
          </p>
          <p style={{ fontFamily: 'Libre Baskerville, serif', fontSize: 20, margin: 0 }}>
            {tecnica.nombre}
          </p>
        </div>
      </div>

      {/* Card técnica */}
      <div style={{ background: tecnica.bg, borderRadius: 18, padding: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 32 }}>{tecnica.emoji}</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: tecnica.color, margin: 0 }}>{tecnica.nombre}</p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>{tecnica.ciclos} ciclos</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {tecnica.fases.map((f, i) => (
            <span key={i} style={{ background: `${tecnica.color}22`, color: tecnica.color, borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
              {f.label} {f.duracion}s
            </span>
          ))}
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5, margin: 0 }}>{tecnica.descripcion}</p>
      </div>

      {/* Instrucciones */}
      <div style={{ background: 'white', borderRadius: 14, padding: 14 }}>
        <p style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>📋 Antes de comenzar</p>
        <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{tecnica.prep}</p>
      </div>

      {/* Tips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { emoji: '📵', texto: 'Silencia notifs' },
          { emoji: '👃', texto: 'Por la nariz' },
          { emoji: '😌', texto: 'Ojos cerrados' },
        ].map((tip, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'white', borderRadius: 12, padding: '10px 8px', textAlign: 'center'
          }}>
            <span style={{ fontSize: 20 }}>{tip.emoji}</span>
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0, lineHeight: 1.3 }}>{tip.texto}</p>
          </div>
        ))}
      </div>

      <button onClick={() => setConteo(3)} style={{
        background: tecnica.color, color: 'white', border: 'none',
        borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700,
        fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
        boxShadow: `0 4px 16px ${tecnica.color}44`
      }}>
        Comenzar ejercicio →
      </button>
    </div>
  )
}

function EjercicioActivo({ tecnica, onTerminar }) {
  const [faseIdx, setFaseIdx]         = useState(0)
  const [cicloActual, setCicloActual] = useState(1)
  const [seg, setSeg]                 = useState(0)
  const [progreso, setProgreso]       = useState(0)
  const [terminado, setTerminado]     = useState(false)
  const [sonidoOn, setSonidoOn]       = useState(false)
  const [mensaje] = useState(() => MENSAJES_FIN[Math.floor(Math.random() * MENSAJES_FIN.length)])
  const sonidoRef    = useRef(null)
  const intervaloRef = useRef(null)
  const fase = tecnica.fases[faseIdx]

  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      setSeg(s => {
        const nuevo = s + 0.1
        setProgreso(nuevo / fase.duracion)
        if (nuevo >= fase.duracion) {
          const sigFase = faseIdx + 1
          if (sigFase >= tecnica.fases.length) {
            const sigCiclo = cicloActual + 1
            if (sigCiclo > tecnica.ciclos) {
              clearInterval(intervaloRef.current)
              setTerminado(true)
              sonidoRef.current?.detener()
              return 0
            }
            setCicloActual(sigCiclo); setFaseIdx(0)
          } else { setFaseIdx(sigFase) }
          setProgreso(0); return 0
        }
        return nuevo
      })
    }, 100)
    return () => clearInterval(intervaloRef.current)
  }, [faseIdx, cicloActual, fase.duracion, tecnica.fases.length, tecnica.ciclos])

  useEffect(() => () => { clearInterval(intervaloRef.current); sonidoRef.current?.detener() }, [])

  const toggleSonido = () => {
    if (sonidoOn) { sonidoRef.current?.detener(); sonidoRef.current = null; setSonidoOn(false) }
    else { sonidoRef.current = crearSonidoAmbient(); setSonidoOn(true) }
  }

  const detener = () => { sonidoRef.current?.detener(); onTerminar() }

  if (terminado) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        minHeight: '70vh', gap: 16, padding: '0 8px'
      }}>
        <div style={{ fontSize: 64 }}>🎉</div>
        <h2 style={{ fontFamily: 'Libre Baskerville, serif', fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          ¡Completado!
        </h2>
        <p style={{ fontSize: 14, color: '#374151', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6, maxWidth: 260, margin: 0 }}>
          {mensaje}
        </p>
        <div style={{ background: tecnica.bg, borderRadius: 14, padding: '10px 18px' }}>
          <p style={{ fontSize: 13, color: tecnica.color, fontWeight: 600, margin: 0 }}>
            {tecnica.ciclos} ciclos de {tecnica.nombre} ✓
          </p>
        </div>
        <button onClick={onTerminar} style={{
          background: tecnica.color, color: 'white', border: 'none',
          borderRadius: 14, padding: '13px 28px',
          fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
        }}>
          Volver a ejercicios
        </button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '72vh', gap: 16, padding: '0 8px'
    }}>

      {/* Info central */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          Ciclo {cicloActual} de {tecnica.ciclos}
        </p>
        <h2 style={{ fontFamily: 'Libre Baskerville, serif', fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: '4px 0' }}>
          {fase.label}
        </h2>
        <p style={{ fontSize: 60, fontWeight: 700, color: tecnica.color, fontFamily: 'Libre Baskerville, serif', margin: 0, lineHeight: 1 }}>
          {Math.ceil(fase.duracion - seg)}
        </p>
      </div>

      {/* Círculo */}
      <CirculoRespiracion fase={fase} progreso={progreso} color={tecnica.color} />

      {/* Barra de fases */}
      <div style={{ width: '100%', maxWidth: 280 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
          {tecnica.fases.map((f, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 4,
              background: i < faseIdx
                ? tecnica.color
                : i === faseIdx
                  ? `linear-gradient(to right, ${tecnica.color} ${progreso * 100}%, #e5e7eb ${progreso * 100}%)`
                  : '#e5e7eb',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {tecnica.fases.map((f, i) => (
            <p key={i} style={{
              fontSize: 9, margin: 0,
              color: i === faseIdx ? tecnica.color : '#9ca3af',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: i === faseIdx ? 700 : 400
            }}>
              {f.label} {f.duracion}s
            </p>
          ))}
        </div>
      </div>

      {/* Botones DEBAJO del círculo */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <BtnFlotante onClick={detener} width={44}>←</BtnFlotante>

        <BtnFlotante
          onClick={toggleSonido}
          width={100}
          bg={sonidoOn ? tecnica.color : 'rgba(255,255,255,0.92)'}
          color={sonidoOn ? 'white' : '#6b7280'}
        >
          {sonidoOn ? '🔊' : '🔇'} Ambient
        </BtnFlotante>

        <BtnFlotante
          onClick={detener}
          width={88}
          bg="rgba(255,255,255,0.92)"
          color="#e07a5f"
        >
          ✕ Detener
        </BtnFlotante>
      </div>

    </div>
  )
}

function TabMensajes() {
  const [copiado, setCopiado] = useState(null)

  const copiar = async (texto, idx) => {
    try { await navigator.clipboard.writeText(texto); setCopiado(idx); setTimeout(() => setCopiado(null), 2000) }
    catch (e) {}
  }

  const compartir = async (texto) => {
    try { await navigator.share({ title: 'SerenIA', text: `"${texto}" — SerenIA` }) }
    catch (e) {}
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {QUOTES.map((q, i) => (
        <div key={i} style={{
          background: q.gradiente, borderRadius: 22,
          padding: '24px 20px 16px', position: 'relative',
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            position: 'absolute', top: 12, left: 16,
            fontSize: 44, lineHeight: 1, color: q.color,
            opacity: 0.18, fontFamily: 'Libre Baskerville, serif', userSelect: 'none'
          }}>"</div>
          <p style={{
            fontFamily: 'Libre Baskerville, serif',
            fontSize: 17, color: q.color,
            lineHeight: 1.7, margin: '6px 0 14px',
            fontWeight: 400, position: 'relative', zIndex: 1
          }}>
            {q.texto}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => copiar(q.texto, i)} style={{
              height: 32, borderRadius: 16,
              background: 'rgba(255,255,255,0.7)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '0 12px', fontSize: 12,
              color: q.color, fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif',
              backdropFilter: 'blur(4px)'
            }}>
              {copiado === i ? '✅ Copiado' : '📋 Copiar'}
            </button>
            {typeof navigator.share === 'function' && (
              <button onClick={() => compartir(q.texto)} style={{
                height: 32, borderRadius: 16,
                background: 'rgba(255,255,255,0.7)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '0 12px', fontSize: 12,
                color: q.color, fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                backdropFilter: 'blur(4px)'
              }}>
                ↗ Compartir
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Ejercicios() {
  const [tab, setTab]                     = useState('respiracion')
  const [tecnicaPrep, setTecnicaPrep]     = useState(null)
  const [tecnicaActiva, setTecnicaActiva] = useState(null)

  if (tecnicaPrep && !tecnicaActiva) {
    return (
      <div style={{ padding: '8px 20px 100px' }}>
        <PantallaPrep
          tecnica={tecnicaPrep}
          onIniciar={() => setTecnicaActiva(tecnicaPrep)}
          onCancelar={() => setTecnicaPrep(null)}
        />
      </div>
    )
  }

  if (tecnicaActiva) {
    return (
      <div style={{ padding: '8px 20px 100px' }}>
        <EjercicioActivo
          tecnica={tecnicaActiva}
          onTerminar={() => { setTecnicaActiva(null); setTecnicaPrep(null) }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <p style={{ color: '#3d7a5e', fontWeight: 600, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
          Bienestar
        </p>
        <h1>Ejercicios para<br />calmarte 🧘</h1>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', background: '#efefea', borderRadius: 14, padding: 4, gap: 2 }}>
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

      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {tab === 'respiracion' && TECNICAS.map(t => (
          <div key={t.id} className="card" style={{ background: t.bg }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{t.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: t.color, margin: 0 }}>{t.nombre}</p>
                <p style={{ fontSize: 13, color: '#555', marginTop: 3, lineHeight: 1.5, marginBottom: 8 }}>{t.descripcion}</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {t.fases.map((f, i) => (
                    <span key={i} style={{ background: `${t.color}22`, color: t.color, borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                      {f.label} {f.duracion}s
                    </span>
                  ))}
                  <span style={{ background: `${t.color}22`, color: t.color, borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>× {t.ciclos}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setTecnicaPrep(t)} style={{
              marginTop: 12, background: t.color, color: 'white',
              border: 'none', borderRadius: 12, padding: '11px 16px',
              fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer', width: '100%'
            }}>
              Comenzar {t.nombre} →
            </button>
          </div>
        ))}

        {tab === 'pausas' && [
          { emoji: '👁️', titulo: 'Regla 20-20-20', desc: 'Cada 20 minutos, mira algo a 20 pies por 20 segundos. Descansa tus ojos.', color: '#0891b2', bg: '#e0f7fa' },
          { emoji: '🚶', titulo: 'Pausa activa', desc: 'Levántate, estira los brazos, mueve el cuello. 2 minutos bastan para resetear.', color: '#7c3aed', bg: '#ede9fe' },
          { emoji: '🙏', titulo: 'Minuto de gratitud', desc: 'Piensa en 3 cosas pequeñas por las que estás agradecido ahora mismo.', color: '#d97706', bg: '#fef3c7' },
          { emoji: '📵', titulo: 'Pausa digital', desc: 'Pon el teléfono boca abajo por 5 minutos. Observa lo que te rodea.', color: '#059669', bg: '#d1fae5' },
        ].map((p, i) => (
          <div key={i} className="card" style={{ background: p.bg }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{p.emoji}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: p.color, margin: 0 }}>{p.titulo}</p>
                <p style={{ fontSize: 13, color: '#374151', marginTop: 4, lineHeight: 1.5, marginBottom: 0 }}>{p.desc}</p>
              </div>
            </div>
          </div>
        ))}

        {tab === 'mensajes' && <TabMensajes />}
      </div>
    </div>
  )
}
