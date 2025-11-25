import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
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

const CatalogoProductos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const formatCOP = (value: number) =>
    `COP ${new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    }).format(value)}`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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

    fetchProducts();
  }, []);

  const categorias = Array.from(
    new Set(products.map((p) => (p.category || '').trim()).filter(Boolean)),
  );

  const filtered = products.filter((p) => {
    const byCategory =
      selectedCategory === 'todas' || p.category === selectedCategory;
    const bySearch = p.name.toLowerCase().includes(search.toLowerCase());
    return byCategory && bySearch;
  });

  const openQuantityModal = (prod: Product) => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    setSelectedProduct(prod);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user || !selectedProduct) {
      navigate('/login');
      return;
    }

    if (Number.isNaN(quantity) || quantity <= 0) {
      setFeedback({ type: 'error', message: 'Ingresa una cantidad válida mayor a 0.' });
      return;
    }

    if (quantity > selectedProduct.stock) {
      setFeedback({
        type: 'error',
        message: `No puedes agregar más de ${selectedProduct.stock} unidades disponibles en stock.`,
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity,
          image_url: selectedProduct.image_url
            ? `${API_BASE_ORIGIN}${selectedProduct.image_url}`
            : undefined,
        }),
      });

      if (!res.ok) {
        console.error('Error agregando al carrito');
        setFeedback({
          type: 'error',
          message: 'Ocurrió un error al agregar el producto al carrito.',
        });
        return;
      }

      setFeedback({ type: 'success', message: 'Producto añadido al carrito.' });
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error agregando al carrito', error);
      setFeedback({
        type: 'error',
        message: 'Ocurrió un error al agregar el producto al carrito.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">
              Catálogo de productos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl text-sm md:text-base">
              Explora todos los productos disponibles y filtra por categoría para encontrar rápidamente lo que necesitas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              className="w-full sm:w-48 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="todas">Todas las categorias</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando productos...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron productos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-2"
              >
                {prod.image_url ? (
                  <img
                    src={`${API_BASE_ORIGIN}${prod.image_url}`}
                    alt={prod.name}
                    className="w-full h-48 md:h-52 object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-t-2xl w-full h-48 md:h-52" />
                )}
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize mb-3">
                    {prod.category}
                  </p>
                  <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base md:text-lg font-black text-emerald-600">
                        {formatCOP(prod.price)}
                      </span>
                      <span
                        className={`text-xs md:text-sm font-medium ${
                          prod.stock > 5 ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        Stock: {prod.stock}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full mt-1"
                      onClick={() => openQuantityModal(prod)}
                    >
                      Agregar al carrito
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Feedback visual tipo banner/toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-40">
          <div
            className={`max-w-sm px-4 py-3 rounded-xl shadow-lg border text-sm flex items-center gap-3 transition-all duration-300
            ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            <div className="flex-1">
              <p className="font-semibold mb-1">
                {feedback.type === 'success' ? 'Operación exitosa' : 'Hubo un problema'}
              </p>
              <p>{feedback.message}</p>
            </div>
            <button
              type="button"
              className="text-xs font-medium opacity-70 hover:opacity-100"
              onClick={() => setFeedback(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para seleccionar cantidad */}
      {selectedProduct && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-black mb-2 text-gray-900 dark:text-gray-100">
              Agregar al carrito
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {selectedProduct.name}
            </p>
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                Disponible: {selectedProduct.stock}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatCOP(selectedProduct.price)}
              </span>
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              min={1}
              max={selectedProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProduct(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoProductos;
