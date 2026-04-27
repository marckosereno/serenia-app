import { useState, useMemo } from 'react'

const EMOCIONES = [
  { emoji: '😄', label: 'Muy bien', valor: 5, color: '#3d7a5e', bg: '#e8f5ee' },
  { emoji: '🙂', label: 'Bien',     valor: 4, color: '#5a9e7a', bg: '#f0faf4' },
  { emoji: '😐', label: 'Regular',  valor: 3, color: '#f5a623', bg: '#fff8ec' },
  { emoji: '😔', label: 'Mal',      valor: 2, color: '#e07a5f', bg: '#fff0ec' },
  { emoji: '😢', label: 'Muy mal',  valor: 1, color: '#c0392b', bg: '#ffeaea' },
]

const getColor = (valor) => EMOCIONES.find(e => e.valor === valor)?.color || '#ddd'
const getBg    = (valor) => EMOCIONES.find(e => e.valor === valor)?.bg    || '#f5f5f5'
const getEmoji = (valor) => EMOCIONES.find(e => e.valor === valor)?.emoji || '•'

const hoy = () => new Date().toISOString().split('T')[0]

const cargarRegistros = () => {
  try { return JSON.parse(localStorage.getItem('serenia_registros') || '[]') }
  catch { return [] }
}

const guardarRegistros = (registros) => {
  localStorage.setItem('serenia_registros', JSON.stringify(registros))
}

