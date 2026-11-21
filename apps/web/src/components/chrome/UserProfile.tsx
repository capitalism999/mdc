import { useEffect, useRef, useState } from 'react'
import { getProfiles, switchProfile, useActiveProfile } from '../../lib/session'
import type { OfficerProfile } from '../../types'
import { useWindowManager } from '../../windows/WindowManagerContext'

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Round avatar with the character's initials in its agency colour and the agency star at the corner (Windows 11 account picture style). */
function Avatar({ p, size }: { p: OfficerProfile; size: number }) {
  const badge = Math.round(size * 0.42)
  return (
    <span style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {p.photo ? (
        <img src={p.photo} alt="" className="h-full w-full rounded-full object-cover object-top" style={{ background: p.color ?? '#3A5F8F' }} draggable={false} />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full font-semibold text-white" style={{ background: p.color ?? '#3A5F8F', fontSize: Math.round(size * 0.36) }}>
          {initials(p.name)}
        </span>
      )}
      {p.logo ? (
        <span className="absolute flex items-center justify-center rounded-full bg-[#2B2B2B]" style={{ right: -2, bottom: -2, width: badge, height: badge, boxShadow: '0 0 0 2px #2B2B2B' }}>
          <img src={p.logo} alt="" style={{ width: badge - 4, height: badge - 4, objectFit: 'contain' }} />
        </span>
      ) : null}
    </span>
  )
}

/**
 * The signed-in character, right-aligned in the header. The flyout (Windows
 * 11 account picker style) shows the active character — rank, station,
 * position, department — and the other characters to switch to. Switching
 * closes the open windows (each may save or ask first), then the MDT works
 * as the new character: prints, signatures, authorship, report blanks.
 */
export function UserProfile() {
  const profile = useActiveProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [busy, setBusy] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { closeAll, windows } = useWindowManager()

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setConfirmLogout(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setConfirmLogout(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  async function pick(id: string) {
    if (id === profile.id || busy) return
    setBusy(true)
    // the open windows belong to the current character: they close (and may save / ask) first
    const ok = await closeAll()
    setBusy(false)
    if (!ok) return
    switchProfile(id)
    setIsOpen(false)
  }

  async function logOut() {
    if (!(await closeAll())) {
      setConfirmLogout(false)
      return
    }
    window.location.reload()
  }

  const others = getProfiles().filter((p) => p.id !== profile.id)

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open)
          setConfirmLogout(false)
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title="Сменить персонажа или выйти"
        className={`flex h-[54px] items-center gap-2 overflow-hidden rounded-[6px] px-3 ${isOpen ? 'bg-ink/10' : 'bg-ink/5 hover:bg-ink/10'}`}
      >
        <div className="flex flex-col items-start gap-1 text-[12px]">
          <span className="font-semibold leading-[12px] text-ink">{profile.badgeNumber}</span>
          <div className="flex flex-col items-start leading-[1.3] text-ink/70">
            <span>{profile.rank}</span>
            <span>{profile.name}</span>
          </div>
        </div>
        <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-ink/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>

      {isOpen && (
        <div role="menu" aria-label="Персонажи" className="absolute right-0 top-full z-[60] mt-2 w-[360px] overflow-hidden rounded-[8px] border border-[#3A3A3A] bg-[#2B2B2B] text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          {/* the active character */}
          <div className="flex items-center gap-4 px-5 pb-4 pt-5">
            <Avatar p={profile} size={64} />
            <div className="flex min-w-0 flex-1 flex-col leading-[1.35]">
              <span className="truncate text-[16px] font-semibold">{profile.name}</span>
              <span className="truncate text-[13px] text-white/80">{profile.rank}</span>
              <span className="truncate text-[12px] text-white/60">
                {profile.station}
                {profile.position ? ` · ${profile.position}` : ''}
              </span>
              <span className="truncate text-[12px] text-white/60">
                {profile.agencyShort} · {profile.badgeNumber}
              </span>
            </div>
          </div>
          <div className="mx-5 truncate rounded-[6px] bg-white/[0.05] px-3 py-2 text-[12px] text-white/70" title={profile.agencyName}>
            {profile.agencyName}
          </div>

          {/* switch */}
          <div className="mt-3 border-t border-[#3A3A3A] px-2 pb-1 pt-2">
            <div className="px-3 pb-1 pt-1 text-[12px] font-semibold text-white/60">Сменить персонажа</div>
            {others.map((p) => (
              <button
                key={p.id}
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => void pick(p.id)}
                className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2 text-left hover:bg-white/[0.06] disabled:opacity-60"
              >
                <Avatar p={p} size={36} />
                <span className="flex min-w-0 flex-1 flex-col leading-[1.3]">
                  <span className="truncate text-[13px] font-semibold">{p.name}</span>
                  <span className="truncate text-[12px] text-white/60">
                    {p.rank} · {p.agencyShort}
                  </span>
                  <span className="truncate text-[11px] text-white/45">{p.station}</span>
                </span>
              </button>
            ))}
            {windows.length > 0 ? <div className="px-3 pb-1 pt-1 text-[11px] leading-[15px] text-white/45">При смене персонажа открытые окна закроются — черновики сохранятся.</div> : null}
          </div>

          {/* footer */}
          <div className="flex items-center gap-2 border-t border-[#3A3A3A] bg-[#252525] px-4 py-3">
            {confirmLogout ? (
              <>
                <span className="flex-1 text-[12px] leading-[16px] text-white/80">Выйти? Все окна будут закрыты.</span>
                <button type="button" autoFocus onClick={() => void logOut()} className="h-8 rounded-[6px] bg-[#C42B1C] px-3 text-[13px] font-semibold text-white hover:brightness-110">
                  Выйти
                </button>
                <button type="button" onClick={() => setConfirmLogout(false)} className="h-8 rounded-[6px] bg-white/[0.08] px-3 text-[13px] hover:bg-white/[0.12]">
                  Отмена
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-[12px] text-white/45">SALETS MDT</span>
                <button type="button" onClick={() => setConfirmLogout(true)} className="flex h-8 items-center gap-2 rounded-[6px] px-3 text-[13px] text-white/85 hover:bg-white/[0.08]">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 4H4.5A1.5 1.5 0 003 5.5v9A1.5 1.5 0 004.5 16H8M13 6.5L16.5 10 13 13.5M16.5 10H8" />
                  </svg>
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
