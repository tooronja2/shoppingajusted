
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface Product {
  sku: string;
  nombre: string;
  categoria_slug: string;
  genero?: string;
  marca: string;
  precio_original: number;
  precio_oferta?: number;
  en_oferta: boolean;
  porcentaje_descuento: number;
  descripcion_corta: string;
  fotos: string[];
  disponible: boolean;
  cantidad_stock: number;
  slug_url_producto: string;
  etiquetas: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { config } = useStore();

  if (!config) return null;

  const formatPrice = (price: number) => {
    return `${config.moneda_simbolo}${price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Link to={`/producto/${product.slug_url_producto}`} className="group block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.fotos[0]}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {product.en_oferta && product.porcentaje_descuento > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{product.porcentaje_descuento}%
            </div>
          )}
          
          {/* Stock Status */}
          {!product.disponible && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Agotado</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-black transition-colors">
            {product.nombre}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">{product.marca}</p>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {product.descripcion_corta}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            {product.en_oferta && product.precio_oferta ? (
              <>
                <span className="text-lg font-bold text-black">
                  {formatPrice(product.precio_oferta)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.precio_original)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-black">
                {formatPrice(product.precio_original)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="text-xs text-gray-500">
            {product.disponible ? (
              product.cantidad_stock <= 5 ? (
                <span className="text-orange-600 font-medium">Pocas unidades</span>
              ) : (
                <span className="text-green-600">En stock</span>
              )
            ) : (
              <span className="text-red-600">Agotado</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
