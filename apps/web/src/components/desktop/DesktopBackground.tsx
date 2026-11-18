/**
 * Decorative backdrop behind the app grid: two rotated/skewed gradient
 * ellipses, the ghost "SALETS MDT 1.0" watermark text, and the large
 * sheriff-badge illustration, matching the Figma "ФОН" (background) group
 * (node 8056:290). The gradient ellipses are anchored from the container's
 * top-left corner (0,0), which works at any container size since that
 * origin always exists. The badge is anchored to the right edge, vertically
 * centered (top: 50% + translateY -50%). The watermark text is anchored
 * independently to the bottom-right corner, matching the Figma layout
 * (badge centered, caption tucked in the corner below it — not stacked
 * directly under the badge). Both scale with the viewport (clamped between
 * a floor and the Figma-designed size) so they shrink on smaller screens
 * instead of overlapping the app icon grid on the left.
 */
export function DesktopBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-bg-app">
      <div
        className="absolute flex items-center justify-center"
        style={{ left: -381, top: -1098, width: 3875.757, height: 2913.924 }}
      >
        <div
          className="shrink-0"
          style={{ transform: 'rotate(32.75deg) scaleY(0.95) skewX(-18.58deg)' }}
        >
          <div className="relative" style={{ width: 1421.579, height: 3432.76 }}>
            <div className="absolute" style={{ inset: '-8.74% -21.1%' }}>
              <img src="/assets/icons/bg-ellipse-1.svg" alt="" className="block h-full w-full max-w-none" />
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 61.02, top: -27.53, width: 2449.553, height: 1843.449 }}
      >
        <div
          className="shrink-0"
          style={{ transform: 'rotate(32.75deg) scaleY(0.95) skewX(-18.58deg)' }}
        >
          <div className="relative" style={{ width: 884.903, height: 2184.18 }}>
            <div className="absolute" style={{ inset: '-13.74% -33.9%' }}>
              <img src="/assets/icons/bg-ellipse-2.svg" alt="" className="block h-full w-full max-w-none" />
            </div>
          </div>
        </div>
      </div>
      <img
        src="/assets/images/sheriff-badge.png"
        alt=""
        className="absolute top-1/2 object-contain -translate-y-1/2"
        style={{ right: 'clamp(24px, 5vw, 96px)', width: 'clamp(160px, min(26vw, 32vh), 534px)', height: 'auto' }}
      />
      <span
        className="absolute whitespace-nowrap"
        style={{
          color: 'color-mix(in srgb, var(--color-ink) 20%, transparent)',
          right: 'clamp(24px, 7vw, 150px)',
          bottom: 'clamp(16px, 5vh, 58px)',
          fontFamily: '"Segoe UI", sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(18px, 2.5vw, 48px)',
        }}
      >
        SALETS MDT 1.0
      </span>
    </div>
  )
}
