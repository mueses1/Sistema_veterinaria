import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:8000/api/v1';
const API_BASE_ORIGIN = 'http://localhost:8000';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
}

const Productos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');

  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const user = useAuthStore((state) => state.user);

  const formatCOP = (value: number) =>
    `COP ${new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    }).format(value)}`;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/products/`);
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (id: string, file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}/image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        console.error('Error subiendo imagen');
        return;
      }
      await fetchProducts();
    } catch (error) {
      console.error('Error subiendo imagen', error);
    } finally {
      setUploadingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !category) return;

    setSaving(true);
    try {
      if (editingProduct) {
        // Modo edición: actualizar producto existente (sin cambiar imagen aquí)
        const res = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
          },
          body: JSON.stringify({
            name,
            price: Number(price),
            stock: Number(stock),
            category,
          }),
        });

        if (!res.ok) {
          console.error('Error actualizando producto');
          return;
        }

        await fetchProducts();
        setShowCreateModal(false);
        setEditingProduct(null);

        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          text: 'Los datos del producto se han actualizado correctamente.',
          confirmButtonColor: '#2563eb',
        });
      } else {
        // Modo creación: crear nuevo producto con imagen opcional
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);
        if (imageFile) {
          formData.append('file', imageFile);
        }

        const res = await fetch(`${API_BASE_URL}/products/with-image`, {
          method: 'POST',
          headers: {
            ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
          },
          body: formData,
        });

        if (!res.ok) {
          console.error('Error creando producto');
          return;
        }

        await fetchProducts();
        setShowCreateModal(false);

        // Alerta de éxito al crear producto
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El nuevo producto se ha registrado correctamente.',
          confirmButtonColor: '#2563eb',
        });
      }

      // Resetear formulario común a ambos casos
      setName('');
      setPrice('');
      setStock('');
      setCategory('');
      setImageFile(null);
    } catch (error) {
      console.error('Error guardando producto', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar este producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
      });
      if (!res.ok) {
        console.error('Error eliminando producto');
        return;
      }
      await fetchProducts();

      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        text: 'El producto se ha eliminado correctamente.',
        confirmButtonColor: '#2563eb',
      });
    } catch (error) {
      console.error('Error eliminando producto', error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Catálogo de Productos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              Administra los productos que aparecen en la página pública. Añade información clara y una imagen atractiva
              para que tus clientes identifiquen rápidamente cada artículo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button
              variant="primary"
              onClick={() => {
                setEditingProduct(null);
                setName('');
                setPrice('');
                setStock('');
                setCategory('');
                setImageFile(null);
                setShowCreateModal(true);
              }}
            >
              Nuevo producto
            </Button>
            <Button
              variant="outline"
              onClick={fetchProducts}
            >
              Recargar
            </Button>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS COMO VISTA PRINCIPAL */}
        <Card className="shadow-xl dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Productos actuales
            </h2>
          </div>

          {loading ? (
            <p className="text-gray-500">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No hay productos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2">Imagen</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Categoría</th>
                    <th className="px-4 py-2">Precio</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-2 align-middle">
                        {p.image_url ? (
                          <img
                            src={`${API_BASE_ORIGIN}${p.image_url}`}
                            alt={p.name}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                        ) : (
                          <label className="text-xs text-blue-500 cursor-pointer">
                            Subir imagen
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                handleUploadImage(p.id, e.target.files?.[0] || null)
                              }
                            />
                          </label>
                        )}
                      </td>

                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.category}</td>
                      <td className="px-4 py-2">{formatCOP(p.price)}</td>
                      <td className="px-4 py-2">{p.stock}</td>

                      <td className="px-4 py-2 text-right space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(p);
                            setName(p.name);
                            setPrice(String(p.price));
                            setStock(String(p.stock));
                            setCategory(p.category);
                            setImageFile(null);
                            setShowCreateModal(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Eliminar
                        </Button>

                        <div className="mt-2">
                          {uploadingId === p.id && (
                            <p className="text-xs text-blue-400">Subiendo...</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* MODAL PARA CREAR NUEVO PRODUCTO */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nuevo producto"
        >
          <form onSubmit={handleCreate} className="space-y-7">
            {/* INFORMACIÓN GENERAL */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Información general
              </h3>

              <Input
                label="Nombre del producto"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Alimento para perro 10kg"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Usa un nombre claro y descriptivo.
              </p>
            </div>

            {/* PRECIO Y STOCK */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Precio y disponibilidad
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Precio (COP)"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                />

                <Input
                  label="Stock disponible"
                  name="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Ej: 25"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Ingresa valores reales para evitar confusiones.
              </p>
            </div>

            {/* IMAGEN DEL PRODUCTO */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Imagen del producto (opcional)
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Sube una imagen clara del producto para mostrarla en el catálogo.
              </p>
            </div>

            {/* CATEGORÍA */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Clasificación del producto
              </h3>

              <Input
                label="Categoría"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Alimento, Medicamento, Accesorio..."
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Esto ayuda a organizar los productos en la página.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Crear producto'}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Productos;
