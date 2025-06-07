
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import AnimatedContainer from '../AnimatedContainer';

interface Product {
  sku: string;
  nombre: string;
  categoria_slug: string;
  genero?: string;
  marca: string;
  precio_original: number;
  precio_oferta?: number;
  en_oferta: boolean;
  porcentaje_descuento: number;
  descripcion_corta: string;
  descripcion_larga: string;
  fotos: string[];
  disponible: boolean;
  cantidad_stock: number;
  detalles: {
    tallas_disponibles: string[];
    colores_disponibles: Array<{
      nombre: string;
      hex: string;
    }>;
    material: string;
    cuidados: string;
  };
  fecha_agregado: string;
  slug_url_producto: string;
  etiquetas: string[];
}

interface FeaturedSectionsProps {
  sections: Array<{
    titulo_seccion: string;
    criterio_productos: string;
    limite: number;
  }>;
  products: Product[];
}

const FeaturedSections: React.FC<FeaturedSectionsProps> = ({ sections, products }) => {
  const getProductsForSection = (seccion: any) => {
    let filteredProducts = [...products];

    switch (seccion.criterio_productos) {
      case 'ordenar_por_fecha_desc':
        filteredProducts.sort((a, b) => new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime());
        break;
      case 'filtrar_por_etiqueta_popular':
        filteredProducts = filteredProducts.filter(p => p.etiquetas.includes('popular'));
        break;
    }

    return filteredProducts.slice(0, seccion.limite);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {sections?.map((seccion, sectionIndex) => {
        const sectionProducts = getProductsForSection(seccion);
        
        if (sectionProducts.length === 0) return null;

        return (
          <section key={sectionIndex} className="mb-16">
            <AnimatedContainer animation="fade-up" delay={100}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 gradient-text">{seccion.titulo_seccion}</h2>
                <Link to="/productos" className="text-black hover:underline font-medium magnetic-button hover:scale-105 transition-all duration-300">
                  Ver todos
                </Link>
              </div>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectionProducts.map((product, productIndex) => (
                <AnimatedContainer 
                  key={product.sku} 
                  animation="fade-up" 
                  delay={productIndex * 100}
                  className="hover-lift"
                >
                  <ProductCard product={product} />
                </AnimatedContainer>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default FeaturedSections;
