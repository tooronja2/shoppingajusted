
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Página no encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link to="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </Link>
          <Link to="/productos">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Explorar Productos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
