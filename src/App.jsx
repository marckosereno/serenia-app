import { useState } from 'react'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Registro from './pages/Registro'
import Ejercicios from './pages/Ejercicios'
import Onboarding from './pages/Onboarding'
import './index.css'

const IconHome = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
)
const IconChat = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
)
const IconRegistro = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
)
const IconBienestar = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
  </svg>
)
const IconBell = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
)
const IconMenu = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)

export default function App() {
  const [page, setPage] = useState('home')
  const [perfil, setPerfil] = useState(() => {
    try {
      const p = localStorage.getItem('serenia_perfil')
      return p ? JSON.parse(p) : null
    } catch { return null }
  })

  const onboardingDone = localStorage.getItem('serenia_onboarding') === 'done'

  if (!onboardingDone || !perfil) {
    return <Onboarding onComplete={(p) => setPerfil(p)} />
  }

  if (page === 'chat') {
    return <Chat navigate={setPage} perfil={perfil} />
  }

  const nombre = perfil?.nombre || ''
  const inicial = nombre ? nombre[0].toUpperCase() : '🌿'

  return (
    <div className="app-shell">

      {/* HEADER FLOTANTE */}
      <header className="app-header">
        <div className="header-left">
          <button className="header-icon-btn"><IconMenu /></button>
        </div>
        <div className="header-center">
          <span className="header-logo">SerenIA 🌿</span>
        </div>
        <div className="header-right">
          <button className="header-icon-btn"><IconBell /></button>
          <div className="avatar">{inicial}</div>
        </div>
      </header>

      {/* SCROLL WRAPPER con sombras top y bottom */}
      <div className="scroll-wrapper">
        <div className="page-content">
          {page === 'home'        && <Home navigate={setPage} perfil={perfil} />}
          {page === 'registro'    && <Registro navigate={setPage} />}
          {page === 'ejercicios'  && <Ejercicios navigate={setPage} />}
        </div>
      </div>

      {/* NAV */}
      <div className="bottom-nav-wrap">
        <nav className="bottom-nav">
          <button onClick={() => setPage('home')} className={page === 'home' ? 'active' : ''}>
            <IconHome /><small>Inicio</small>
          </button>
          <button onClick={() => setPage('registro')} className={page === 'registro' ? 'active' : ''}>
            <IconRegistro /><small>Registro</small>
          </button>
          <button onClick={() => setPage('ejercicios')} className={page === 'ejercicios' ? 'active' : ''}>
            <IconBienestar /><small>Bienestar</small>
          </button>
          <button onClick={() => setPage('chat')} className="nav-center">
            <IconChat /><small>SerenIA</small>
          </button>
        </nav>
      </div>

    </div>
  )
}
