
import { useState, useEffect } from 'react';
import { Product } from '@/types/Product';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FiltersProps {
  products: Product[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  categoria: string[];
  precioMin: number;
  precioMax: number;
  detalles: { [key: string]: string[] };
}

const Filters = ({ products, onFilterChange }: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categoria: [],
    precioMin: 0,
    precioMax: 10000,
    detalles: {}
  });

  // Extraer valores únicos para los filtros
  const categorias = [...new Set(products.map(p => p.categoria))];
  const precios = products.map(p => p.precio);
  const minPrice = Math.min(...precios);
  const maxPrice = Math.max(...precios);

  // Extraer atributos únicos de detalles
  const detallesKeys = [...new Set(products.flatMap(p => Object.keys(p.detalles)))];
  const detallesOptions: { [key: string]: string[] } = {};
  
  detallesKeys.forEach(key => {
    const values = products.flatMap(p => {
      const value = p.detalles[key];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return [];
    });
    detallesOptions[key] = [...new Set(values)];
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      precioMin: minPrice,
      precioMax: maxPrice
    }));
  }, [minPrice, maxPrice]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCategoriaChange = (categoria: string) => {
    setFilters(prev => ({
      ...prev,
      categoria: prev.categoria.includes(categoria)
        ? prev.categoria.filter(c => c !== categoria)
        : [...prev.categoria, categoria]
    }));
  };

  const handleDetalleChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      detalles: {
        ...prev.detalles,
        [key]: prev.detalles[key]?.includes(value)
          ? prev.detalles[key].filter(v => v !== value)
          : [...(prev.detalles[key] || []), value]
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      categoria: [],
      precioMin: minPrice,
      precioMax: maxPrice,
      detalles: {}
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center text-gray-600"
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* Categorías */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Categoría</h4>
          <div className="space-y-2">
            {categorias.map(categoria => (
              <label key={categoria} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categoria.includes(categoria)}
                  onChange={() => handleCategoriaChange(categoria)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm text-gray-700">{categoria}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rango de precio */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Precio</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Mínimo</label>
              <input
                type="number"
                min={minPrice}
                max={maxPrice}
                value={filters.precioMin}
                onChange={(e) => setFilters(prev => ({ ...prev, precioMin: Number(e.target.value) }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Máximo</label>
              <input
                type="number"
                min={minPrice}
                max={maxPrice}
                value={filters.precioMax}
                onChange={(e) => setFilters(prev => ({ ...prev, precioMax: Number(e.target.value) }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Filtros de detalles */}
        {detallesKeys.map(key => (
          <div key={key}>
            <h4 className="font-medium text-gray-900 mb-3 capitalize">{key}</h4>
            <div className="space-y-2">
              {detallesOptions[key].map(value => (
                <label key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.detalles[key]?.includes(value) || false}
                    onChange={() => handleDetalleChange(key, value)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{value}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={clearFilters}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default Filters;
