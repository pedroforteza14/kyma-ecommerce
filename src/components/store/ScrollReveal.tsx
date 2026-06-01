'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Scroll-reveal global.
 *
 * Problema que resuelve:
 * En Next.js App Router, al navegar client-side el pathname cambia
 * ANTES de que el nuevo contenido RSC llegue al DOM. Un setTimeout fijo
 * de 50ms no es suficiente. Usamos un MutationObserver que detecta
 * automáticamente cuando aparecen nuevos [data-reveal] y los observa
 * sin importar cuánto tarde la respuesta del servidor.
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    // Activar transiciones después de montar (evita FOUC en carga inicial)
    requestAnimationFrame(() => {
      document.documentElement.classList.add('js-ready')
    })

    const observed = new WeakSet<Element>()

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el    = entry.target as HTMLElement
          const delay = Number(el.dataset.delay ?? 0)
          setTimeout(() => el.classList.add('in-view'), delay)
          io.unobserve(el)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    // Observa todos los [data-reveal] que todavía no tienen in-view
    const observeAll = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in-view)').forEach((el) => {
        if (observed.has(el)) return
        observed.add(el)
        io.observe(el)
      })
    }

    // Observar elementos presentes ahora
    observeAll()

    // Debounce para no llamar observeAll en cada micro-mutación del DOM
    let debounce: ReturnType<typeof setTimeout>
    const mo = new MutationObserver(() => {
      clearTimeout(debounce)
      debounce = setTimeout(observeAll, 80)
    })

    // Vigilar inserción de nuevos nodos (contenido RSC que llega después del pathname change)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(debounce)
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
