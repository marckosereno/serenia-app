export default function Home({ navigate, perfil }) {
  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'
  const nombre = perfil?.nombre ? `, ${perfil.nombre}` : ''

  const accesos = [
    { icon: '📓', label: 'Registrar emoción',   page: 'registro',   color: '#e8f5ee' },
    { icon: '💬', label: 'Hablar con SerenIA',  page: 'chat',       color: '#e8f0ff' },
    { icon: '🧘', label: 'Ejercicios',           page: 'ejercicios', color: '#fff3e8' },
  ]

  return (
    <div>
      <div className="page-header">
        <p style={{
          color: '#3d7a5e', fontWeight: 600, fontSize: 13,
          letterSpacing: 1, textTransform: 'uppercase'
        }}>
          {saludo}{nombre}
        </p>
        <h1>¿Cómo te sientes<br />hoy? 🌿</h1>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Card principal */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #3d7a5e, #5a9e7a)',
          color: 'white'
        }}>
          <p style={{ fontSize: 13, opacity: 0.85 }}>Tu espacio seguro</p>
          <h2 style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 22, fontWeight: 400, marginTop: 4
          }}>
            SerenIA está aquí<br />para escucharte
          </h2>
          <button onClick={() => navigate('chat')} style={{
            marginTop: 16, background: 'white', color: '#3d7a5e',
            border: 'none', borderRadius: 12, padding: '10px 20px',
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
            fontSize: 14, cursor: 'pointer'
          }}>
            Abrir chat →
          </button>
        </div>

        {/* Accesos rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {accesos.map(a => (
            <button key={a.page} onClick={() => navigate(a.page)} className="card" style={{
              background: a.color, border: 'none',
              cursor: 'pointer', textAlign: 'left', padding: 16
            }}>
              <div style={{ fontSize: 28 }}>{a.icon}</div>
              <p style={{
                marginTop: 8, fontWeight: 600, fontSize: 13,
                fontFamily: 'DM Sans, sans-serif'
              }}>{a.label}</p>
            </button>
          ))}

          <div className="card" style={{ background: '#ffeaea', padding: 16 }}>
            <div style={{ fontSize: 28 }}>🆘</div>
            <p style={{ marginTop: 8, fontWeight: 600, fontSize: 13 }}>Necesito ayuda</p>
            <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Línea de crisis</p>
          </div>
        </div>

        {/* Aviso ético */}
        <div className="card" style={{ background: '#fffbea', border: '1px solid #f0e080' }}>
          <p style={{ fontSize: 12, color: '#7a6500', lineHeight: 1.5 }}>
            ⚠️ <strong>SerenIA no reemplaza a un profesional.</strong> Si estás en crisis, busca ayuda de un psicólogo o terapeuta.
          </p>
        </div>

      </div>
    </div>
  )
}
