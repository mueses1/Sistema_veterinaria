import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// TU NAVBAR ORIGINAL (importas el tuyo)
import Navbar from '../components/ui/Navbar';  // ← Este es el que ya tienes

// Componentes UI simples (usa los tuyos si ya existen)
const Button = ({ children, variant = "primary", size = "lg", className = "", ...props }: any) => {
  const base = "font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl";
  const variants = {
    primary: "bg-white text-teal-600 hover:bg-cyan-50",
    outline: "border-2 border-white text-white hover:bg-white/20 backdrop-blur",
  };
  const sizes = { lg: "px-10 py-5 text-lg" };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${className}`}>
    {children}
  </div>
);

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

const Landing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const navigate = useNavigate();

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

  const destacados = products.slice(0, 6);

  const formatCOP = (value: number) =>
    `COP ${new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    }).format(value)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* TU NAVBAR ORIGINAL */}
      <Navbar />

      {/* HERO CON TU LOGO ANIMADO */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white overflow-hidden">
        <motion.div 
          style={{ y: heroParallax }}
          className="absolute inset-0 opacity-30 bg-black/40"
        />

        <div className="container mx-auto px-6 relative z-10 pt-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-cyan-100 font-bold tracking-widest uppercase text-sm mb-4"
              >
                Lugar donde tus mascotas son felices 
              </motion.p>

              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8"
              >
                Tu clínica de confianza,<br />
                <span className="text-cyan-300">más humana</span>
              </motion.h1>

              <motion.p 
                
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xl text-cyan-50 mb-10 max-w-2xl leading-relaxed"
              >
                Seguro y diseñado por y para veterinarios.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-6"
              >
                <Button onClick={() => navigate('/servicios')}>
                  Explorar servicios
                </Button>
                <Button variant="outline" onClick={() => navigate('/contacto')}>
                  Agendar cita ahora
                </Button>
              </motion.div>
            </motion.div>

            {/* TU LOGO ANIMADO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.8, type: "spring", stiffness: 70 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Halo pulsante */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -inset-32 rounded-full bg-white/30 blur-3xl"
                />
                {/* Logo principal */}
                <img 
                  src="/salud.png" 
                  alt="VetClinic Pro"
                  className="relative z-10 w-[420px] h-[420px] drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.5))' }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Flecha scroll */}
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-10 h-16 border-4 border-white/60 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-8 bg-white rounded-full mt-3"
            />
          </div>
        </motion.div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section id="productos" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-lg md:text-xl text-gray-600">Los mejores productos para el cuidado de tus mascotas</p>
          </motion.div>

          {loading ? (
            <p className="text-center text-gray-500 text-xl">Cargando productos...</p>
          ) : destacados.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">Pronto estarán disponibles los productos</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {destacados.map((prod) => (
                <motion.div key={prod.id} whileHover={{ y: -16, scale: 1.03 }}>
                  <Card>
                    {prod.image_url ? (
                      <img
                        src={`${API_BASE_ORIGIN}${prod.image_url}`}
                        alt={prod.name}
                        className="w-full h-96 md:h-96 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-xl w-full h-48 md:h-52" />
                    )}
                    <div className="p-5 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold mb-1 line-clamp-2">{prod.name}</h3>
                      <p className="text-gray-500 text-xs md:text-sm capitalize mb-4">{prod.category}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-1xl font-black text-emerald-600">{formatCOP(prod.price)}</span>

                        <span className={`text-xs md:text-sm font-semibold ${prod.stock > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                          Stock: {prod.stock}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Button
              variant="primary"
              size="lg"
              className="px-8 py-3 text-sm md:text-base"
              onClick={() => navigate('/catalogo-productos')}
            >
              Ver más productos
            </Button>
          </div>
        </div>
      </section>
      <footer className="bg-black text-gray-400 py-12 text-center">
        <div className="container mx-auto px-6">
          <p className="text-lg">&copy; {new Date().getFullYear()} VetClinic Pro — Hecho con amor para quienes cuidan a nuestras mascotas</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;