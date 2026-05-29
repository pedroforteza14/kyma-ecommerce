'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Solo desktop con mouse real
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const dot  = dotRef.current!
    const ring = ringRef.current!

    let mx = -100, my = -100   // mouse
    let rx = -100, ry = -100   // ring (laggy)
    let isHovering = false
    let rafId: number

    // Mover el dot al instante
    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    // Detectar hover sobre elementos interactivos
    const onEnter = () => { isHovering = true }
    const onLeave = () => { isHovering = false }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseenter', onEnter, true)
    document.addEventListener('mouseleave', onLeave, true)

    // Detectar links y botones via event delegation
    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element
      isHovering = !!target.closest('a, button, [role="button"]')
    }
    document.addEventListener('mouseover', handleOver)

    // Loop de animación para el ring
    const animate = () => {
      // Lerp (suavizado)
      rx += (mx - rx) * 0.13
      ry += (my - ry) * 0.13

      dot.style.left  = mx + 'px'
      dot.style.top   = my + 'px'
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'

      if (isHovering) {
        ring.style.transform = 'translate(-50%, -50%) scale(2.2)'
        ring.style.opacity   = '0.5'
        ring.style.background = 'rgba(0,0,0,0.08)'
      } else {
        ring.style.transform = 'translate(-50%, -50%) scale(1)'
        ring.style.opacity   = '1'
        ring.style.background = 'transparent'
      }

      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter, true)
      document.removeEventListener('mouseleave', onLeave, true)
      document.removeEventListener('mouseover', handleOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Dot — se mueve al instante */}
      <div
        ref={dotRef}
        aria-hidden
        className="kyma-cursor-dot fixed z-[9999] w-2 h-2 bg-[#111] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      />
      {/* Ring — sigue con lag */}
      <div
        ref={ringRef}
        aria-hidden
        className="kyma-cursor-ring fixed z-[9998] w-10 h-10 border border-[#111] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity,background] duration-200 ease-out"
      />
    </>
  )
}
