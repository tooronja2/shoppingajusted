import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useSecureForm } from '../hooks/useSecureForm';
import { validateEmail, validateUrl } from '../utils/security';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const { config } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const validationRules = {
    nombre: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, custom: validateEmail },
    mensaje: { required: true, minLength: 10, maxLength: 1000 }
  };

  const { formData, errors, updateField, validateForm } = useSecureForm({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  }, validationRules);

  if (!config) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor completa los campos obligatorios correctamente');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - in production, implement actual form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
      
      // Clear form
      Object.keys(formData).forEach(field => {
        updateField(field as keyof typeof formData, '');
      });
      
    } catch (error) {
      toast.error('Error al enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const whatsappNumber = config.whatsapp_numero_consultas.replace(/[^0-9]/g, '');
    const message = `¡Hola! Me gustaría obtener más información sobre ${config.nombre_tienda}.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    if (validateUrl(whatsappUrl)) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('URL de WhatsApp no válida');
    }
  };

  const openSocialLink = (url: string, platform: string) => {
    if (validateUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error(`URL de ${platform} no válida`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacto</h1>
        <p className="text-gray-600 mb-8">Estamos aquí para ayudarte. Contactanos de la forma que prefieras.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Dirección</h3>
                    <p className="text-gray-600">{config.direccion_fisica_opcional}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Teléfono</h3>
                    <p className="text-gray-600">{config.telefono_contacto_visible}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{config.email_contacto_principal}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">{config.whatsapp_numero_consultas}</p>
                    <Button
                      onClick={handleWhatsAppContact}
                      className="mt-3 bg-green-500 hover:bg-green-600 text-white w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar por WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {config.links_redes_sociales?.instagram && (
                    <button
                      onClick={() => openSocialLink(config.links_redes_sociales?.instagram || '', 'Instagram')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                    >
                      Instagram
                    </button>
                  )}
                  {config.links_redes_sociales?.facebook && (
                    <button
                      onClick={() => openSocialLink(config.links_redes_sociales?.facebook || '', 'Facebook')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                    >
                      Facebook
                    </button>
                  )}
                  {config.links_redes_sociales?.tiktok && (
                    <button
                      onClick={() => openSocialLink(config.links_redes_sociales?.tiktok || '', 'TikTok')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                    >
                      TikTok
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
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
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => updateField('telefono', e.target.value)}
                        placeholder="Tu teléfono (opcional)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="asunto">Asunto</Label>
                      <Input
                        id="asunto"
                        type="text"
                        value={formData.asunto}
                        onChange={(e) => updateField('asunto', e.target.value)}
                        placeholder="Asunto del mensaje (opcional)"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => updateField('mensaje', e.target.value)}
                      className={errors.mensaje ? 'border-red-500' : ''}
                      placeholder="¿En qué podemos ayudarte?"
                      rows={5}
                      required
                    />
                    {errors.mensaje && (
                      <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    Al enviarnos un mensaje, aceptas nuestra política de privacidad.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestra Ubicación</h2>
          <div className="aspect-[21/9] w-full bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              <MapPin className="w-8 h-8 mr-2" />
              <span>Mapa de Ubicación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
