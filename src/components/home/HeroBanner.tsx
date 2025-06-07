
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '../AnimatedContainer';
import { useParallax } from '../../hooks/useScrollAnimation';

interface HeroBannerProps {
  bannerConfig: {
    activo: boolean;
    imagen_url_desktop: string;
    imagen_url_mobile: string;
    alt_text: string;
    titulo_superpuesto: string;
    subtitulo_superpuesto: string;
    link_boton: string;
    texto_boton: string;
  };
}

const HeroBanner: React.FC<HeroBannerProps> = ({ bannerConfig }) => {
  const scrollY = useParallax();

  if (!bannerConfig.activo) return null;

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <div 
        className="absolute inset-0 parallax-slow"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={bannerConfig.imagen_url_mobile}
          />
          <img
            src={bannerConfig.imagen_url_desktop}
            alt={bannerConfig.alt_text}
            className="w-full h-full object-cover scale-110"
          />
        </picture>
      </div>
      
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="text-white max-w-2xl px-4">
          <AnimatedContainer animation="fade-up" delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              {bannerConfig.titulo_superpuesto}
            </h1>
          </AnimatedContainer>
          
          <AnimatedContainer animation="fade-up" delay={300}>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-xl">
              {bannerConfig.subtitulo_superpuesto}
            </p>
          </AnimatedContainer>
          
          <AnimatedContainer animation="scale-in" delay={500}>
            <Link to={bannerConfig.link_boton}>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 magnetic-button hover-lift shadow-2xl"
              >
                {bannerConfig.texto_boton}
              </Button>
            </Link>
          </AnimatedContainer>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-[float_4s_ease-in-out_infinite] animation-delay-300"></div>
    </section>
  );
};

export default HeroBanner;
