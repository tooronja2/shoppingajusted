
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { X, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">¡Descubre nuestros productos y agrega algunos a tu carrito!</p>
          <Link
            to="/productos"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors hover-scale"
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items del carrito */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product.sku}-${JSON.stringify(item.selectedOptions)}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={item.product.fotos[0]}
                  alt={item.product.nombre}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/producto/${item.product.sku}`} className="hover:text-gray-600">
                      {item.product.nombre}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm">{item.product.categoria}</p>
                  
                  {/* Opciones seleccionadas */}
                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-500">
                      <span className="capitalize">{key}:</span> {value}
                    </p>
                  ))}
                  
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {formatPrice(item.product.precio)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.sku, item.quantity - 1, item.selectedOptions)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.product.sku, item.quantity + 1, item.selectedOptions)}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.sku, item.selectedOptions)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Productos ({getTotalItems()})</span>
                <span className="text-gray-900">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="text-gray-900">Gratis</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors hover-scale text-center block"
            >
              Proceder al Checkout
            </Link>

            <Link
              to="/productos"
              className="w-full text-gray-600 hover:text-gray-900 py-3 px-6 text-center block text-sm mt-4 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
