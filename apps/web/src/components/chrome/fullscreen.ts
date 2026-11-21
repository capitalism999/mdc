import { useEffect, useState } from 'react'

function isFullscreen() {
  return !!document.fullscreenElement
}

/** Tracks the Fullscreen API state («Развернуть» in the title bar, «Во весь экран» in the F11 tip). */
export function useFullscreen() {
  const [full, setFull] = useState(isFullscreen)
  useEffect(() => {
    const sync = () => setFull(isFullscreen())
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  return full
}

export function toggleFullscreen() {
  if (isFullscreen()) void document.exitFullscreen?.().catch(() => {})
  else void document.documentElement.requestFullscreen?.().catch(() => {})
}
