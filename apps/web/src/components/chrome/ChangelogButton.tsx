import { useEffect, useRef, useState } from 'react'
import { changelog } from '../../data/changelog'

/**
 * "What's new" bell, next to the profile pill — a Windows 11-style flyout
 * listing what actually shipped (see `data/changelog.ts`), newest first.
 */
export function ChangelogButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Что нового"
        title="Что нового"
        className={`flex h-[54px] w-[44px] items-center justify-center rounded-[6px] text-ink/80 hover:bg-ink/5 hover:text-ink ${isOpen ? 'bg-ink/5 text-ink' : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 2.5a5.5 5.5 0 015.5 5.5v2.7l1.3 2.6a.8.8 0 01-.7 1.2H3.9a.8.8 0 01-.7-1.2l1.3-2.6V8a5.5 5.5 0 015.5-5.5z" />
          <path d="M8 16.5a2 2 0 004 0" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-[320px] rounded-[6px] border border-ink/10 bg-bg-chrome-2 p-1 shadow-lg">
          <div className="px-2.5 pb-1 pt-2 text-[13px] font-semibold text-ink">Что нового</div>
          {changelog.map((entry) => (
            <div key={entry.date} className="px-2.5 py-1.5">
              <div className="text-[12px] text-ink/50">{entry.date}</div>
              <ul className="mt-1 flex flex-col gap-1.5">
                {entry.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] leading-[1.35] text-ink/80">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#48adec]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
