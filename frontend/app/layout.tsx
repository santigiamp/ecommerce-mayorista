import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Juguetería Mayorista - Catálogo Online',
  description: 'Catálogo de productos mayoristas - Juguetes y accesorios para niños',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center md:text-left">
              🧸 Juguetería Mayorista
            </h1>
            <p className="text-blue-100 text-center md:text-left">
              Catálogo de productos para revendedores
            </p>
          </div>
        </header>
        
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">
              © 2025 Juguetería Mayorista - Todos los derechos reservados
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Desarrollado por tu Agencia de Automatización
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
