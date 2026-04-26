import { useState } from 'react'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Registro from './pages/Registro'
import Ejercicios from './pages/Ejercicios'
import './index.css'

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 3l9 9" />
    <path d="M9 21V12h6v9" />
    <path d="M3 12v9h18V12" />
  </svg>
)

const IconRegistro = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </svg>
)

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.06L2 22l4.94-1.38A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth={2.5} />
  </svg>
)

const IconBienestar = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9h.01M15 9h.01" strokeWidth={2.5} />
  </svg>
)

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="app-shell">
      {page !== 'chat' && (
        <>
          <div className="page-content">
            {page === 'home' && <Home navigate={setPage} />}
            {page === 'registro' && <Registro navigate={setPage} />}
            {page === 'ejercicios' && <Ejercicios navigate={setPage} />}
          </div>

          <nav className="bottom-nav">
            <button onClick={() => setPage('home')} className={page === 'home' ? 'active' : ''}>
              <IconHome />
              <small>Inicio</small>
            </button>

            <button onClick={() => setPage('registro')} className={page === 'registro' ? 'active' : ''}>
              <IconRegistro />
              <small>Registro</small>
            </button>

            <button onClick={() => setPage('chat')} className="nav-center">
              <IconChat />
              <small>SerenIA</small>
            </button>

            <button onClick={() => setPage('ejercicios')} className={page === 'ejercicios' ? 'active' : ''}>
              <IconBienestar />
              <small>Bienestar</small>
            </button>
          </nav>
        </>
      )}

      {page === 'chat' && <Chat navigate={setPage} />}
    </div>
  )
}