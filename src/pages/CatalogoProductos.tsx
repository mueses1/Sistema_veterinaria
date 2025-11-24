import { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar';

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
                  <div className="mt-auto flex items-center justify-between">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogoProductos;
