import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bella Fashion - Women\'s Clothing & Fashion',
  description: 'Discover the latest trends in women\'s fashion. Quality clothing, fast shipping, and exceptional service. Shop dresses, tops, bottoms, and accessories.',
  keywords: 'women fashion, clothing, dresses, tops, bottoms, outerwear, accessories, dropshipping',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}