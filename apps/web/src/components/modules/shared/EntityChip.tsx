import type { ReactNode } from 'react'
import { ArrestIcon, VehicleIcon, WantedIcon, WarrantIcon, WeaponIcon, AssociateIcon } from '../people/icons'
import { useEntityNavigation, type EntityType } from '../../../windows/useEntityNavigation'
import {
  CaseIcon,
  DispatchIcon,
  EvidenceIcon,
  ForensicsIcon,
  GangIcon,
  OfficerIcon,
  PenalCodeIcon,
  ReportIcon,
} from './entityIcons'

const ENTITY_ICON: Record<EntityType, ReactNode> = {
  person: <AssociateIcon />,
  vehicle: <VehicleIcon />,
  weapon: <WeaponIcon />,
  case: <CaseIcon />,
  report: <ReportIcon />,
  warrant: <WarrantIcon />,
  bolo: <WantedIcon />,
  arrest: <ArrestIcon />,
  evidence: <EvidenceIcon />,
  forensicAnalysis: <ForensicsIcon />,
  officer: <OfficerIcon />,
  gang: <GangIcon />,
  penalCode: <PenalCodeIcon />,
  dispatchCall: <DispatchIcon />,
}

interface EntityChipProps {
  type: EntityType
  id: string
  label: string
  sublabel?: string
}

/**
 * The universal "provaliться" cross-link — renders an icon + label that
 * opens the referenced entity's own window/card on click (see
 * `useEntityNavigation`). Used everywhere one entity references another:
 * a person's vehicles/weapons/arrests/warrants, a report's attachments, a
 * case's linked records, etc.
 */
export function EntityChip({ type, id, label, sublabel }: EntityChipProps) {
  const openEntity = useEntityNavigation()
  return (
    <button
      type="button"
      onClick={() => openEntity(type, id, label)}
      className="flex items-center gap-2 rounded-[6px] px-1 py-0.5 text-left text-[13px] hover:bg-ink/10"
    >
      <span className="shrink-0 text-ink/40">{ENTITY_ICON[type]}</span>
      <span className="truncate text-[#48adec]">{label}</span>
      {sublabel && <span className="truncate text-ink/40">{sublabel}</span>}
    </button>
  )
}
