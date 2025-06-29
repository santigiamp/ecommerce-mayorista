'use client'

import { useState } from 'react'

interface Producto {
  id: number
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string
  categoria: string
}

interface OrderFormProps {
  producto: Producto | null
  onClose: () => void
  apiUrl: string
}

interface FormData {
  nombre: string
  telefono: string
  cantidad: number
  comentarios: string
}

export default function OrderForm({ producto, onClose, apiUrl }: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    telefono: '',
    cantidad: 1,
    comentarios: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) || 1 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const pedidoData = {
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.trim(),
        producto_id: producto?.id || 0,
        producto_nombre: producto?.nombre || 'Pedido personalizado',
        cantidad: formData.cantidad,
        comentarios: formData.comentarios.trim()
      }

      const response = await fetch(`${apiUrl}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData)
      })

      if (!response.ok) {
        throw new Error('Error al enviar el pedido')
      }

      const result = await response.json()
      setSuccess(true)
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        telefono: '',
        cantidad: 1,
        comentarios: ''
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const totalPrice = producto ? producto.precio * formData.cantidad : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">
            {producto ? 'Hacer Pedido' : 'Pedido Personalizado'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {success ? (
          /* Success Message */
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h4 className="text-xl font-bold text-green-600 mb-2">
              ¡Pedido Enviado!
            </h4>
            <p className="text-gray-600 mb-6">
              Hemos recibido tu pedido correctamente. 
              Nos pondremos en contacto contigo pronto.
            </p>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Cerrar
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6">
            {/* Producto seleccionado */}
            {producto && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{producto.nombre}</h4>
                    <p className="text-green-600 font-bold">{formatPrice(producto.precio)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="form-label">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Tu nombre y apellido"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ej: +54 9 11 1234-5678"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  max="100"
                  required
                />
              </div>

              {/* Total price */}
              {producto && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="form-label">
                  Comentarios adicionales
                </label>
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleInputChange}
                  className="form-input resize-none"
                  rows={3}
                  placeholder="Información adicional, colores preferidos, etc."
                />
              </div>
            </div>

            {/* Form buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Pedido'
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              * Campos obligatorios. Nos contactaremos contigo para confirmar el pedido.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
