import { getProfiles, useSessionEnded } from '../../lib/session'

/**
 * «Завершить сессию» (Пуск): every account is signed out — the MDT is covered
 * by this screen until someone signs in again (reload: back to the account
 * picker's first character).
 */
export function SessionEndedScreen() {
  const ended = useSessionEnded()
  if (!ended) return null
  const n = getProfiles().length
  return (
    <div role="dialog" aria-label="Сессия завершена" className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-5 bg-[#101010] text-center text-white">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2B2B2B]">
        <svg width="34" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
          <path d="M7 9V6.5a3 3 0 016 0V9" />
        </svg>
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="text-[24px] font-semibold">Сессия завершена</span>
        <span className="text-[14px] text-white/60">Выполнен выход из всех аккаунтов ({n}). Окна закрыты, черновики сохранены.</span>
      </span>
      <button type="button" autoFocus onClick={() => window.location.reload()} className="h-9 rounded-[6px] bg-[#60CDFF] px-5 text-[14px] font-semibold text-[#0B2B3A] hover:brightness-110">
        Войти снова
      </button>
      <span className="absolute bottom-6 text-[12px] text-white/35">SALETS MDT 1.0</span>
    </div>
  )
}
