import { useEffect, useRef, useState } from 'react'
import { getAccounts } from '../../lib/endpoints/profile'
import type { OfficerProfile } from '../../types'

/**
 * Badge + rank/name button, right-aligned in the header. Clicking it opens
 * a dropdown to switch between accounts already signed into this client,
 * add another account, or log out. Loads accounts through
 * `lib/endpoints/profile.ts` (mock data until a real backend/NUI config is
 * wired in).
 */
export function UserProfile() {
  const [accounts, setAccounts] = useState<OfficerProfile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newBadge, setNewBadge] = useState('')
  const [newName, setNewName] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getAccounts().then((list) => {
      setAccounts(list)
      setActiveId((current) => current ?? list[0]?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsAdding(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const profile = accounts.find((a) => a.id === activeId)
  if (!profile) return null

  function selectAccount(id: string) {
    setActiveId(id)
    setIsOpen(false)
    setIsAdding(false)
  }

  function confirmAddAccount() {
    if (!newBadge.trim() || !newName.trim()) return
    const account: OfficerProfile = {
      id: `account-${Date.now()}`,
      badgeNumber: newBadge.trim(),
      rank: 'Deputy Sheriff',
      name: newName.trim(),
    }
    setAccounts((prev) => [...prev, account])
    setActiveId(account.id)
    setNewBadge('')
    setNewName('')
    setIsAdding(false)
    setIsOpen(false)
  }

  function logOut() {
    window.location.reload()
  }

  const menuItemCls = (isActive: boolean) =>
    `flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left text-[13px] hover:bg-ink/10 ${
      isActive ? 'bg-[#48adec]/15 text-[#48adec]' : 'text-ink/80'
    }`

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open)
          setIsAdding(false)
        }}
        className="flex h-[54px] items-center gap-1.5 overflow-hidden rounded-[6px] bg-ink/5 px-3.5"
      >
        <div className="flex flex-col items-start gap-1 text-[12px]">
          <span className="font-semibold leading-[12px] text-ink">{profile.badgeNumber}</span>
          <div className="flex flex-col items-start leading-[1.3] text-ink/70">
            <span>{profile.rank}</span>
            <span>{profile.name}</span>
          </div>
        </div>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`h-2.5 w-2.5 shrink-0 text-ink transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M4.6575 8.15375C4.69573 8.20927 4.74687 8.25466 4.80654 8.28602C4.8662 8.31738 4.9326 8.33376 5 8.33376C5.0674 8.33376 5.1338 8.31738 5.19346 8.28602C5.25313 8.25466 5.30427 8.20927 5.3425 8.15375L9.0925 2.73708C9.13591 2.67461 9.16136 2.60143 9.1661 2.5255C9.17083 2.44957 9.15467 2.3738 9.11937 2.30641C9.08407 2.23903 9.03097 2.1826 8.96585 2.14327C8.90073 2.10394 8.82607 2.08321 8.75 2.08333H1.25C1.1741 2.08365 1.09972 2.10464 1.03487 2.14407C0.97001 2.18349 0.917126 2.23985 0.881904 2.30708C0.846681 2.37431 0.830452 2.44987 0.834962 2.52564C0.839472 2.6014 0.86455 2.67451 0.9075 2.73708L4.6575 8.15375Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-[260px] rounded-[6px] border border-ink/10 bg-bg-chrome-2 p-1 shadow-lg">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => selectAccount(account.id)}
              className={menuItemCls(account.id === activeId)}
            >
              <div className="flex flex-1 flex-col items-start leading-[1.3]">
                <span className="font-semibold">{account.badgeNumber} · {account.name}</span>
                <span className="text-ink/50">{account.rank}</span>
              </div>
              {account.id === activeId && <span className="text-[#48adec]">✓</span>}
            </button>
          ))}

          <div className="my-1 h-px bg-ink/10" />

          {isAdding ? (
            <div className="flex flex-col gap-1.5 px-2 py-1.5">
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="Номер жетона"
                className="rounded-[4px] border border-ink/10 bg-ink/5 px-2 py-1 text-[13px] text-ink placeholder:text-ink/40 focus:outline-none"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Имя"
                className="rounded-[4px] border border-ink/10 bg-ink/5 px-2 py-1 text-[13px] text-ink placeholder:text-ink/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={confirmAddAccount}
                className="rounded-[4px] bg-[#48adec]/15 px-2 py-1 text-[13px] text-[#48adec] hover:bg-[#48adec]/25"
              >
                Добавить
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsAdding(true)} className={menuItemCls(false)}>
              + Добавить аккаунт
            </button>
          )}

          <div className="my-1 h-px bg-ink/10" />

          <button type="button" onClick={logOut} className={`${menuItemCls(false)} text-[#ff8ba0]`}>
            Выйти из аккаунта
          </button>
        </div>
      )}
    </div>
  )
}
