
import { Link } from 'react-router-dom';
import { Product } from '@/types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  return (
    <div className="group animate-fade-in">
      <Link to={`/producto/${product.sku}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-4">
          <img
            src={product.fotos[0]}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {!product.disponible && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Agotado
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-gray-900 font-medium text-sm group-hover:text-gray-600 transition-colors">
            {product.nombre}
          </h3>
          <p className="text-gray-500 text-sm">{product.categoria}</p>
          <p className="text-gray-900 font-semibold">{formatPrice(product.precio)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
