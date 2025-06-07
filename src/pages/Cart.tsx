
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, config, updateCartItemQuantity, removeFromCart, getCartTotal } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!config) return null;

  const formatPrice = (price: number) => {
    return `${config.moneda_simbolo}${price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  };

  const handleQuantityChange = (sku: string, talla: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(sku, talla, color);
    } else {
      updateCartItemQuantity(sku, talla, color, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    navigate('/checkout');
  };

  const cartTotal = getCartTotal();
  const cartItemsCount = cart.reduce((count, item) => count + item.cantidad, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">¡Descubre nuestros productos y agrega algunos al carrito!</p>
            <Link to="/productos">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Explorar Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Cart Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {cartItemsCount} producto{cartItemsCount !== 1 ? 's' : ''} en tu carrito
            </h2>
            <Link to="/productos" className="text-black hover:underline font-medium">
              Seguir comprando
            </Link>
          </div>

          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div key={`${item.sku}-${item.talla_seleccionada}-${item.color_seleccionado}`} className="flex items-center gap-4 pb-6 border-b last:border-b-0">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={item.foto}
                    alt={item.nombre}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.nombre}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>SKU: {item.sku}</p>
                    <p>Talla: {item.talla_seleccionada}</p>
                    <p>Color: {item.color_seleccionado}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.sku, item.talla_seleccionada, item.color_seleccionado, item.cantidad - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <Input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => handleQuantityChange(item.sku, item.talla_seleccionada, item.color_seleccionado, parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                    min="1"
                  />
                  
                  <button
                    onClick={() => handleQuantityChange(item.sku, item.talla_seleccionada, item.color_seleccionado, item.cantidad + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatPrice(item.precio_unitario * item.cantidad)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatPrice(item.precio_unitario)} c/u
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.sku, item.talla_seleccionada, item.color_seleccionado)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Eliminar del carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between text-xl font-bold text-gray-900 mb-6">
              <span>Total:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Finalizar Compra'}
            </Button>

            {/* Additional Info */}
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Envío gratuito en compras superiores a {formatPrice(50000)}</p>
              <p>¿Tienes dudas? <span className="text-black cursor-pointer hover:underline">Contactanos por WhatsApp</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
