
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

const Lanzamientos = () => {
  const { products, loading } = useProducts();

  // Obtener los últimos 10 productos agregados
  const latestProducts = products
    .sort((a, b) => new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Lanzamientos</h1>
        <p className="text-gray-600">
          Descubre nuestros últimos 10 productos agregados a la colección
        </p>
      </div>

      {latestProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product, index) => (
            <div key={product.sku} style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay lanzamientos disponibles</h3>
          <p className="text-gray-600">Pronto tendremos nuevos productos para ti.</p>
        </div>
      )}
    </div>
  );
};

export default Lanzamientos;
