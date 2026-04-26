import { useState } from 'react'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Registro from './pages/Registro'
import Ejercicios from './pages/Ejercicios'
import './index.css'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="app-shell">

      {/* Páginas normales */}
      {page !== 'chat' && (
        <>
          <div className="page-content">
            {page === 'home' && <Home navigate={setPage} />}
            {page === 'registro' && <Registro navigate={setPage} />}
            {page === 'ejercicios' && <Ejercicios navigate={setPage} />}
          </div>

          <nav className="bottom-nav">
            <button onClick={() => setPage('home')} className={page === 'home' ? 'active' : ''}>
              <span>🏠</span>
              <small>Inicio</small>
            </button>
            <button onClick={() => setPage('registro')} className={page === 'registro' ? 'active' : ''}>
              <span>📓</span>
              <small>Registro</small>
            </button>
            <button onClick={() => setPage('chat')} className="nav-center">
              <span>🌿</span>
              <small>SerenIA</small>
            </button>
            <button onClick={() => setPage('ejercicios')} className={page === 'ejercicios' ? 'active' : ''}>
              <span>🧘</span>
              <small>Bienestar</small>
            </button>
          </nav>
        </>
      )}

      {/* Chat ocupa pantalla completa */}
      {page === 'chat' && (
        <Chat navigate={setPage} />
      )}

    </div>
  )
}