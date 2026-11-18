import type { Weapon } from '../../types'

/**
 * Weapons registry — authoritative record behind `PersonWeapon.weaponId`
 * and `EntityChip type="weapon"` links.
 */
export const mockWeapons: Weapon[] = [
  {
    id: 'wp1',
    serialNumber: 'WPN-55210',
    weaponType: 'Пистолет',
    make: 'Vom Feuer',
    model: 'Pistol .50',
    caliber: '.50 AE',
    registeredOwnerId: 'p1',
    registeredOwnerName: 'Michael De Santa',
    registrationStatus: 'Зарегистрировано',
    stolenFlag: false,
    seizedFlag: false,
  },
  {
    id: 'wp2',
    serialNumber: 'WPN-20144',
    weaponType: 'Пистолет-пулемёт',
    make: 'Vom Feuer',
    model: 'SMG',
    caliber: '9x19mm',
    registeredOwnerId: 'p3',
    registeredOwnerName: 'Lamar Davis',
    registrationStatus: 'Не зарегистрировано',
    stolenFlag: false,
    seizedFlag: true,
    seizedInArrestId: 'ar3',
  },
  {
    id: 'wp3',
    serialNumber: 'WPN-70011',
    weaponType: 'Пистолет',
    make: 'Vom Feuer',
    model: 'Pistol (служебное)',
    caliber: '9x19mm',
    registeredOwnerId: 'p5',
    registeredOwnerName: 'Thorne Watts',
    registrationStatus: 'Зарегистрировано',
    stolenFlag: false,
    seizedFlag: false,
  },
  {
    id: 'wp4',
    serialNumber: 'WPN-10893',
    weaponType: 'Дробовик',
    make: 'Bodhi',
    model: 'Shotgun',
    caliber: '12 gauge',
    registeredOwnerName: 'Неизвестен',
    registrationStatus: 'Не зарегистрировано',
    stolenFlag: true,
    seizedFlag: false,
  },
]
