import type { ModuleContentProps } from '../modules/registry'

/**
 * Placeholder content for every module not yet rebuilt for the new design
 * (everything but Почта right now) — rendered by `AppWindow` in place of
 * the module's real (pre-redesign) component whenever its `AppTile.stub`
 * flag is set, so switching a module back on later is just removing that
 * flag, not restoring deleted code.
 */
export function StubApp(_props: ModuleContentProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 text-ink/40">
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12.5 3.5a3.5 3.5 0 00-4.6 4.6L3 13v3h3l4.9-4.9a3.5 3.5 0 004.6-4.6l-2.3 2.3-2-2z" />
        </svg>
      </span>
      <div>
        <div className="text-[20px] font-bold text-ink">В РАЗРАБОТКЕ!!!!</div>
        <div className="mt-1 text-[14px] text-ink/50">Скоро будет.</div>
      </div>
    </div>
  )
}
