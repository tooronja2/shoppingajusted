
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedContainer from '../AnimatedContainer';

const CategoriesSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_6s_ease-in-out_infinite] animation-delay-200"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedContainer animation="fade-up" delay={100}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 gradient-text">Explora por Categoría</h2>
        </AnimatedContainer>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedContainer animation="fade-left" delay={200}>
            <Link to="/productos?genero=mujer" className="group">
              <div className="relative h-64 overflow-hidden rounded-lg hover-lift glass-morphism">
                <img
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=600&fit=crop"
                  alt="Mujer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">Mujer</h3>
                </div>
              </div>
            </Link>
          </AnimatedContainer>
          
          <AnimatedContainer animation="scale-in" delay={300}>
            <Link to="/productos?genero=hombre" className="group">
              <div className="relative h-64 overflow-hidden rounded-lg hover-lift glass-morphism">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=600&fit=crop"
                  alt="Hombre"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">Hombre</h3>
                </div>
              </div>
            </Link>
          </AnimatedContainer>
          
          <AnimatedContainer animation="fade-right" delay={400}>
            <Link to="/productos?etiquetas=oferta" className="group">
              <div className="relative h-64 overflow-hidden rounded-lg hover-lift glass-morphism">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                  alt="Ofertas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/60 via-transparent to-transparent group-hover:from-red-500/40 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">Ofertas</h3>
                  <p className="text-white animate-pulse">Hasta 50% OFF</p>
                </div>
              </div>
            </Link>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
