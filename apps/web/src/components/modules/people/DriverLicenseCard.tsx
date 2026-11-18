import type { Person } from '../../../types'
import { getAvatarColor, getInitials } from '../shared/avatar'

interface DriverLicenseCardProps {
  person: Person
}

export function DriverLicenseCard({ person }: DriverLicenseCardProps) {
  const valid = person.driverLicense.status === 'Действительны'

  return (
    <div className="overflow-hidden rounded-[8px] border border-ink/10 bg-bg-chrome-2">
      <div className="flex items-center justify-between border-b border-ink/10 bg-[#48adec]/15 px-3 py-1.5">
        <span className="text-[11px] font-bold tracking-wide text-[#48adec]">STATE OF SAN ANDREAS</span>
        <span className="text-[10px] font-semibold text-ink/50">DRIVER LICENSE</span>
      </div>
      <div className="flex gap-3 p-3">
        {person.photo ? (
          <img src={person.photo} alt="" className="h-16 w-14 shrink-0 rounded-[4px] object-cover" />
        ) : (
          <div
            className="flex h-16 w-14 shrink-0 items-center justify-center rounded-[4px] text-[13px] font-semibold text-ink"
            style={{ backgroundColor: getAvatarColor(person.id) }}
          >
            {getInitials(person.firstName, person.lastName)}
          </div>
        )}
        <div className="min-w-0 flex-1 text-[12px]">
          <p className="truncate font-semibold text-ink">
            {person.firstName} {person.lastName}
          </p>
          <p className="text-ink/50">DOB {person.dob}</p>
          <p className="text-ink/50">№ {person.driverLicense.number}</p>
          <p className={valid ? 'font-medium text-[#3fb97f]' : 'font-medium text-[#ff8ba0]'}>{person.driverLicense.status}</p>
        </div>
      </div>
    </div>
  )
}
