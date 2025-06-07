
import React from 'react';
import { useStore } from '../context/StoreContext';
import HeroBanner from '../components/home/HeroBanner';
import FeaturedSections from '../components/home/FeaturedSections';
import CategoriesSection from '../components/home/CategoriesSection';

const Home = () => {
  const { config, products, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Banner */}
      {config.banner_principal_home && (
        <HeroBanner bannerConfig={config.banner_principal_home} />
      )}

      {/* Featured Sections */}
      {config.secciones_home_destacadas && products && (
        <FeaturedSections 
          sections={config.secciones_home_destacadas} 
          products={products} 
        />
      )}

      {/* Categories Section */}
      <CategoriesSection />
    </div>
  );
};

export default Home;
