import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useSecureForm } from '../hooks/useSecureForm';
import { validateEmail, validatePhone, validateWebhookUrl } from '../utils/security';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface CheckoutForm extends Record<string, string> {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  numero: string;
  piso: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  notas: string;
}

const Checkout = () => {
  const { cart, config, clearCart, getCartTotal } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const validationRules = {
    nombre: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, custom: validateEmail },
    telefono: { required: true, custom: validatePhone },
    direccion: { required: true, minLength: 5, maxLength: 200 },
    numero: { required: true, minLength: 1, maxLength: 10 },
    codigoPostal: { required: true, minLength: 3, maxLength: 10 },
    ciudad: { required: true, minLength: 2, maxLength: 100 },
    provincia: { required: true, minLength: 2, maxLength: 100 },
    pais: { required: true, minLength: 2, maxLength: 100 }
  };

  const { formData, errors, updateField, validateForm } = useSecureForm<CheckoutForm>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    numero: '',
    piso: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    pais: 'Argentina',
    notas: ''
  }, validationRules);

  if (!config) return null;

  const cartTotal = getCartTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor completa los campos obligatorios correctamente');
      return;
    }

    if (cart.length === 0) {
      toast.error('El carrito está vacío. Agrega productos antes de continuar.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate order submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart after successful submission
      clearCart();

      toast.success('¡Pedido realizado con éxito! Redirigiendo a la página de confirmación...');

      // Redirect to order confirmation page
      window.location.href = '/pedido-confirmado';

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toast.error('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Completa tus datos para finalizar la compra.</p>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto y Envío</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => updateField('nombre', e.target.value)}
                    className={errors.nombre ? 'border-red-500' : ''}
                    placeholder="Tu nombre"
                    required
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    placeholder="tu@email.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => updateField('telefono', e.target.value)}
                    className={errors.telefono ? 'border-red-500' : ''}
                    placeholder="Tu teléfono"
                    required
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => updateField('direccion', e.target.value)}
                    className={errors.direccion ? 'border-red-500' : ''}
                    placeholder="Calle y número"
                    required
                  />
                  {errors.direccion && (
                    <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    type="text"
                    value={formData.numero}
                    onChange={(e) => updateField('numero', e.target.value)}
                    className={errors.numero ? 'border-red-500' : ''}
                    placeholder="Número"
                    required
                  />
                  {errors.numero && (
                    <p className="text-red-500 text-sm mt-1">{errors.numero}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="piso">Piso</Label>
                  <Input
                    id="piso"
                    type="text"
                    value={formData.piso}
                    onChange={(e) => updateField('piso', e.target.value)}
                    placeholder="Piso (opcional)"
                  />
                </div>

                <div>
                  <Label htmlFor="codigoPostal">Código Postal *</Label>
                  <Input
                    id="codigoPostal"
                    type="text"
                    value={formData.codigoPostal}
                    onChange={(e) => updateField('codigoPostal', e.target.value)}
                    className={errors.codigoPostal ? 'border-red-500' : ''}
                    placeholder="Código Postal"
                    required
                  />
                  {errors.codigoPostal && (
                    <p className="text-red-500 text-sm mt-1">{errors.codigoPostal}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => updateField('ciudad', e.target.value)}
                    className={errors.ciudad ? 'border-red-500' : ''}
                    placeholder="Ciudad"
                    required
                  />
                  {errors.ciudad && (
                    <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Input
                    id="provincia"
                    type="text"
                    value={formData.provincia}
                    onChange={(e) => updateField('provincia', e.target.value)}
                    className={errors.provincia ? 'border-red-500' : ''}
                    placeholder="Provincia"
                    required
                  />
                  {errors.provincia && (
                    <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="pais">País *</Label>
                <Input
                  id="pais"
                  type="text"
                  value={formData.pais}
                  onChange={(e) => updateField('pais', e.target.value)}
                  className={errors.pais ? 'border-red-500' : ''}
                  placeholder="País"
                  required
                />
                {errors.pais && (
                  <p className="text-red-500 text-sm mt-1">{errors.pais}</p>
                )}
              </div>

              <div>
                <Label htmlFor="notas">Notas Adicionales</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => updateField('notas', e.target.value)}
                  placeholder="¿Alguna indicación especial para el envío?"
                  rows={3}
                />
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Total: {config.moneda_simbolo} {cartTotal.toFixed(2)}
                </div>
                <Button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Finalizar Compra'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
