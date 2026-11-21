import { toJpeg } from 'html-to-image'

/** A4 in PDF points. */
const A4_W = 595.28
const A4_H = 841.89

function dataUrlBytes(url: string): Uint8Array {
  const bin = atob(url.slice(url.indexOf(',') + 1))
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function imageSize(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}

/** One A4 page with one full-bleed JPEG on it (the image keeps its aspect ratio, centred). */
function jpegPdf(jpeg: Uint8Array, w: number, h: number, title: string): Blob {
  const scale = Math.min(A4_W / w, A4_H / h)
  const dw = w * scale
  const dh = h * scale
  const dx = (A4_W - dw) / 2
  const dy = (A4_H - dh) / 2
  const content = `q ${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${dx.toFixed(2)} ${dy.toFixed(2)} cm /Im0 Do Q`
  // PDF text strings: keep the title ASCII-safe (the file name carries the rest)
  const safeTitle = title.replace(/[^\x20-\x7e]/g, '').replace(/[()\\]/g, '')

  const enc = new TextEncoder()
  const parts: Uint8Array[] = []
  const offsets: number[] = []
  let length = 0
  const push = (chunk: Uint8Array | string) => {
    const bytes = typeof chunk === 'string' ? enc.encode(chunk) : chunk
    parts.push(bytes)
    length += bytes.length
  }
  const obj = (n: number, body: string) => {
    offsets[n] = length
    push(`${n} 0 obj\n${body}\nendobj\n`)
  }

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>')
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_W} ${A4_H}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`)
  offsets[4] = length
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`)
  push(jpeg)
  push('\nendstream\nendobj\n')
  obj(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
  obj(6, `<< /Title (${safeTitle}) /Producer (SALETS MDT) >>`)

  const xref = length
  let table = `xref\n0 7\n0000000000 65535 f \n`
  for (let n = 1; n <= 6; n++) table += `${String(offsets[n]).padStart(10, '0')} 00000 n \n`
  push(table)
  push(`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`)
  return new Blob(parts as BlobPart[], { type: 'application/pdf' })
}

/** Renders one element (a poster sheet) to an A4 PDF, rasterised at print density. */
export async function elementPdfBlob(el: HTMLElement, title: string): Promise<Blob> {
  // ~300 dpi on A4 for a 520 px wide sheet
  const pixelRatio = Math.max(2, Math.round(2480 / Math.max(1, el.offsetWidth)))
  const url = await toJpeg(el, {
    quality: 0.92,
    pixelRatio,
    backgroundColor: '#ffffff',
    cacheBust: false,
    // the on-screen drop shadow is not part of the paper
    style: { boxShadow: 'none', margin: '0', transform: 'none' },
  })
  const { w, h } = await imageSize(url)
  return jpegPdf(dataUrlBytes(url), w, h, title)
}

/** Saves the element as an A4 PDF to the computer — no print dialog. */
export async function downloadElementPdf(el: HTMLElement, fileName: string): Promise<void> {
  const blob = await elementPdfBlob(el, fileName)
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(href), 10_000)
}
