import type { Gang } from '../../types'

/** "SangGang" registry (`mockData/gangs.ts`). */
export const mockGangs: Gang[] = [
  {
    id: 'gang1',
    name: 'Families',
    aliases: ['The Families', 'FAM'],
    status: 'Активна',
    threatLevel: 'Высокий',
    territoryDescription: 'Strawberry, Davis, Chamberlain Hills',
    members: [
      { personId: 'p3', role: 'Активный участник', moniker: 'Lil Lame' },
      { personId: 'p2', role: 'Бывший участник', moniker: 'Franklin' },
    ],
    rivalries: [{ gangId: 'gang2', relationship: 'Война за территорию' }],
    intelEntries: [{ date: '10.11.2026', author: '9F1 Robert Haines', note: 'Замечена повышенная активность в Davis, связана с текущим BOLO.' }],
  },
  {
    id: 'gang2',
    name: 'Ballas',
    aliases: ['Purple Street Kings'],
    status: 'Активна',
    threatLevel: 'Критический',
    territoryDescription: 'East Los Santos, южная часть Strawberry',
    members: [],
    rivalries: [{ gangId: 'gang1', relationship: 'Война за территорию' }],
    intelEntries: [],
  },
]
