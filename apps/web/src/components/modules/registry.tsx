import type { ComponentType } from 'react'
import { AdminApp } from './admin/AdminApp'
import { ArrestsApp } from './arrests/ArrestsApp'
import { BoloApp } from './bolo/BoloApp'
import { CallsApp } from './calls/CallsApp'
import { CasesApp } from './cases/CasesApp'
import { ForensicsApp } from './forensics/ForensicsApp'
import { FtpApp } from './ftp/FtpApp'
import { LawsApp } from './laws/LawsApp'
import { MailApp } from './mail/MailApp'
import { MailComposeWindow } from './mail/MailComposeWindow'
import { NotesApp } from './notes/NotesApp'
import { ReportsApp } from './reports/ReportsApp'
import { SangGangApp } from './sanggang/SangGangApp'
import { SearchApp } from './search/SearchApp'
import { WarrantsApp } from './warrants/WarrantsApp'

/**
 * Maps an app tile's id (see `data/apps.ts`) to the component rendered
 * inside its `AppWindow` content pane. Modules without an entry here still
 * open a window, just with an empty content pane until they're built out.
 */
export interface ModuleContentProps {
  windowId: string
  initialParams?: Record<string, unknown>
}

export const moduleContent: Record<string, ComponentType<ModuleContentProps>> = {
  search: SearchApp,
  mail: MailApp,
  'mail-compose': MailComposeWindow,
  ftp: FtpApp,
  laws: LawsApp,
  warrants: WarrantsApp,
  bolo: BoloApp,
  arrests: ArrestsApp,
  calls: CallsApp,
  reports: ReportsApp,
  forensics: ForensicsApp,
  cases: CasesApp,
  sanggang: SangGangApp,
  notes: NotesApp,
  admin: AdminApp,
}
