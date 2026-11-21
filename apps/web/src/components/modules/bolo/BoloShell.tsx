/* Generated 1:1 from the design reference (project/BOLO.dc.html) — markup, styles and copy are a literal port. */
import { type BoloVals } from './boloRuntime'
import { BoloSidebar } from './BoloSidebar'
import { BoloFeed } from './BoloFeed'
import { BoloMapView, BoloPicker } from './BoloMapView'
import { BoloPoster } from './BoloPoster'
import { BoloNew } from './BoloNew'
import { BoloCloseDialog, BoloIncoming, BoloSeenDialog, BoloToast, BoloUpdateDialog } from './BoloDialogs'

export function BoloShell({ $v }: { $v: BoloVals }) {
  return (
    <>
      <BoloSidebar $v={$v} />
      <main style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", position: "static" }}>
        <div style={{ height: "40px", flexShrink: "0", display: "flex", justifyContent: "flex-end" }}></div>
        <BoloFeed $v={$v} />
        <BoloMapView $v={$v} />
        <BoloPoster $v={$v} />
        <BoloNew $v={$v} />
        <BoloPicker $v={$v} />
        <BoloSeenDialog $v={$v} />
        <BoloUpdateDialog $v={$v} />
        <BoloCloseDialog $v={$v} />
        <BoloIncoming $v={$v} />
        <BoloToast $v={$v} />
      </main>
    </>
  )
}
