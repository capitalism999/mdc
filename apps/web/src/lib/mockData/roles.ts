import type { Role } from '../../types'

/** Role/permission reference table — data only, not enforced by any UI
 * check in this prototype (there is no authentication system). */
export const mockRoles: Role[] = [
  {
    id: 'role1',
    name: 'Patrol Officer',
    description: 'Базовый доступ: Люди, DMV, Оружие, BOLO, Вызовы, Рапорты (черновики).',
    permissions: ['people.read', 'dmv.read', 'weapons.read', 'bolo.read', 'calls.read', 'reports.write'],
  },
  {
    id: 'role2',
    name: 'Detective',
    description: 'Доступ уровня патрульного плюс Дела, Ордера, Экспертизы, SangGang.',
    permissions: ['cases.write', 'warrants.write', 'forensics.read', 'sanggang.read'],
  },
  {
    id: 'role3',
    name: 'Forensics Technician',
    description: 'Доступ к Экспертизам (вещдоки и анализы) и чтение Дел.',
    permissions: ['forensics.write', 'cases.read'],
  },
  {
    id: 'role4',
    name: 'Administrator',
    description: 'Полный доступ ко всем модулям, включая Личный состав, Роли и Аудит-лог.',
    permissions: ['admin.write', '*'],
  },
]
