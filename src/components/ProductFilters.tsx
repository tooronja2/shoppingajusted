
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface FilterProps {
  availableFilters: {
    categorias: string[];
    marcas: string[];
    tallas: string[];
    colores: Array<{ nombre: string; hex: string }>;
    generos: string[];
    etiquetas: string[];
  };
  currentFilters: {
    categoria?: string;
    marca?: string[];
    tallas?: string[];
    colores?: string[];
    genero?: string;
    etiquetas?: string[];
    precio_min?: number;
    precio_max?: number;
  };
  priceRange: { min: number; max: number };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<FilterProps> = ({
  availableFilters,
  currentFilters,
  priceRange,
  onFiltersChange,
  onClearFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    marca: true,
    tallas: true,
    colores: true,
    precio: true,
    etiquetas: false
  });

  const [localPriceRange, setLocalPriceRange] = useState([
    currentFilters.precio_min || priceRange.min,
    currentFilters.precio_max || priceRange.max
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType: string, value: any, isMultiple = false) => {
    const newFilters = { ...currentFilters };

    if (isMultiple) {
      if (!newFilters[filterType]) {
        newFilters[filterType] = [];
      }
      
      const currentValues = newFilters[filterType] as string[];
      if (currentValues.includes(value)) {
        newFilters[filterType] = currentValues.filter(v => v !== value);
      } else {
        newFilters[filterType] = [...currentValues, value];
      }
      
      if (newFilters[filterType].length === 0) {
        delete newFilters[filterType];
      }
    } else {
      if (newFilters[filterType] === value) {
        delete newFilters[filterType];
      } else {
        newFilters[filterType] = value;
      }
    }

    onFiltersChange(newFilters);
  };

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
  };

  const applyPriceFilter = () => {
    const newFilters = { ...currentFilters };
    if (localPriceRange[0] > priceRange.min) {
      newFilters.precio_min = localPriceRange[0];
    } else {
      delete newFilters.precio_min;
    }
    
    if (localPriceRange[1] < priceRange.max) {
      newFilters.precio_max = localPriceRange[1];
    } else {
      delete newFilters.precio_max;
    }
    
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Marcas */}
      {availableFilters.marcas.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('marca')}
            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
          >
            Marca
            {expandedSections.marca ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.marca && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.marcas.map(marca => (
                <label key={marca} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={currentFilters.marca?.includes(marca) || false}
                    onCheckedChange={() => handleFilterChange('marca', marca, true)}
                  />
                  <span className="text-sm text-gray-700">{marca}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tallas */}
      {availableFilters.tallas.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('tallas')}
            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
          >
            Talla
            {expandedSections.tallas ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.tallas && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {availableFilters.tallas.map(talla => (
                <label key={talla} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={currentFilters.tallas?.includes(talla) || false}
                    onCheckedChange={() => handleFilterChange('tallas', talla, true)}
                  />
                  <span className="text-sm text-gray-700">{talla}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Colores */}
      {availableFilters.colores.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('colores')}
            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
          >
            Color
            {expandedSections.colores ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.colores && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.colores.map(color => (
                <label key={color.nombre} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={currentFilters.colores?.includes(color.nombre) || false}
                    onCheckedChange={() => handleFilterChange('colores', color.nombre, true)}
                  />
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm text-gray-700">{color.nombre}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Precio */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('precio')}
          className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
        >
          Precio
          {expandedSections.precio ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.precio && (
          <div className="mt-4">
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceChange}
              onValueCommit={applyPriceFilter}
              max={priceRange.max}
              min={priceRange.min}
              step={100}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${localPriceRange[0].toLocaleString()}</span>
              <span>${localPriceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Etiquetas */}
      {availableFilters.etiquetas.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('etiquetas')}
            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
          >
            Etiquetas
            {expandedSections.etiquetas ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.etiquetas && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.etiquetas.map(etiqueta => (
                <label key={etiqueta} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={currentFilters.etiquetas?.includes(etiqueta) || false}
                    onCheckedChange={() => handleFilterChange('etiquetas', etiqueta, true)}
                  />
                  <span className="text-sm text-gray-700 capitalize">{etiqueta}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
