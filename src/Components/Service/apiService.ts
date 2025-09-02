export const API_URL = "https://localhost:7221/api";

// Interfaces para los payloads
interface Categoria {
  uId: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

interface Producto {
  uId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stockActual: number;
  imagenUrl: string | null;
  categoriaId: string;
}

interface Tecnico {
  uId: string;
  nombre: string;
  especialidad: string;
}

interface ServicioTecnico {
  uId: string;
  usuarioId: string;
  tecnicoId: string;
  descripcion: string;
  estado: "Pendiente" | "EnProgreso" | "Completado";
}

interface Inventario {
  uId: string;
  productoId: string;
  cantidad: number;
  fechaActualizacion: string;
  producto?: { nombre: string; stockActual: number };
}

interface Usuario {
  uId: string;
  nombre: string;
  email: string;
}

// -------------------- Categorías --------------------
export const fetchCategorias = async (): Promise<Categoria[]> => {
  const res = await fetch(`${API_URL}/Categoria`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener categorías");
  }
  return res.json();
};

export const addCategoria = async (categoria: {
  nombre: string;
  descripcion: string;
}): Promise<Categoria> => {
  const res = await fetch(`${API_URL}/Categoria`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al agregar categoría");
  }
  return res.json();
};

export const updateCategoria = async (
  id: string,
  categoria: {
    nombre: string;
    descripcion: string;
    estado: boolean;
  }
): Promise<Categoria> => {
  const res = await fetch(`${API_URL}/Categoria/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar categoría");
  }
  return res.json();
};

export const deleteCategoria = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/Categoria/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar categoría");
  }
  return true;
};

// -------------------- Productos --------------------
export const fetchProductos = async (): Promise<Producto[]> => {
  const res = await fetch(`${API_URL}/Producto`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener productos");
  }
  return res.json();
};

export const fetchProductosByCategoria = async (categoriaId: string): Promise<Producto[]> => {
  const res = await fetch(`${API_URL}/Producto/Categoria/${categoriaId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener productos por categoría");
  }
  return res.json();
};

export const addProducto = async (producto: any): Promise<Producto> => {
  let options: RequestInit;

  if (producto instanceof FormData) {
    options = { method: "POST", body: producto };
  } else {
    options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    };
  }

  const res = await fetch(`${API_URL}/Producto`, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al agregar producto");
  }
  return res.json();
};

export const updateProducto = async (
  id: string,
  producto: {
    nombre: string;
    descripcion: string;
    precio: number;
    stockActual: number;
    categoriaId: string;
    imagenUrl: string | null;
  }
): Promise<Producto> => {
  console.log("Updating product with ID:", id, "Payload:", producto); // Debugging
  const res = await fetch(`${API_URL}/Producto/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Update error response:", errorData); // Debugging
    throw new Error(errorData.message || "Error al actualizar producto");
  }
  return res.json();
};

export const deleteProducto = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/Producto/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar producto");
  }
  return true;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("imagenFile", file);

  const res = await fetch(`${API_URL}/Producto/UploadImage`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al subir la imagen");
  }
  return res.json();
};

// -------------------- Técnicos --------------------
export const fetchTecnicos = async (): Promise<Tecnico[]> => {
  const res = await fetch(`${API_URL}/Tecnico`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener técnicos");
  }
  return res.json();
};

export const addTecnico = async (tecnico: {
  nombre: string;
  especialidad: string;
}): Promise<Tecnico> => {
  const res = await fetch(`${API_URL}/Tecnico`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al agregar técnico");
  }
  return res.json();
};

export const updateTecnico = async (
  id: string,
  tecnico: {
    nombre: string;
    especialidad: string;
  }
): Promise<Tecnico> => {
  const res = await fetch(`${API_URL}/Tecnico/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar técnico");
  }
  return res.json();
};

export const deleteTecnico = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/Tecnico/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar técnico");
  }
  return true;
};

// -------------------- Servicios Técnicos --------------------
export const fetchServiciosTecnicos = async (): Promise<ServicioTecnico[]> => {
  const res = await fetch(`${API_URL}/ServicioTecnico`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener servicios técnicos");
  }
  return res.json();
};

export const addServicioTecnico = async (servicio: {
  usuarioId: string;
  tecnicoId: string;
  descripcion: string;
  estado: string;
}): Promise<ServicioTecnico> => {
  const res = await fetch(`${API_URL}/ServicioTecnico`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(servicio),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al agregar servicio técnico");
  }
  return res.json();
};

export const updateServicioTecnico = async (
  id: string,
  servicio: {
    usuarioId: string;
    tecnicoId: string;
    descripcion: string;
    estado: string;
  }
): Promise<ServicioTecnico> => {
  const res = await fetch(`${API_URL}/ServicioTecnico/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(servicio),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar servicio técnico");
  }
  return res.json();
};

export const deleteServicioTecnico = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/ServicioTecnico/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar servicio técnico");
  }
  return true;
};

// -------------------- Usuarios --------------------
export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch(`${API_URL}/Usuario`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener usuarios");
  }
  return res.json();
};

// -------------------- Inventario --------------------
export const fetchInventario = async (): Promise<Inventario[]> => {
  const res = await fetch(`${API_URL}/Inventario`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener inventario");
  }
  const data: Inventario[] = await res.json();
  const productos = await fetchProductos();
  return data.map((inv) => ({
    ...inv,
    producto: productos.find((p) => p.uId === inv.productoId),
  }));
};

export const addInventario = async (inventario: {
  productoId: string;
  cantidad: number;
}): Promise<Inventario> => {
  const res = await fetch(`${API_URL}/Inventario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inventario),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al agregar entrada de inventario");
  }
  const nuevoInv: Inventario = await res.json();
  const productos = await fetchProductos();
  return { ...nuevoInv, producto: productos.find((p) => p.uId === nuevoInv.productoId) };
};

export const updateInventario = async (
  id: string,
  inventario: {
    productoId: string;
    cantidad: number;
  }
): Promise<Inventario> => {
  const res = await fetch(`${API_URL}/Inventario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inventario),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar inventario");
  }
  const invActualizado: Inventario = await res.json();
  const productos = await fetchProductos();
  return { ...invActualizado, producto: productos.find((p) => p.uId === invActualizado.productoId) };
};

export const deleteInventario = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/Inventario/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar entrada de inventario");
  }
  return true;
};