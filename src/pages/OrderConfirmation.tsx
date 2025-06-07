
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MessageCircle, Home, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useStore();
  
  const orderData = location.state?.orderData;
  const customerName = location.state?.customerName;
  const orderTotal = location.state?.orderTotal;

  useEffect(() => {
    // If no order data is available, redirect to home
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!config || !orderData) {
    return null;
  }

  const formatPrice = (price: number) => {
    return `${config.moneda_simbolo}${price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  };

  const handleWhatsAppContact = () => {
    const message = `¡Hola! Acabo de realizar un pedido en ${config.nombre_tienda}. Mi nombre es ${customerName} y me gustaría confirmar los detalles y coordinar el pago.`;
    const whatsappUrl = `https://wa.me/${config.whatsapp_numero_consultas.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-lg text-gray-600">
            Gracias por tu compra, {customerName}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
              <p className="text-gray-800">
                En breve te contactaremos por WhatsApp para confirmar los detalles de tu pedido, coordinar el pago y la entrega.
              </p>
            </div>

            <div className="text-center">
              <Button onClick={handleWhatsAppContact} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contactarnos por WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Productos:</h3>
              <div className="space-y-2">
                {orderData.productos.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.cantidad}x {item.nombre} ({item.talle_seleccionado}, {item.color_seleccionado})</span>
                    <span>{formatPrice(item.precio_unitario_al_momento_compra * item.cantidad)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Información de Entrega:</h3>
              <p className="text-sm">
                {orderData.cliente.nombre_completo}<br />
                {orderData.direccion_envio.calle} {orderData.direccion_envio.numero}{orderData.direccion_envio.piso_depto && `, ${orderData.direccion_envio.piso_depto}`}<br />
                {orderData.direccion_envio.codigo_postal}, {orderData.direccion_envio.ciudad}, {orderData.direccion_envio.provincia}<br />
                {orderData.direccion_envio.pais}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </Link>
          <Link to="/productos">
            <Button variant="outline" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Seguir Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
