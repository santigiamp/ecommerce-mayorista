# 🧸 E-commerce Mayorista MVP

MVP completo de tienda online mayorista desarrollado con Next.js y FastAPI. Diseñado para mostrar catálogo de productos y facilitar pedidos por WhatsApp y links de pago.

## 🚀 Características

- **Catálogo de productos** con imágenes, precios y descripciones
- **Botones de WhatsApp** para consultas directas por producto
- **Links de pago** integrados (MercadoPago compatible)
- **Formulario de pedidos** con envío a backend
- **Diseño responsive** optimizado para móviles
- **API REST** completa con FastAPI
- **Base de datos SQLite** para simplicidad del MVP

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con TypeScript
- **Tailwind CSS** para estilos
- **React Hooks** para estado
- **Responsive design** mobile-first

### Backend
- **FastAPI** con Python
- **SQLite** como base de datos
- **Pydantic** para validación
- **CORS** habilitado

## 📁 Estructura del Proyecto

```
ecommerce-mayorista/
├── frontend/                 # Aplicación Next.js
│   ├── app/
│   │   ├── components/      # Componentes React
│   │   ├── globals.css      # Estilos globales
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página principal
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
├── backend/                  # API FastAPI
│   ├── main.py              # Aplicación principal
│   ├── requirements.txt     # Dependencias Python
│   └── Dockerfile
├── docker-compose.yml       # Orquestación completa
├── .env.example            # Variables de entorno
└── README.md
```

## 🏃‍♂️ Instalación y Ejecución Local

### Prerequisitos
- Node.js 18+ 
- Python 3.11+
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd ecommerce-mayorista
```

### 2. Configurar Backend (FastAPI)
```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

El backend estará disponible en: http://localhost:8000

### 3. Configurar Frontend (Next.js)
```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# Crear archivo de entorno
cp ../.env.example .env.local

# Ejecutar aplicación
npm run dev
```

El frontend estará disponible en: http://localhost:3000

## 🐳 Ejecución con Docker

### Opción 1: Docker Compose (Recomendado)
```bash
# Ejecutar toda la aplicación
docker-compose up --build

# En segundo plano
docker-compose up -d --build
```

### Opción 2: Contenedores individuales
```bash
# Backend
cd backend
docker build -t ecommerce-backend .
docker run -p 8000:8000 ecommerce-backend

# Frontend  
cd frontend
docker build -t ecommerce-frontend .
docker run -p 3000:3000 ecommerce-frontend
```

## 🌐 Despliegue en Producción

### Backend en Render/Railway

1. **Crear cuenta** en [Render](https://render.com) o [Railway](https://railway.app)

2. **Conectar repositorio** y seleccionar carpeta `backend/`

3. **Configurar variables de entorno:**
   ```
   PORT=8000
   DATABASE_URL=sqlite:///ecommerce.db
   ```

4. **Comando de build:** `pip install -r requirements.txt`

5. **Comando de start:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend en Vercel

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Desde la carpeta frontend:**
   ```bash
   cd frontend
   vercel
   ```

3. **Configurar variable de entorno en Vercel:**
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend-url.onrender.com
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Configuración de Dominio Personalizado

```bash
# En Vercel
vercel domains add tu-dominio.com

# Configurar DNS
# A record: @ -> 76.76.19.61
# CNAME: www -> cname.vercel-dns.com
```

## 🔧 Configuración

### Variables de Entorno

Copiar `.env.example` y configurar:

```bash
# Backend
PORT=8000
DATABASE_URL=sqlite:///ecommerce.db

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# WhatsApp (cambiar por número real)
WHATSAPP_NUMBER=5491123456789

# Producción
# NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

### Personalización

1. **Productos:** Editar array en `backend/main.py` función `init_db()`
2. **WhatsApp:** Cambiar número en `frontend/app/components/ProductCard.tsx`
3. **Colores:** Modificar `frontend/tailwind.config.js`
4. **Textos:** Editar `frontend/app/page.tsx` y `layout.tsx`

## 📱 Funcionalidades

### Para el Cliente (Mayorista)
- ✅ Catálogo visual de productos
- ✅ Precios mayoristas claros
- ✅ Contacto directo por WhatsApp
- ✅ Links de pago rápidos
- ✅ Formulario de pedidos personalizado

### Para el Administrador
- ✅ API REST para gestionar productos
- ✅ Base de datos de pedidos
- ✅ Endpoint para consultar pedidos
- ✅ Fácil actualización de catálogo

## 🔌 API Endpoints

### Productos
```http
GET /productos
Content-Type: application/json

Response:
[
  {
    "id": 1,
    "nombre": "Gorro Unicornio",
    "precio": 2500.00,
    "descripcion": "Gorro térmico...",
    "imagen_url": "https://...",
    "categoria": "Gorros"
  }
]
```

### Pedidos
```http
POST /pedidos
Content-Type: application/json

Body:
{
  "nombre": "Juan Pérez",
  "telefono": "+54911234567",
  "producto_id": 1,
  "producto_nombre": "Gorro Unicornio",
  "cantidad": 5,
  "comentarios": "Colores variados"
}

Response:
{
  "id": 1,
  "mensaje": "Pedido #1 registrado correctamente"
}
```

```http
GET /pedidos
Content-Type: application/json

Response:
{
  "pedidos": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "telefono": "+54911234567",
      "producto_nombre": "Gorro Unicornio",
      "cantidad": 5,
      "comentarios": "Colores variados",
      "fecha_pedido": "2025-06-28 10:30:00"
    }
  ]
}
```

## 🎨 Personalización Visual

### Colores principales
- **Azul:** `#2563eb` (botones primarios)
- **Verde:** `#059669` (WhatsApp, comprar)
- **Gris:** `#f9fafb` (fondo)

### Tipografía
- **Principal:** Inter (Google Fonts)
- **Tamaños:** Responsive con Tailwind

## 📞 Soporte

### Para modificaciones:
1. **Productos:** Editar base de datos SQLite
2. **Estilos:** Modificar clases Tailwind
3. **Funcionalidades:** Extender API FastAPI

### Contacto
- **WhatsApp:** +54 9 11 1234-5678
- **Email:** soporte@agencia.com

## 📄 Licencia

Proyecto desarrollado como MVP para demostración. 
© 2025 Agencia de Automatización

---

**¿Necesitas modificaciones o nuevas funcionalidades?**
Este MVP es totalmente personalizable y escalable. ¡Contactanos para evolucionar tu tienda online!