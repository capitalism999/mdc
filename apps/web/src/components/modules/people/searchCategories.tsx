import type { ReactNode } from 'react'
import type { Person } from '../../../types'
import { BiometricIcon, BusinessIcon, DocumentIcon, NameIcon, PhoneIcon, VehicleIcon, WeaponIcon } from './icons'

export type SearchCategoryId = 'name' | 'phone' | 'weaponSerial' | 'docNumber' | 'vehiclePlate' | 'business' | 'biometric'

export interface SearchCategory {
  id: SearchCategoryId
  label: string
  placeholder: string
  icon: ReactNode
  match: (person: Person, query: string) => boolean
}

/**
 * The seven ways an officer can look someone up (see reference screenshot
 * from the MDT spec) — most real stops don't start with a name, so phone/
 * document/weapon/vehicle/business/biometric lookups all resolve back to
 * the same `Person` record.
 */
export const SEARCH_CATEGORIES: SearchCategory[] = [
  {
    id: 'name',
    label: 'Имя фамилия',
    placeholder: 'Введите имя и фамилию',
    icon: <NameIcon />,
    match: (p, q) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q),
  },
  {
    id: 'docNumber',
    label: 'Номер ID/DOC документа',
    placeholder: 'Введите номер документа',
    icon: <DocumentIcon />,
    match: (p, q) => p.idNumber.toLowerCase().includes(q) || p.driverLicense.number.toLowerCase().includes(q),
  },
  {
    id: 'phone',
    label: 'Номер телефона',
    placeholder: 'Введите номер телефона',
    icon: <PhoneIcon />,
    match: (p, q) => p.phone.toLowerCase().includes(q),
  },
  {
    id: 'vehiclePlate',
    label: 'Номер транспорта',
    placeholder: 'Введите гос. номер',
    icon: <VehicleIcon />,
    match: (p, q) => p.vehicles.some((v) => v.plate.toLowerCase().includes(q)),
  },
  {
    id: 'weaponSerial',
    label: 'Серийный номер оружия',
    placeholder: 'Введите серийный номер',
    icon: <WeaponIcon />,
    match: (p, q) => p.weapons.some((w) => w.serial.toLowerCase().includes(q)),
  },
  {
    id: 'business',
    label: 'Название бизнеса или номер ERN',
    placeholder: 'Введите название или ERN',
    icon: <BusinessIcon />,
    match: (p, q) => p.businesses.some((b) => b.name.toLowerCase().includes(q) || b.ern.toLowerCase().includes(q)),
  },
  {
    id: 'biometric',
    label: 'Биометрический идентификатор',
    placeholder: 'Введите идентификатор',
    icon: <BiometricIcon />,
    match: (p, q) => p.biometricId.toLowerCase().includes(q),
  },
]
