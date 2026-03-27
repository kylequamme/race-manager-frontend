import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Grid } from '@mui/material'
import './globals.css'

import Navbar from './navbar'

const roboto = Roboto({
  weight: '500',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Race Manager Frontend',
  description: 'Powered by nextjs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className={roboto.className}>
      <body className={roboto.className}>
        <Grid container spacing={2}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <Navbar />
            {children}
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </body>
    </html>
  )
}
