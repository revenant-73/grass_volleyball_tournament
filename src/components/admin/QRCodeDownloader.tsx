'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'

interface QRCodeDownloaderProps {
  url: string
  eventName: string
}

export default function QRCodeDownloader({ url, eventName }: QRCodeDownloaderProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(url, { width: 300, margin: 2 }, (err, dataUrl) => {
      if (err) {
        console.error('Error generating QR code:', err)
        return
      }
      setQrDataUrl(dataUrl)
    })
  }, [url])

  const downloadQR = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qr-code-${eventName.toLowerCase().replace(/ /g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-6">
      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Public QR Code</h3>
      <div className="flex flex-col items-center gap-6">
        <div className="relative p-4 bg-white rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 w-48 h-48 flex items-center justify-center">
          {qrDataUrl ? (
            <div className="relative w-40 h-40">
              <Image src={qrDataUrl} alt="QR Code" fill unoptimized />
            </div>
          ) : (
            <div className="w-40 h-40 bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded-xl" />
          )}
        </div>
        <button
          onClick={downloadQR}
          className="w-full px-6 py-3 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-black rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors uppercase text-xs tracking-widest"
        >
          Download QR
        </button>
        <p className="text-[10px] text-zinc-400 font-bold text-center leading-relaxed">
          Players can scan this to see the live schedule, standings, and results on their phones.
        </p>
      </div>
    </div>
  )
}

