import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Grid, List } from 'lucide-react';

const ProductList = () => {
  const { products, isLoading } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('nombre-asc');
  
  const itemsPerPage = 12;

  // Extract filters from URL parameters
  const currentFilters = useMemo(() => {
    const filters: any = {};
    
    // Single value filters
    const categoria = searchParams.get('categoria');
    const genero = searchParams.get('genero');
    const buscar = searchParams.get('buscar');
    
    if (categoria) filters.categoria = categoria;
    if (genero) filters.genero = genero;
    if (buscar) filters.buscar = buscar;
    
    // Multiple value filters
    const marca = searchParams.getAll('marca');
    const tallas = searchParams.getAll('tallas');
    const colores = searchParams.getAll('colores');
    const etiquetas = searchParams.getAll('etiquetas');
    
    if (marca.length > 0) filters.marca = marca;
    if (tallas.length > 0) filters.tallas = tallas;
    if (colores.length > 0) filters.colores = colores;
    if (etiquetas.length > 0) filters.etiquetas = etiquetas;
    
    // Price range
    const precio_min = searchParams.get('precio_min');
    const precio_max = searchParams.get('precio_max');
    
    if (precio_min) filters.precio_min = parseInt(precio_min);
    if (precio_max) filters.precio_max = parseInt(precio_max);
    
    return filters;
  }, [searchParams]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (currentFilters.buscar) {
      const searchTerm = currentFilters.buscar.toLowerCase();
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm) ||
        product.descripcion_corta.toLowerCase().includes(searchTerm) ||
        product.marca.toLowerCase().includes(searchTerm) ||
        product.etiquetas.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (currentFilters.categoria) {
      filtered = filtered.filter(product => product.categoria_slug === currentFilters.categoria);
    }

    // Apply gender filter
    if (currentFilters.genero) {
      filtered = filtered.filter(product => product.genero === currentFilters.genero);
    }

    // Apply brand filter
    if (currentFilters.marca && currentFilters.marca.length > 0) {
      filtered = filtered.filter(product => currentFilters.marca.includes(product.marca));
    }

    // Apply size filter
    if (currentFilters.tallas && currentFilters.tallas.length > 0) {
      filtered = filtered.filter(product =>
        product.detalles.tallas_disponibles.some(talla => currentFilters.tallas.includes(talla))
      );
    }

    // Apply color filter
    if (currentFilters.colores && currentFilters.colores.length > 0) {
      filtered = filtered.filter(product =>
        product.detalles.colores_disponibles.some(color => currentFilters.colores.includes(color.nombre))
      );
    }

    // Apply tags filter
    if (currentFilters.etiquetas && currentFilters.etiquetas.length > 0) {
      filtered = filtered.filter(product =>
        currentFilters.etiquetas.some(etiqueta => product.etiquetas.includes(etiqueta))
      );
    }

    // Apply price filter
    if (currentFilters.precio_min || currentFilters.precio_max) {
      filtered = filtered.filter(product => {
        const price = product.en_oferta && product.precio_oferta ? product.precio_oferta : product.precio_original;
        const minPrice = currentFilters.precio_min || 0;
        const maxPrice = currentFilters.precio_max || Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'precio-asc':
        filtered.sort((a, b) => {
          const priceA = a.en_oferta && a.precio_oferta ? a.precio_oferta : a.precio_original;
          const priceB = b.en_oferta && b.precio_oferta ? b.precio_oferta : b.precio_original;
          return priceA - priceB;
        });
        break;
      case 'precio-desc':
        filtered.sort((a, b) => {
          const priceA = a.en_oferta && a.precio_oferta ? a.precio_oferta : a.precio_original;
          const priceB = b.en_oferta && b.precio_oferta ? b.precio_oferta : b.precio_original;
          return priceB - priceA;
        });
        break;
      case 'fecha-desc':
        filtered.sort((a, b) => new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime());
        break;
      case 'nombre-asc':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    return filtered;
  }, [products, currentFilters, sortBy]);

  // Get available filter options
  const availableFilters = useMemo(() => {
    const categorias = [...new Set(products.map(p => p.categoria_slug))];
    const marcas = [...new Set(products.map(p => p.marca))];
    const tallas = [...new Set(products.flatMap(p => p.detalles.tallas_disponibles))];
    const colores = [...new Map(
      products.flatMap(p => p.detalles.colores_disponibles)
        .map(color => [color.nombre, color])
    ).values()];
    const generos = [...new Set(products.map(p => p.genero).filter(Boolean))];
    const etiquetas = [...new Set(products.flatMap(p => p.etiquetas))];

    return { categorias, marcas, tallas, colores, generos, etiquetas };
  }, [products]);

  // Get price range
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100000 };
    
    const prices = products.map(p => p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio_original);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Update URL when filters change
  const handleFiltersChange = (newFilters: any) => {
    const newSearchParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => newSearchParams.append(key, v));
      } else {
        newSearchParams.set(key, value.toString());
      }
    });
    
    setSearchParams(newSearchParams);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  const pageTitle = currentFilters.categoria
    ? `Categoría: ${currentFilters.categoria}`
    : currentFilters.genero
    ? `${currentFilters.genero.charAt(0).toUpperCase() + currentFilters.genero.slice(1)}`
    : currentFilters.buscar
    ? `Resultados para: "${currentFilters.buscar}"`
    : 'Todos los Productos';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
          <p className="text-gray-600">
            {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              availableFilters={availableFilters}
              currentFilters={currentFilters}
              priceRange={priceRange}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="nombre-asc">Nombre A-Z</SelectItem>
                  <SelectItem value="nombre-desc">Nombre Z-A</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="fecha-desc">Más Recientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.sku} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No se encontraron productos con los filtros seleccionados.</p>
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
