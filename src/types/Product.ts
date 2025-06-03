
export interface ProductDetails {
  talla?: string[];
  color?: string;
  material?: string;
  largo?: string;
  corte?: string;
  ocasion?: string;
  [key: string]: any; // Para flexibilidad con nuevos atributos
}

export interface Product {
  sku: string;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion_corta: string;
  descripcion_larga: string;
  fotos: string[];
  disponible: boolean;
  cantidad_stock: number;
  detalles: ProductDetails;
  fecha_agregado: string;
  slug_url_producto: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: {
    talla?: string;
    [key: string]: any;
  };
}

export interface HomeConfig {
  banner: {
    titulo: string;
    subtitulo: string;
    imagen: string;
    cta_texto: string;
    cta_link: string;
  };
  productos_destacados_cantidad: number;
}
