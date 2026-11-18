import { useEffect } from 'react'
import type { ModuleContentProps } from '../registry'
import { useTheme, type Theme } from '../../../theme/ThemeContext'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { SectionCard } from '../shared/ui'

const THEME_OPTIONS: { id: Theme; label: string; description: string }[] = [
  { id: 'dark', label: 'Тёмная', description: 'Стандартная тёмная тема оформления.' },
  { id: 'light', label: 'Светлая', description: 'Светлая тема, вдохновлённая CAD/RMS-системами.' },
]

/**
 * "Персонализация" module: currently just the dark/light theme switch.
 * `useTheme()` applies the choice app-wide (OS shell + every module) via
 * `document.documentElement.dataset.theme` and persists it to
 * `localStorage` — see `theme/ThemeContext.tsx`.
 */
export function PersonalizationApp({ windowId }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    updateBreadcrumb(windowId, ['Персонализация'])
  }, [windowId, updateBreadcrumb])

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      <SectionCard
        title="Тема оформления"
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <path
              d="M8 1.5a6.5 6.5 0 1 0 0 13 1 1 0 0 0 .8-1.6 2 2 0 0 1 1.3-3.2h.9a2.5 2.5 0 0 0 2.5-2.5c0-3.2-2.9-5.7-6.5-5.7Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        }
      >
        <div className="flex flex-col gap-2">
          {THEME_OPTIONS.map((option) => {
            const isActive = theme === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                className={`flex items-center justify-between gap-3 rounded-[6px] px-3.5 py-3 text-left transition-colors ${
                  isActive ? 'bg-[#48adec]/15' : 'bg-ink/5 hover:bg-ink/10'
                }`}
              >
                <div>
                  <p className={`text-[13px] font-semibold ${isActive ? 'text-[#48adec]' : 'text-ink/90'}`}>
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink/50">{option.description}</p>
                </div>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isActive ? 'border-[#48adec] bg-[#48adec]' : 'border-ink/30'
                  }`}
                >
                  {isActive && <span className="h-2 w-2 rounded-full bg-black" />}
                </span>
              </button>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
