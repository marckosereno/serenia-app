const CACHE_NAME = 'serenia-v1'

const ARCHIVOS_CACHE = [
  '/',
  '/index.html',
  '/icon-192.svg',
  '/icon-512.svg',
  '/manifest.json',
]

// Instalar — cachear archivos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_CACHE)
    })
  )
  self.skipWaiting()
})

// Activar — limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch — estrategia: network first, fallback a cache
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return

  // No cachear llamadas a APIs externas
  const url = new URL(event.request.url)
  if (
    url.hostname.includes('groq.com') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, guardar en cache
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Sin red — intentar desde cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached
          // Fallback a index.html para rutas de la SPA
          return caches.match('/index.html')
        })
      })
  )
})