// ─── TAB REGISTRAR ───────────────────────────────────────────
function TabRegistrar({ onGuardado }) {
  const [seleccion, setSeleccion] = useState(null)
  const [nota, setNota]           = useState('')
  const [guardado, setGuardado]   = useState(false)

  const guardar = () => {
    if (!seleccion) return
    const registros = cargarRegistros()
    const fechaHoy  = hoy()
    const idx = registros.findIndex(r => r.fecha === fechaHoy)
    const entrada = { fecha: fechaHoy, valor: seleccion.valor, nota }
    if (idx >= 0) registros[idx] = entrada
    else registros.push(entrada)
    guardarRegistros(registros)
    setGuardado(true)
    onGuardado?.()
    setTimeout(() => { setGuardado(false); setSeleccion(null); setNota('') }, 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <p style={{ fontWeight: 600, fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
          ¿Cómo te sientes hoy?
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          {EMOCIONES.map(e => (
            <button key={e.valor} onClick={() => setSeleccion(e)} style={{
              background: seleccion?.valor === e.valor ? e.bg : 'transparent',
              border: `2px solid ${seleccion?.valor === e.valor ? e.color : 'transparent'}`,
              borderRadius: 14, padding: '10px 4px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all 0.2s', flex: 1
            }}>
              <span style={{ fontSize: 26 }}>{e.emoji}</span>
              <small style={{ fontSize: 9, color: '#666', fontFamily: 'DM Sans, sans-serif', textAlign: 'center', lineHeight: 1.2 }}>
                {e.label}
              </small>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
          ¿Quieres contarme algo más?
        </p>
        <textarea
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="Escribe lo que sientes... (opcional)"
          rows={4}
          style={{
            width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 12,
            padding: 12, fontSize: 14, fontFamily: 'DM Sans, sans-serif',
            resize: 'none', outline: 'none', background: '#f9f9f9'
          }}
        />
      </div>

      <button onClick={guardar} disabled={!seleccion} style={{
        background: seleccion ? '#3d7a5e' : '#d1d5db',
        color: 'white', border: 'none', borderRadius: 16,
        padding: '15px', fontSize: 15, fontWeight: 600,
        fontFamily: 'DM Sans, sans-serif',
        cursor: seleccion ? 'pointer' : 'default',
        transition: 'background 0.2s'
      }}>
        {guardado ? '✅ ¡Guardado!' : 'Guardar registro'}
      </button>
    </div>
  )
}

// ─── TAB HISTORIAL ───────────────────────────────────────────
function TabHistorial() {
  const [mesOffset, setMesOffset] = useState(0)
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const registros = cargarRegistros()

  const fecha = new Date()
  fecha.setMonth(fecha.getMonth() + mesOffset)
  const año = fecha.getFullYear()
  const mes = fecha.getMonth()

  const nombreMes = fecha.toLocaleString('es', { month: 'long', year: 'numeric' })
  const primerDia = new Date(año, mes, 1).getDay()
  const diasEnMes = new Date(año, mes + 1, 0).getDate()

  const mapaRegistros = useMemo(() => {
    const mapa = {}
    registros.forEach(r => { mapa[r.fecha] = r })
    return mapa
  }, [registros.length])

  const celdas = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  const fechaDia = (d) => `${año}-${String(mes + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

  const entradaSeleccionada = diaSeleccionado ? mapaRegistros[fechaDia(diaSeleccionado)] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Calendario */}
      <div className="card">
        {/* Navegación de mes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => setMesOffset(m => m - 1)} style={{
            background: '#f5f5f0', border: 'none', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>‹</button>
          <p style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{nombreMes}</p>
          <button
            onClick={() => setMesOffset(m => m + 1)}
            disabled={mesOffset >= 0}
            style={{
              background: mesOffset >= 0 ? 'transparent' : '#f5f5f0',
              border: 'none', borderRadius: 8,
              width: 32, height: 32,
              cursor: mesOffset >= 0 ? 'default' : 'pointer',
              fontSize: 16, opacity: mesOffset >= 0 ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>›</button>
        </div>

        {/* Días de semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {['D','L','M','M','J','V','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', fontWeight: 600, padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Celdas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {celdas.map((d, i) => {
            if (!d) return <div key={i} />
            const key = fechaDia(d)
            const reg = mapaRegistros[key]
            const esHoy = key === hoy()
            const selec = diaSeleccionado === d
            return (
              <button key={i} onClick={() => setDiaSeleccionado(selec ? null : d)} style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: selec ? '2px solid #3d7a5e' : esHoy ? '2px solid #3d7a5e44' : '2px solid transparent',
                background: reg ? getBg(reg.valor) : '#f9f9f9',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 1, padding: 2, transition: 'all 0.15s'
              }}>
                <span style={{ fontSize: 9, color: reg ? getColor(reg.valor) : '#9ca3af', fontWeight: esHoy ? 700 : 400 }}>
                  {d}
                </span>
                {reg && <span style={{ fontSize: 12 }}>{getEmoji(reg.valor)}</span>}
              </button>
            )
          })}
        </div>

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {EMOCIONES.map(e => (
            <div key={e.valor} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: e.color }} />
              <span style={{ fontSize: 10, color: '#6b7280' }}>{e.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detalle del día seleccionado */}
      {diaSeleccionado && (
        <div className="card" style={{ background: entradaSeleccionada ? getBg(entradaSeleccionada.valor) : '#f9f9f9' }}>
          {entradaSeleccionada ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{getEmoji(entradaSeleccionada.valor)}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: getColor(entradaSeleccionada.valor) }}>
                    {EMOCIONES.find(e => e.valor === entradaSeleccionada.valor)?.label}
                  </p>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{fechaDia(diaSeleccionado)}</p>
                </div>
              </div>
              {entradaSeleccionada.nota && (
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{entradaSeleccionada.nota}"
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
              Sin registro para el día {diaSeleccionado}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── TAB GRÁFICA ─────────────────────────────────────────────
function TabGrafica() {
  const [rango, setRango] = useState(7)
  const registros = cargarRegistros()

  const datos = useMemo(() => {
    const hoyStr = hoy()
    const result = []
    for (let i = rango - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const reg = registros.find(r => r.fecha === key)
      result.push({
        fecha: key,
        label: d.toLocaleString('es', { weekday: 'short', day: 'numeric' }),
        valor: reg?.valor ?? null,
        esHoy: key === hoyStr
      })
    }
    return result
  }, [rango, registros.length])

  // Detección de racha negativa
  const rachaActual = useMemo(() => {
    let racha = 0
    for (let i = datos.length - 1; i >= 0; i--) {
      if (datos[i].valor !== null && datos[i].valor <= 2) racha++
      else break
    }
    return racha
  }, [datos])

  const svgW = 320
  const svgH = 120
  const pad  = 24
  const conDatos = datos.filter(d => d.valor !== null)

  const xPos = (i) => pad + (i / (datos.length - 1)) * (svgW - pad * 2)
  const yPos = (v) => svgH - pad - ((v - 1) / 4) * (svgH - pad * 2)

  const puntosConValor = datos
    .map((d, i) => d.valor !== null ? { ...d, i } : null)
    .filter(Boolean)

  const polyline = puntosConValor
    .map(p => `${xPos(p.i)},${yPos(p.valor)}`)
    .join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Alerta racha negativa */}
      {rachaActual >= 3 && (
        <div style={{
          background: '#fff0ec', border: '1.5px solid #e07a5f',
          borderRadius: 16, padding: '14px 16px',
          display: 'flex', gap: 10, alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: 22 }}>💛</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#c0392b', marginBottom: 4 }}>
              He notado que llevas {rachaActual} días difíciles
            </p>
            <p style={{ fontSize: 13, color: '#7a3020', lineHeight: 1.5 }}>
              Está bien no estar bien. ¿Quieres hablar con SerenIA o buscar apoyo profesional?
            </p>
          </div>
        </div>
      )}

      {/* Selector de rango */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[7, 14, 30].map(r => (
          <button key={r} onClick={() => setRango(r)} style={{
            flex: 1, padding: '8px 0',
            background: rango === r ? '#3d7a5e' : '#f0f0eb',
            color: rango === r ? 'white' : '#6b7280',
            border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            {r} días
          </button>
        ))}
      </div>

      {/* Gráfica SVG */}
      <div className="card">
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
          Estado emocional — últimos {rango} días
        </p>

        {conDatos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, padding: '24px 0' }}>
            Aún no hay registros suficientes
          </p>
        ) : (
          <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            {/* Líneas de referencia */}
            {[1,2,3,4,5].map(v => (
              <line key={v}
                x1={pad} y1={yPos(v)} x2={svgW - pad} y2={yPos(v)}
                stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4"
              />
            ))}

            {/* Etiquetas Y */}
            {EMOCIONES.map(e => (
              <text key={e.valor}
                x={pad - 4} y={yPos(e.valor) + 4}
                textAnchor="end" fontSize="8" fill={e.color} fontWeight="600"
              >{e.emoji}</text>
            ))}

            {/* Área bajo la línea */}
            {puntosConValor.length > 1 && (
              <polygon
                points={`${xPos(puntosConValor[0].i)},${svgH - pad} ${polyline} ${xPos(puntosConValor[puntosConValor.length-1].i)},${svgH - pad}`}
                fill="url(#gradArea)" opacity="0.3"
              />
            )}

            <defs>
              <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3d7a5e" />
                <stop offset="100%" stopColor="#3d7a5e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Línea */}
            {puntosConValor.length > 1 && (
              <polyline
                points={polyline}
                fill="none" stroke="#3d7a5e" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            )}

            {/* Puntos */}
            {puntosConValor.map(p => (
              <circle key={p.i}
                cx={xPos(p.i)} cy={yPos(p.valor)} r="4"
                fill={getColor(p.valor)} stroke="white" strokeWidth="2"
              />
            ))}

            {/* Etiquetas X — solo primero, mitad y último */}
            {[0, Math.floor((datos.length-1)/2), datos.length-1].map(i => (
              <text key={i}
                x={xPos(i)} y={svgH - 4}
                textAnchor="middle" fontSize="8" fill="#9ca3af"
              >{datos[i]?.label}</text>
            ))}
          </svg>
        )}
      </div>

      {/* Resumen */}
      {conDatos.length > 0 && (
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Resumen</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: 'Registros', valor: conDatos.length, emoji: '📝' },
              {
                label: 'Promedio',
                valor: EMOCIONES.find(e => e.valor === Math.round(conDatos.reduce((a,b) => a + b.valor, 0) / conDatos.length))?.label || '-',
                emoji: EMOCIONES.find(e => e.valor === Math.round(conDatos.reduce((a,b) => a + b.valor, 0) / conDatos.length))?.emoji || '•'
              },
              { label: 'Racha', valor: `${rachaActual} días`, emoji: rachaActual >= 3 ? '⚠️' : '✨' }
            ].map((item, i) => (
              <div key={i} style={{ background: '#f9f9f9', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{item.emoji}</div>
                <p style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{item.valor}</p>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────
export default function Registro() {
  const [tab, setTab] = useState('registrar')
  const [refresh, setRefresh] = useState(0)

  const tabs = [
    { id: 'registrar', label: 'Registrar' },
    { id: 'historial', label: 'Historial' },
    { id: 'grafica',   label: 'Gráfica'   },
  ]

  return (
    <div>
      <div className="page-header">
        <p style={{ color: '#3d7a5e', fontWeight: 600, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
          Emociones
        </p>
        <h1>Tu registro<br />diario</h1>
      </div>

      {/* TABS */}
      <div style={{ padding: '0 24px 16px' }}>
        <div style={{
          display: 'flex', background: '#efefea',
          borderRadius: 14, padding: 4, gap: 2
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '9px 0',
              background: tab === t.id ? 'white' : 'transparent',
              border: 'none', borderRadius: 11,
              fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? '#3d7a5e' : '#6b7280',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s'
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ padding: '0 24px 24px' }}>
        {tab === 'registrar' && (
          <TabRegistrar onGuardado={() => setRefresh(r => r + 1)} />
        )}
        {tab === 'historial' && <TabHistorial key={refresh} />}
        {tab === 'grafica'   && <TabGrafica   key={refresh} />}
      </div>
    </div>
  )
}
