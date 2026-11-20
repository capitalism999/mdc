/** San Andreas licence plate — the same artwork and Dealerplate California
 * font Поиск uses (`.lp` / `.lpm` in `search/search.css`), shared so other
 * modules show plates identically. Sizes: `lg` 120×60 (record header),
 * `md` 78×39 (lists). */
const FONT_FACE = `@font-face{font-family:'Dealerplate California';src:url('/assets/search/fdd301fdb07803c32ff198bc4941a9ae.otf') format('opentype');font-display:swap}`
const PLATE_BG = "url('/assets/search/aeec39e3277b294b2374a61e4c82c77e.png') center/100% 100% no-repeat"
const FONT = "'Dealerplate California', 'Barlow Condensed', 'Arial Narrow', sans-serif"

const SIZES = {
  lg: { w: 120, h: 60, font: 32, radius: 6, shadow: '0 1px 4px rgba(0,0,0,.45)' },
  md: { w: 78, h: 39, font: 20, radius: 4, shadow: '0 1px 3px rgba(0,0,0,.45)' },
}

export function LicensePlate({ plate, size = 'lg' }: { plate: string; size?: keyof typeof SIZES }) {
  const s = SIZES[size]
  return (
    <span role="img" aria-label={`Номер ${plate}`} className="relative block shrink-0" style={{ width: s.w, height: s.h, background: PLATE_BG, borderRadius: s.radius, boxShadow: s.shadow }}>
      <style>{FONT_FACE}</style>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap"
        style={{ left: '4%', right: '4%', top: '36%', height: '56%', fontFamily: FONT, fontSize: s.font, lineHeight: 1, color: '#2C307E', letterSpacing: '.03em' }}
      >
        {plate}
      </span>
    </span>
  )
}

/** Inline text-sized plate chip (Поиск's `.lpi`). */
export function InlinePlate({ plate }: { plate: string }) {
  return (
    <span
      className="inline-block whitespace-nowrap rounded-[3px] bg-white align-baseline"
      style={{ padding: '0 .32em', margin: '0 .05em', color: '#2C307E', boxShadow: 'inset 0 0 0 1px #B8BEC8', fontFamily: FONT, fontSize: '1.12em', lineHeight: 1.3, letterSpacing: '.04em' }}
    >
      <style>{FONT_FACE}</style>
      {plate}
    </span>
  )
}
