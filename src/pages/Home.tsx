
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { HomeConfig } from '@/types/Product';
import ProductCard from '@/components/ProductCard';

const Home = () => {
  const { products, loading } = useProducts();
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);

  useEffect(() => {
    const loadHomeConfig = async () => {
      try {
        const response = await fetch('/data/config_inicio.json');
        const config = await response.json();
        setHomeConfig(config);
      } catch (error) {
        console.error('Error loading home config:', error);
      }
    };

    loadHomeConfig();
  }, []);

  // Productos destacados (más recientes)
  const featuredProducts = products
    .sort((a, b) => new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime())
    .slice(0, homeConfig?.productos_destacados_cantidad || 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {homeConfig && (
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={homeConfig.banner.imagen}
            alt={homeConfig.banner.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {homeConfig.banner.titulo}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {homeConfig.banner.subtitulo}
              </p>
              <Link
                to={homeConfig.banner.cta_link}
                className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors hover-scale"
              >
                {homeConfig.banner.cta_texto}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestras últimas incorporaciones y las piezas más populares de la temporada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <div key={product.sku} style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/productos"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors hover-scale"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      {/* Secciones adicionales */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En compras mayores a $1,500</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Devoluciones</h3>
              <p className="text-gray-600">30 días para cambios</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Materiales de primera</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
