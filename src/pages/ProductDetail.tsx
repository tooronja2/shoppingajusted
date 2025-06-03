
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/Product';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { sku } = useParams<{ sku: string }>();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (products.length > 0 && sku) {
      const foundProduct = products.find(p => p.sku === sku);
      setProduct(foundProduct || null);
    }
  }, [products, sku]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Verificar que se hayan seleccionado las opciones requeridas
    const requiredOptions = Object.keys(product.detalles).filter(key => 
      Array.isArray(product.detalles[key])
    );

    for (const option of requiredOptions) {
      if (!selectedOptions[option]) {
        toast({
          title: "Selección requerida",
          description: `Por favor selecciona ${option}`,
          variant: "destructive",
        });
        return;
      }
    }

    addToCart(product, quantity, selectedOptions);
    toast({
      title: "Producto agregado",
      description: `${product.nombre} se agregó al carrito`,
    });
  };

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.fotos.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.fotos.length) % product.fotos.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link to="/productos" className="text-blue-600 hover:text-blue-500">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li><Link to="/" className="text-gray-500 hover:text-gray-700">Inicio</Link></li>
          <li><span className="text-gray-400">/</span></li>
          <li><Link to="/productos" className="text-gray-500 hover:text-gray-700">Productos</Link></li>
          <li><span className="text-gray-400">/</span></li>
          <li><span className="text-gray-900">{product.nombre}</span></li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.fotos[selectedImage]}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
            
            {product.fotos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {!product.disponible && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium">
                  Producto Agotado
                </span>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {product.fotos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.fotos.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={foto}
                    alt={`${product.nombre} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
            <p className="text-gray-600 mb-4">{product.categoria}</p>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(product.precio)}</p>
            <p className="text-gray-600 mt-2">SKU: {product.sku}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{product.descripcion_larga}</p>
          </div>

          {/* Opciones del producto */}
          <div className="space-y-4">
            {Object.entries(product.detalles).map(([key, value]) => {
              if (Array.isArray(value)) {
                return (
                  <div key={key}>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">{key}</h4>
                    <div className="flex flex-wrap gap-2">
                      {value.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionChange(key, option)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            selectedOptions[key] === option
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 capitalize">{key}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                );
              }
            })}
          </div>

          {/* Stock */}
          <div className="text-sm text-gray-600">
            {product.disponible ? (
              <span className="text-green-600">✓ En stock ({product.cantidad_stock} disponibles)</span>
            ) : (
              <span className="text-red-600">✗ Producto agotado</span>
            )}
          </div>

          {/* Cantidad y agregar al carrito */}
          {product.disponible && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Cantidad</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                >
                  {Array.from({ length: Math.min(product.cantidad_stock, 10) }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors hover-scale"
              >
                Agregar al Carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
