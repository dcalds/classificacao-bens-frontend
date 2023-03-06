import './globals.css'
import 'react-responsive-modal/styles.css';
import { Inter } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Classificações de Bens Econômicos',
  description: 'Classificações de Bens Econômicos',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
