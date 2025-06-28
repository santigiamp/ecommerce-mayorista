'use client'

import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import OrderForm from './components/OrderForm'

interface Producto {
  id: number
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string
  categoria: string
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)

  // URL del backend - cambiar por la URL de producción cuando se despliegue
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/productos`)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }
      
      const data = await response.json()
      setProductos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching productos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (producto: Producto) => {
    setSelectedProduct(producto)
    setShowOrderForm(true)
  }

  const handleCloseOrderForm = () => {
    setShowOrderForm(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando productos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <h3 className="font-bold">Error al cargar productos</h3>
          <p>{error}</p>
          <button 
            onClick={fetchProductos}
            className="mt-2 btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 rounded-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Catálogo Mayorista 2025
        </h2>
        <p className="text-xl mb-6 text-blue-100 max-w-2xl mx-auto">
          Descubre nuestra selección de productos de temporada. 
          Precios especiales para revendedores.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://wa.me/5491123456789?text=Hola,%20quiero%20información%20sobre%20precios%20mayoristas"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp justify-center"
          >
            <span className="text-xl">📱</span>
            Consultar por WhatsApp
          </a>
          <button
            onClick={() => setShowOrderForm(true)}
            className="btn-secondary"
          >
            📋 Hacer Pedido Personalizado
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Nuestros Productos
        </h3>
        
        {productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onOrderClick={() => handleOrderClick(producto)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="mt-16 bg-gray-100 py-12 px-6 rounded-2xl text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          ¿Necesitas más información?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Somos mayoristas con más de 10 años de experiencia. 
          Ofrecemos precios competitivos y entregas rápidas en todo el país.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:ventas@jugueteriamayorista.com"
            className="btn-primary"
          >
            📧 Contactar por Email
          </a>
          <a 
            href="tel:+5491123456789"
            className="btn-secondary"
          >
            📞 Llamar Ahora
          </a>
        </div>
      </section>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          producto={selectedProduct}
          onClose={handleCloseOrderForm}
          apiUrl={API_URL}
        />
      )}
    </div>
  )
}