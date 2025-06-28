interface Producto {
  id: number
  nombre: string
  precio: number
  descripcion: string
  imagen_url: string
  categoria: string
}

interface ProductCardProps {
  producto: Producto
  onOrderClick: () => void
}

export default function ProductCard({ producto, onOrderClick }: ProductCardProps) {
  // Formatear precio en pesos argentinos
  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  // Generar mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    const message = `Hola! Me interesa el producto: ${producto.nombre} - ${formatPrice(producto.precio)}. ¿Podrías darme más información?`
    return encodeURIComponent(message)
  }

  const whatsappUrl = `https://wa.me/5491123456789?text=${generateWhatsAppMessage()}`
  
  // Link de pago (MercadoPago ficticio para el MVP)
  const paymentUrl = `https://mpago.la/1A2B3C4D5E?product=${producto.id}&amount=${producto.precio}`

  return (
    <div className="product-card">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden h-48">
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            // Imagen fallback si no carga la original
            const target = e.target as HTMLImageElement
            target.src = 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Sin+Imagen'
          }}
        />
        
        {/* Badge de categoría */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {producto.categoria}
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h4 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {producto.nombre}
        </h4>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {producto.descripcion}
        </p>
        
        {/* Precio destacado */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(producto.precio)}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            x unidad
          </span>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          {/* Botón WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full justify-center text-sm"
          >
            <span className="text-lg">💬</span>
            Consultar por WhatsApp
          </a>

          {/* Botón Comprar */}
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full text-center text-sm block"
          >
            🛒 Comprar Ahora
          </a>

          {/* Botón Hacer Pedido */}
          <button
            onClick={onOrderClick}
            className="btn-primary w-full text-sm"
          >
            📋 Hacer Pedido
          </button>
        </div>
      </div>
    </div>
  )
}