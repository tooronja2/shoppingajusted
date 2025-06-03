
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

const Ofertas = () => {
  const { products, loading } = useProducts();

  // Filtrar productos que tengan ofertas (asumiendo que productos en oferta tendrán un campo "oferta" o precio especial)
  // Por ahora mostraremos todos los productos disponibles como ofertas
  // En el futuro se puede agregar un campo "en_oferta" o "precio_oferta" al JSON
  const offerProducts = products.filter(product => product.disponible);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ofertas</h1>
        <p className="text-gray-600">
          Aprovecha nuestras mejores ofertas y descuentos especiales
        </p>
      </div>

      {offerProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerProducts.map((product, index) => (
            <div key={product.sku} style={{ animationDelay: `${index * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ofertas disponibles</h3>
          <p className="text-gray-600">Mantente atento para futuras promociones.</p>
        </div>
      )}
    </div>
  );
};

export default Ofertas;
