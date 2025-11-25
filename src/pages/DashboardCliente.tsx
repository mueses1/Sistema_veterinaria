import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DashboardCliente = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">
            Hola{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl text-sm md:text-base">
            Bienvenido a tu panel de cliente. Desde aquí puedes explorar el catálogo de productos y gestionar tu carrito de compras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Catálogo de productos</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Explora todos los productos disponibles, filtra por categoría y agrega artículos a tu carrito.
              </p>
            </div>
            <Button
              variant="primary"
              className="mt-2 self-start"
              onClick={() => navigate('/catalogo-productos')}
            >
              Ver catálogo
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Carrito de compras</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Revisa los productos que has agregado, ajusta cantidades y finaliza tu pedido.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2 self-start"
              onClick={() => navigate('/carrito')}
            >
              Ir al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;
