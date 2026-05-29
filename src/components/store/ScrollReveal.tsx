'use client'

import { useEffect } from 'react'

/**
 * Global scroll-reveal observer.
 * Añade la clase "in-view" a cualquier elemento con [data-reveal].
 * Acepta [data-delay="200"] para stagger.
 * No produce FOUC: sólo activa las transiciones después de montar.
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Activar transiciones DESPUÉS de montar para evitar parpadeo
    requestAnimationFrame(() => {
      document.documentElement.classList.add('js-ready')
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el    = entry.target as HTMLElement
          const delay = Number(el.dataset.delay ?? 0)
          setTimeout(() => el.classList.add('in-view'), delay)
          observer.unobserve(el)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
