
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/Product';
import ProductCard from '@/components/ProductCard';
import Filters, { FilterState } from '@/components/Filters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Products = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('fecha_agregado_desc');
  const [filters, setFilters] = useState<FilterState>({
    categoria: [],
    precioMin: 0,
    precioMax: 10000,
    detalles: {}
  });

  const productsPerPage = 12;

  // Inicializar filtros desde URL
  useEffect(() => {
    const categoria = searchParams.get('categoria');
    if (categoria) {
      setFilters(prev => ({
        ...prev,
        categoria: [categoria]
      }));
    }
  }, [searchParams]);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Filtro por categoría
      if (filters.categoria.length > 0 && !filters.categoria.includes(product.categoria)) {
        return false;
      }

      // Filtro por precio
      if (product.precio < filters.precioMin || product.precio > filters.precioMax) {
        return false;
      }

      // Filtros por detalles
      for (const [key, values] of Object.entries(filters.detalles)) {
        if (values.length > 0) {
          const productValue = product.detalles[key];
          if (Array.isArray(productValue)) {
            const hasMatch = productValue.some(v => values.includes(v));
            if (!hasMatch) return false;
          } else if (typeof productValue === 'string') {
            if (!values.includes(productValue)) return false;
          } else {
            return false;
          }
        }
      }

      return true;
    });

    // Ordenar
    switch (sortBy) {
      case 'precio_asc':
        filtered.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio_desc':
        filtered.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre_asc':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'fecha_agregado_desc':
      default:
        filtered.sort((a, b) => new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime());
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + productsPerPage);

  // Reset página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Productos</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600">
            Mostrando {paginatedProducts.length} de {filteredAndSortedProducts.length} productos
          </p>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
          >
            <option value="fecha_agregado_desc">Más recientes</option>
            <option value="precio_asc">Precio: Menor a Mayor</option>
            <option value="precio_desc">Precio: Mayor a Menor</option>
            <option value="nombre_asc">Nombre: A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <Filters products={products} onFilterChange={handleFilterChange} />
        </div>

        {/* Lista de productos */}
        <div className="lg:col-span-3">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProducts.map((product, index) => (
                  <div key={product.sku} style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md border ${
                        currentPage === page
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-600">Intenta ajustar los filtros para ver más resultados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
