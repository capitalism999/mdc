/** Icons per place type, used on map pins, in the places list, legend, type
 * picker and the place card header: дом — жильё, прицел — место
 * преступления, лупа — находка, глаз — замечен, реплика — показания. */
const PATHS: Record<string, React.ReactNode> = {
  home: <path d="M3 9.5L10 3.5l7 6V17h-4.5v-4.5h-5V17H3z" />,
  crime: (
    <>
      <circle cx="10" cy="10" r="5.5" />
      <path d="M10 1.5v4M10 14.5v4M1.5 10h4M14.5 10h4" />
    </>
  ),
  find: (
    <>
      <circle cx="8.5" cy="8.5" r="5" />
      <path d="M12.3 12.3L17.5 17.5" />
    </>
  ),
  seen: (
    <>
      <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" />
      <circle cx="10" cy="10" r="2.5" />
    </>
  ),
  witness: <path d="M3 3.5h14v9.5H9.5L5 16.5V13H3z" />,
  other: <circle cx="10" cy="10" r="3" fill="currentColor" />,
}

export function PlaceTypeIcon({ type, size = 14, className = '', strokeWidth = 2 }: { type?: string; size?: number; className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[type ?? 'other'] ?? PATHS.other}
    </svg>
  )
}
