from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import json
from typing import List, Optional
import os

app = FastAPI(title="E-commerce Mayorista API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class Producto(BaseModel):
    id: int
    nombre: str
    precio: float
    descripcion: str
    imagen_url: str
    categoria: str

class PedidoRequest(BaseModel):
    nombre: str
    telefono: str
    producto_id: int
    producto_nombre: str
    cantidad: int
    comentarios: Optional[str] = ""

class PedidoResponse(BaseModel):
    id: int
    mensaje: str

# Inicializar base de datos
def init_db():
    conn = sqlite3.connect('ecommerce.db')
    cursor = conn.cursor()
    
    # Crear tabla productos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            descripcion TEXT,
            imagen_url TEXT,
            categoria TEXT
        )
    ''')
    
    # Crear tabla pedidos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            producto_id INTEGER,
            producto_nombre TEXT,
            cantidad INTEGER,
            comentarios TEXT,
            fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insertar productos de ejemplo si no existen
    cursor.execute('SELECT COUNT(*) FROM productos')
    if cursor.fetchone()[0] == 0:
        productos_ejemplo = [
            (
                "Gorro de Invierno Unicornio",
                2500.00,
                "Gorro térmico para niñas con diseño de unicornio. Tallas 2-8 años. Material: acrílico suave.",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
                "Gorros"
            ),
            (
                "Gorro Polar Dinosaurio",
                2200.00,
                "Gorro polar con orejas de dinosaurio. Perfecto para niños aventureros. Tallas 3-10 años.",
                "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop",
                "Gorros"
            ),
            (
                "Gorro Navideño Reno",
                1800.00,
                "Gorro festivo con diseño de reno navideño. Ideal para las fiestas. Talla única.",
                "https://images.unsplash.com/photo-1544473244-f6895e69ad8b?w=400&h=400&fit=crop",
                "Gorros"
            ),
            (
                "Gorro Térmico Oso Panda",
                2300.00,
                "Gorro de invierno súper suave con diseño de oso panda. Material hipoalergénico.",
                "https://images.unsplash.com/photo-1578761499019-d9d4b2a9c18e?w=400&h=400&fit=crop",
                "Gorros"
            ),
            (
                "Gorro Reversible Astronauta",
                2800.00,
                "Gorro reversible con diseño espacial. Un lado astronauta, otro lado galaxia. Novedad!",
                "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop",
                "Gorros"
            )
        ]
        
        cursor.executemany(
            'INSERT INTO productos (nombre, precio, descripcion, imagen_url, categoria) VALUES (?, ?, ?, ?, ?)',
            productos_ejemplo
        )
    
    conn.commit()
    conn.close()

# Inicializar DB al arrancar
init_db()

@app.get("/")
def read_root():
    return {"mensaje": "API E-commerce Mayorista funcionando correctamente"}

@app.get("/productos", response_model=List[Producto])
def get_productos():
    """Obtener todos los productos del catálogo"""
    try:
        conn = sqlite3.connect('ecommerce.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, nombre, precio, descripcion, imagen_url, categoria FROM productos')
        rows = cursor.fetchall()
        
        productos = []
        for row in rows:
            productos.append(Producto(
                id=row[0],
                nombre=row[1],
                precio=row[2],
                descripcion=row[3],
                imagen_url=row[4],
                categoria=row[5]
            ))
        
        conn.close()
        return productos
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos: {str(e)}")

@app.post("/pedidos", response_model=PedidoResponse)
def crear_pedido(pedido: PedidoRequest):
    """Crear un nuevo pedido"""
    try:
        conn = sqlite3.connect('ecommerce.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO pedidos (nombre, telefono, producto_id, producto_nombre, cantidad, comentarios)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            pedido.nombre,
            pedido.telefono,
            pedido.producto_id,
            pedido.producto_nombre,
            pedido.cantidad,
            pedido.comentarios
        ))
        
        pedido_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return PedidoResponse(
            id=pedido_id,
            mensaje=f"Pedido #{pedido_id} registrado correctamente. Nos contactaremos pronto!"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear pedido: {str(e)}")

@app.get("/pedidos")
def get_pedidos():
    """Obtener todos los pedidos (para uso interno)"""
    try:
        conn = sqlite3.connect('ecommerce.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, nombre, telefono, producto_nombre, cantidad, comentarios, fecha_pedido
            FROM pedidos ORDER BY fecha_pedido DESC
        ''')
        rows = cursor.fetchall()
        
        pedidos = []
        for row in rows:
            pedidos.append({
                "id": row[0],
                "nombre": row[1],
                "telefono": row[2],
                "producto_nombre": row[3],
                "cantidad": row[4],
                "comentarios": row[5],
                "fecha_pedido": row[6]
            })
        
        conn.close()
        return {"pedidos": pedidos}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener pedidos: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
