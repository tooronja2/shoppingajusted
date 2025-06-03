
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.telefono) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Preparar datos del pedido para enviar al webhook
      const orderData = {
        cliente: {
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email
        },
        productos: items.map(item => ({
          sku: item.product.sku,
          nombre: item.product.nombre,
          precio: item.product.precio,
          cantidad: item.quantity,
          opciones_seleccionadas: item.selectedOptions,
          subtotal: item.product.precio * item.quantity
        })),
        resumen: {
          total_productos: items.length,
          total_cantidad: items.reduce((sum, item) => sum + item.quantity, 0),
          total_precio: getTotalPrice()
        },
        fecha_pedido: new Date().toISOString()
      };

      console.log('Datos del pedido preparados:', orderData);

      // TODO: Aquí se enviará al webhook de n8n cuando esté disponible
      // const response = await fetch('URL_DEL_WEBHOOK_N8N', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(orderData),
      // });

      // Simular envío exitoso por ahora
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "¡Pedido realizado con éxito!",
        description: "Te contactaremos pronto por WhatsApp para confirmar tu pedido",
      });

      clearCart();
      navigate('/');

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toast({
        title: "Error al procesar el pedido",
        description: "Por favor intenta nuevamente o contacta con soporte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No hay productos en el carrito</h1>
          <p className="text-gray-600 mb-8">Agrega algunos productos antes de proceder al checkout.</p>
          <button
            onClick={() => navigate('/productos')}
            className="bg-gray-900 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Explorar Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de datos del cliente */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información de Contacto</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Número de WhatsApp *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                placeholder="+52 55 1234 5678"
              />
              <p className="text-sm text-gray-500 mt-1">
                Te contactaremos por WhatsApp para confirmar tu pedido
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover-scale"
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            {items.map((item) => (
              <div key={`${item.product.sku}-${JSON.stringify(item.selectedOptions)}`} className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.product.nombre}</h4>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-500">
                      <span className="capitalize">{key}:</span> {value}
                    </p>
                  ))}
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.product.precio * item.quantity)}
                </p>
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Proceso de Compra</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Completa tus datos de contacto</li>
              <li>2. Confirma tu pedido</li>
              <li>3. Te contactaremos por WhatsApp</li>
              <li>4. Coordinaremos entrega y pago</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
