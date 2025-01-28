import type { Metadata } from 'next'
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Shalo',
  description: 'A hub for developers to discover and share resources',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gray-900 text-gray-100`}
      >
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

