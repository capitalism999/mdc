interface CaptionButton {
  id: string
  glyph: string
  label: string
  roundedTr?: boolean
}

const CAPTION_BUTTONS: CaptionButton[] = [
  { id: 'minimize', glyph: '\uE921', label: 'Свернуть' },
  { id: 'maximize', glyph: '\uE922', label: 'Развернуть' },
  { id: 'close', glyph: '\uE8BB', label: 'Закрыть окно', roundedTr: true },
]

/**
 * The outer OS-style title bar: app title + minimize/maximize/close glyphs
 * rendered with the Segoe Fluent Icons font (Windows-only, which is fine
 * since FiveM only runs on Windows).
 */
export function WindowBar() {
  return (
    <div className="flex h-[30px] w-full items-center justify-between bg-bg-chrome-2">
      <div className="flex items-center gap-1.5 px-3">
        <img src="/assets/icons/window-logo.svg" alt="" className="h-4 w-4" />
        <span className="text-xs font-semibold text-ink">SALETS MDT 1.0</span>
      </div>
      <div className="flex h-full items-stretch">
        {CAPTION_BUTTONS.map((button) => (
          <button
            key={button.id}
            type="button"
            aria-label={button.label}
            className={`icon-font flex h-full w-[46px] items-center justify-center text-xs text-ink hover:bg-ink/10 ${
              button.roundedTr ? 'rounded-tr-md hover:bg-red-600' : ''
            }`}
          >
            {button.glyph}
          </button>
        ))}
      </div>
    </div>
  )
}
