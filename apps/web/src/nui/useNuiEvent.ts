import { useEffect } from 'react'

interface NuiMessage<T> {
  action: string
  data: T
}

/**
 * Subscribes to messages pushed from the Lua client script via
 * `SendNUIMessage`. In plain-browser mode this simply never fires, which is
 * harmless — the app just stays on its default/mock state.
 */
export function useNuiEvent<T = unknown>(
  action: string,
  handler: (data: T) => void,
) {
  useEffect(() => {
    const listener = (event: MessageEvent<NuiMessage<T>>) => {
      if (event.data?.action === action) {
        handler(event.data.data)
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [action, handler])
}
