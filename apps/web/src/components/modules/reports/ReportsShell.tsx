/* Generated 1:1 from the design reference (project/Reports.dc.html) — markup, styles and copy are a literal port. */
import { type ReportsVals } from './reportsRuntime'
import { ReportsSidebar } from './ReportsSidebar'
import { ReportsList, ReportsToast } from './ReportsList'
import { ReportsNew } from './ReportsNew'
import { ReportsTypes } from './ReportsTypes'
import { ReportsBuilder } from './ReportsBuilder'
import { ReportsPaper } from './ReportsPaper'

export function ReportsShell({ $v }: { $v: ReportsVals }) {
  return (
    <>
      <ReportsSidebar $v={$v} />
      <main style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ height: "40px", flexShrink: "0", display: "flex", justifyContent: "flex-end" }}></div>
        <ReportsList $v={$v} />
        <ReportsNew $v={$v} />
        <ReportsTypes $v={$v} />
        <ReportsBuilder $v={$v} />
        <ReportsPaper $v={$v} />
        <ReportsToast $v={$v} />
      </main>
    </>
  )
}
