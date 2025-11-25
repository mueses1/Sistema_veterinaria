import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartResponse {
  user_id: string;
  items: CartItem[];
}

const Carrito = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}`);
      if (!res.ok) return;
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error cargando carrito', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    fetchCart();
  }, [isAuthenticated, user]);

  const total = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  const formatCOP = (value: number) =>
    `COP ${new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    }).format(value)}`;

  const handleRemoveItem = async (productId: string) => {
    if (!user) return;
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}/items/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) return;
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error eliminando producto del carrito', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!user) return;
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) return;
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error vaciando carrito', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Carrito de compra</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Debes iniciar sesión para ver y gestionar tu carrito de compra.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
            >
              Ir a iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">
              Carrito de compra
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl text-sm md:text-base">
              Revisa los productos que has agregado al carrito y confirma tu pedido cuando estés listo.
            </p>
          </div>

          {cart && cart.items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-300">Total estimado</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCOP(total)}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={updating}
              >
                Vaciar carrito
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando carrito...</p>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300 max-w-md mx-auto mt-10">
            <p className="mb-4">Tu carrito está vacío.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/catalogo-productos')}
            >
              Ver catálogo de productos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cart.items.map((item) => (
              <div
                key={item.product_id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-2"
              >
                {item.image_url ? (
                  <div className="w-full h-32 md:h-36 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-t-2xl w-full h-32 md:h-36" />
                )}
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Cantidad: <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Precio unitario: {formatCOP(item.price)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-base md:text-lg font-black text-emerald-600">
                      {formatCOP(item.price * item.quantity)}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={updating}
                    >
                      Quitar
                    </Button>
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

export default Carrito;
