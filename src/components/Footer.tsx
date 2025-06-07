
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Instagram, Facebook } from 'lucide-react';
import AnimatedContainer from './AnimatedContainer';

const Footer = () => {
  const { config } = useStore();

  if (!config) return null;

  console.log('Footer - config.links_redes_sociales:', config.links_redes_sociales);

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <AnimatedContainer animation="fade-up" delay={100} className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 gradient-text bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{config.nombre_tienda}</h3>
            <p className="text-gray-300 mb-4 max-w-md leading-relaxed">
              Descubre las últimas tendencias en moda premium. Calidad excepcional y diseños únicos para expresar tu estilo personal.
            </p>
            <div className="text-gray-300 space-y-1">
              <p className="hover:text-white transition-colors cursor-pointer">{config.direccion_fisica_opcional}</p>
              <p className="hover:text-white transition-colors cursor-pointer">Tel: {config.telefono_contacto_visible}</p>
              <p className="hover:text-white transition-colors cursor-pointer">Email: {config.email_contacto_principal}</p>
            </div>
          </AnimatedContainer>

          {/* Help Links */}
          <AnimatedContainer animation="fade-up" delay={200}>
            <h4 className="text-lg font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2">
              {(config.footer_links_ayuda || []).map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.url}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  >
                    {link.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedContainer>

          {/* Categories */}
          <AnimatedContainer animation="fade-up" delay={300}>
            <h4 className="text-lg font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/productos?genero=mujer" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                  Mujer
                </Link>
              </li>
              <li>
                <Link to="/productos?genero=hombre" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                  Hombre
                </Link>
              </li>
              <li>
                <Link to="/productos?etiquetas=oferta" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/productos?etiquetas=nueva-coleccion" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                  Nueva Colección
                </Link>
              </li>
            </ul>
          </AnimatedContainer>
        </div>

        {/* Social Media & Copyright */}
        <AnimatedContainer animation="fade-up" delay={400}>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">{config.texto_footer_copyright}</p>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {config.links_redes_sociales?.instagram && (
                <a
                  href={config.links_redes_sociales.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-125 hover:rotate-12"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {config.links_redes_sociales?.facebook && (
                <a
                  href={config.links_redes_sociales.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-125 hover:rotate-12"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {config.whatsapp_numero_consultas && (
                <a
                  href={`https://wa.me/${config.whatsapp_numero_consultas.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 magnetic-button hover-lift animate-pulse"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  );
};

export default Footer;
