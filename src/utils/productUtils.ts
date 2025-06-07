
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

// Get all unique filter options from products
export const getFilterOptions = (products: Product[]) => {
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
};

// Filter products based on criteria
export const filterProducts = (
  products: Product[],
  filters: {
    categoria?: string;
    marca?: string[];
    tallas?: string[];
    colores?: string[];
    genero?: string;
    etiquetas?: string[];
    precio_min?: number;
    precio_max?: number;
    buscar?: string;
  }
) => {
  return products.filter(product => {
    // Category filter
    if (filters.categoria && product.categoria_slug !== filters.categoria) {
      return false;
    }

    // Gender filter
    if (filters.genero && product.genero !== filters.genero) {
      return false;
    }

    // Brand filter
    if (filters.marca && filters.marca.length > 0 && !filters.marca.includes(product.marca)) {
      return false;
    }

    // Size filter
    if (
      filters.tallas &&
      filters.tallas.length > 0 &&
      !product.detalles.tallas_disponibles.some(talla => filters.tallas!.includes(talla))
    ) {
      return false;
    }

    // Color filter
    if (
      filters.colores &&
      filters.colores.length > 0 &&
      !product.detalles.colores_disponibles.some(color => filters.colores!.includes(color.nombre))
    ) {
      return false;
    }

    // Tags filter
    if (
      filters.etiquetas &&
      filters.etiquetas.length > 0 &&
      !filters.etiquetas.some(tag => product.etiquetas.includes(tag))
    ) {
      return false;
    }

    // Price filter
    const price = product.en_oferta && product.precio_oferta
      ? product.precio_oferta
      : product.precio_original;
    
    if (filters.precio_min && price < filters.precio_min) {
      return false;
    }
    
    if (filters.precio_max && price > filters.precio_max) {
      return false;
    }

    // Search filter
    if (filters.buscar) {
      const searchTerm = filters.buscar.toLowerCase();
      const searchFields = [
        product.nombre,
        product.descripcion_corta,
        product.descripcion_larga,
        product.marca,
        ...product.etiquetas
      ].map(field => String(field).toLowerCase());

      return searchFields.some(field => field.includes(searchTerm));
    }

    return true;
  });
};

// Sort products based on criteria
export const sortProducts = (
  products: Product[],
  sortBy: string
) => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'precio-asc':
      sortedProducts.sort((a, b) => {
        const priceA = a.en_oferta && a.precio_oferta ? a.precio_oferta : a.precio_original;
        const priceB = b.en_oferta && b.precio_oferta ? b.precio_oferta : b.precio_original;
        return priceA - priceB;
      });
      break;
    case 'precio-desc':
      sortedProducts.sort((a, b) => {
        const priceA = a.en_oferta && a.precio_oferta ? a.precio_oferta : a.precio_original;
        const priceB = b.en_oferta && b.precio_oferta ? b.precio_oferta : b.precio_original;
        return priceB - priceA;
      });
      break;
    case 'fecha-desc':
      sortedProducts.sort((a, b) => 
        new Date(b.fecha_agregado).getTime() - new Date(a.fecha_agregado).getTime()
      );
      break;
    case 'nombre-asc':
      sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'nombre-desc':
      sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    default:
      break;
  }

  return sortedProducts;
};
