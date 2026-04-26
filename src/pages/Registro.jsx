import { useState } from 'react'

const emociones = [
  { emoji: '😄', label: 'Muy bien', valor: 5, color: '#3d7a5e' },
  { emoji: '🙂', label: 'Bien', valor: 4, color: '#5a9e7a' },
  { emoji: '😐', label: 'Regular', valor: 3, color: '#f5a623' },
  { emoji: '😔', label: 'Mal', valor: 2, color: '#e07a5f' },
  { emoji: '😢', label: 'Muy mal', valor: 1, color: '#c0392b' },
]

export default function Registro({ navigate }) {
  const [seleccion, setSeleccion] = useState(null)
  const [nota, setNota] = useState('')
  const [guardado, setGuardado] = useState(false)

  const guardar = () => {
    if (!seleccion) return
    const registros = JSON.parse(localStorage.getItem('serenia_registros') || '[]')
    registros.push({
      fecha: new Date().toISOString(),
      emocion: seleccion,
      nota
    })
    localStorage.setItem('serenia_registros', JSON.stringify(registros))
    setGuardado(true)
    setTimeout(() => { setGuardado(false); setSeleccion(null); setNota('') }, 2000)
  }

  return (
    <div>
      <div className="page-header">
        <p style={{ color: '#3d7a5e', fontWeight: 600, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Hoy</p>
        <h1>¿Cómo estás<br />en este momento?</h1>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Selector de emoción */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {emociones.map(e => (
              <button
                key={e.valor}
                onClick={() => setSeleccion(e)}
                style={{
                  background: seleccion?.valor === e.valor ? e.color + '22' : 'transparent',
                  border: seleccion?.valor === e.valor ? `2px solid ${e.color}` : '2px solid transparent',
                  borderRadius: 16, padding: '10px 6px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  transition: 'all 0.2s', flex: 1
                }}
              >
                <span style={{ fontSize: 28 }}>{e.emoji}</span>
                <small style={{ fontSize: 10, color: '#666', fontFamily: 'DM Sans, sans-serif' }}>{e.label}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Nota */}
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>¿Quieres contarme algo más?</p>
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

        {/* Botón guardar */}
        <button
          onClick={guardar}
          disabled={!seleccion}
          style={{
            background: seleccion ? '#3d7a5e' : '#ccc',
            color: 'white', border: 'none', borderRadius: 16,
            padding: '16px', fontSize: 16, fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif', cursor: seleccion ? 'pointer' : 'default',
            transition: 'background 0.2s'
          }}
        >
          {guardado ? '✅ ¡Guardado!' : 'Guardar registro'}
        </button>

      </div>
    </div>
  )
}
