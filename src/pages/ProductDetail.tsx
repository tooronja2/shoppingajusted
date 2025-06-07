import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingBag, Heart, Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, config, addToCart } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const product = products.find(p => p.slug_url_producto === slug);

  useEffect(() => {
    if (product) {
      // Auto-select first available size and color
      if (product.detalles.tallas_disponibles.length > 0) {
        setSelectedSize(product.detalles.tallas_disponibles[0]);
      }
      if (product.detalles.colores_disponibles.length > 0) {
        setSelectedColor(product.detalles.colores_disponibles[0].nombre);
      }
    }
  }, [product]);

  if (!product || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Button onClick={() => navigate('/productos')}>
            Volver a productos
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${config.moneda_simbolo}${price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Por favor selecciona talla y color');
      return;
    }

    if (!product.disponible) {
      toast.error('Producto no disponible');
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.nombre} agregado al carrito`);
  };

  const handleWhatsAppConsult = () => {
    const message = `Hola! Me interesa el producto: ${product.nombre} (${product.sku}). ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/${config.whatsapp_numero_consultas.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const selectedColorObj = product.detalles.colores_disponibles.find(c => c.nombre === selectedColor);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
          <span>/</span>
          <span className="capitalize">{product.genero}</span>
          <span>/</span>
          <span className="capitalize">{product.categoria_slug}</span>
          <span>/</span>
          <span className="text-gray-900">{product.nombre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <div 
                className={`aspect-square overflow-hidden rounded-lg bg-gray-50 cursor-${isImageZoomed ? 'zoom-out' : 'zoom-in'}`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                <img
                  src={product.fotos[selectedImageIndex]}
                  alt={product.nombre}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isImageZoomed ? 'scale-150' : 'scale-100'
                  }`}
                />
              </div>
              
              {/* Discount Badge */}
              {product.en_oferta && product.porcentaje_descuento > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-semibold">
                  -{product.porcentaje_descuento}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 ${
                      selectedImageIndex === index ? 'border-black' : 'border-gray-200'
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

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
              <p className="text-lg text-gray-600 mb-1">{product.marca}</p>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {product.en_oferta && product.precio_oferta ? (
                <>
                  <span className="text-3xl font-bold text-black">
                    {formatPrice(product.precio_oferta)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.precio_original)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-black">
                  {formatPrice(product.precio_original)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.disponible ? (
                product.cantidad_stock <= 5 ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Pocas unidades disponibles
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    En stock
                  </Badge>
                )
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Agotado
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{product.descripcion_larga}</p>
            </div>

            {/* Size Selection */}
            {product.detalles.tallas_disponibles.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Talla</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.detalles.tallas_disponibles.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.detalles.colores_disponibles.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Color{selectedColorObj && `: ${selectedColorObj.nombre}`}
                </h3>
                <div className="flex gap-3">
                  {product.detalles.colores_disponibles.map((color) => (
                    <button
                      key={color.nombre}
                      onClick={() => setSelectedColor(color.nombre)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.nombre
                          ? 'border-black scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.nombre}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Cantidad</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50"
                    disabled={quantity >= product.cantidad_stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Máximo {product.cantidad_stock} unidades
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg"
                disabled={!product.disponible || !selectedSize || !selectedColor}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
              
              <Button
                onClick={handleWhatsAppConsult}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                Consultar por WhatsApp
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Favoritos
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Material</h4>
                <p className="text-gray-700">{product.detalles.material}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cuidados</h4>
                <p className="text-gray-700">{product.detalles.cuidados}</p>
              </div>

              {product.etiquetas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.etiquetas.map((etiqueta) => (
                      <Badge key={etiqueta} variant="outline" className="capitalize">
                        {etiqueta}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
