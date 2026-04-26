import { useState, useEffect } from 'react'

const ejercicios = [
  {
    id: 1, emoji: '🫁', titulo: 'Respiración 4-7-8',
    desc: 'Inhala 4 seg, sostén 7, exhala 8. Calma el sistema nervioso.',
    color: '#e8f5ee', pasos: ['Inhala... 4 segundos', 'Sostén... 7 segundos', 'Exhala... 8 segundos'],
    tiempos: [4, 7, 8]
  },
  {
    id: 2, emoji: '🧘', titulo: 'Pausa consciente',
    desc: 'Nombra 5 cosas que puedes ver, 4 que puedes tocar.',
    color: '#e8f0ff', pasos: null
  },
  {
    id: 3, emoji: '💚', titulo: 'Mensaje calmante',
    desc: null, color: '#fff3e8', pasos: null,
    mensaje: '"Estás haciendo lo mejor que puedes. Eso es suficiente. Respira."'
  },
]

export default function Ejercicios() {
  const [activo, setActivo] = useState(null)
  const [paso, setPaso] = useState(0)
  const [seg, setSeg] = useState(0)
  const [corriendo, setCorriendo] = useState(false)

  useEffect(() => {
    if (!corriendo || !activo?.tiempos) return
    if (seg < activo.tiempos[paso]) {
      const t = setTimeout(() => setSeg(s => s + 1), 1000)
      return () => clearTimeout(t)
    } else {
      if (paso < activo.pasos.length - 1) {
        setPaso(p => p + 1); setSeg(0)
      } else {
        setCorriendo(false); setPaso(0); setSeg(0)
      }
    }
  }, [corriendo, seg, paso, activo])

  const iniciar = (ej) => {
    setActivo(ej); setPaso(0); setSeg(0); setCorriendo(true)
  }

  return (
    <div>
      <div className="page-header">
        <p style={{ color: '#3d7a5e', fontWeight: 600, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Bienestar</p>
        <h1>Ejercicios para<br />calmarte 🧘</h1>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ejercicios.map(ej => (
          <div key={ej.id} className="card" style={{ background: ej.color }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>{ej.emoji}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16 }}>{ej.titulo}</p>
                {ej.desc && <p style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{ej.desc}</p>}
              </div>
            </div>

            {/* Respiración activa */}
            {activo?.id === ej.id && corriendo && ej.pasos && (
              <div style={{
                background: 'white', borderRadius: 12, padding: 16,
                textAlign: 'center', marginTop: 8
              }}>
                <p style={{ fontWeight: 700, fontSize: 18, color: '#3d7a5e' }}>
                  {ej.pasos[paso]}
                </p>
                <p style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>
                  {activo.tiempos[paso] - seg}
                </p>
              </div>
            )}

            {/* Mensaje calmante */}
            {ej.mensaje && (
              <p style={{ fontStyle: 'italic', color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                {ej.mensaje}
              </p>
            )}

            {ej.pasos && (
              <button
                onClick={() => iniciar(ej)}
                style={{
                  marginTop: 12, background: '#3d7a5e', color: 'white',
                  border: 'none', borderRadius: 12, padding: '10px 20px',
                  fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer'
                }}
              >
                {activo?.id === ej.id && corriendo ? 'En progreso...' : 'Comenzar'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
