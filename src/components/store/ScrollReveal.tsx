'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Global scroll-reveal observer.
 * Añade la clase "in-view" a cualquier elemento con [data-reveal].
 * Acepta [data-delay="200"] para stagger.
 * No produce FOUC: sólo activa las transiciones después de montar.
 *
 * Se re-ejecuta en cada cambio de pathname para que el observer
 * capture los elementos del nuevo page (Next.js no desmonta el layout
 * en navegaciones client-side, entonces el useEffect[] original
 * nunca volvería a correr).
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    // Activar transiciones DESPUÉS de montar para evitar parpadeo
    requestAnimationFrame(() => {
      document.documentElement.classList.add('js-ready')
    })

    let observer: IntersectionObserver | null = null

    // Pequeño timeout para que Next.js termine de pintar el nuevo DOM
    const tid = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const el    = entry.target as HTMLElement
            const delay = Number(el.dataset.delay ?? 0)
            setTimeout(() => el.classList.add('in-view'), delay)
            observer?.unobserve(el)
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )

      document.querySelectorAll('[data-reveal]').forEach((el) => observer!.observe(el))
    }, 50)

    return () => {
      clearTimeout(tid)
      observer?.disconnect()
    }
  }, [pathname]) // ← re-corre en cada cambio de ruta

  return null
}
