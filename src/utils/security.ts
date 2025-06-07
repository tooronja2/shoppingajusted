
import { z } from 'zod';
import CryptoJS from 'crypto-js';
import DOMPurify from 'dompurify';

// Secret key for encryption (in production, this should be from environment variables)
const ENCRYPTION_KEY = 'luxe-store-secret-key-2024';

// Product schema with proper optional fields
export const productSchema = z.object({
  sku: z.string(),
  nombre: z.string(),
  categoria_slug: z.string(),
  genero: z.string().optional(),
  marca: z.string(),
  precio_original: z.number(),
  precio_oferta: z.number().optional().nullable(), // Made optional and nullable to handle null values
  en_oferta: z.boolean(),
  porcentaje_descuento: z.number(),
  descripcion_corta: z.string(),
  descripcion_larga: z.string(),
  fotos: z.array(z.string()),
  disponible: z.boolean(),
  cantidad_stock: z.number(),
  detalles: z.object({
    tallas_disponibles: z.array(z.string()),
    colores_disponibles: z.array(z.object({
      nombre: z.string(),
      hex: z.string()
    })),
    material: z.string(),
    cuidados: z.string()
  }),
  fecha_agregado: z.string(),
  slug_url_producto: z.string(),
  etiquetas: z.array(z.string())
});

// Config schema with proper validation
export const configSchema = z.object({
  nombre_tienda: z.string(),
  meta_titulo_principal: z.string(),
  meta_descripcion_principal: z.string(),
  logo_url: z.string(),
  favicon_url: z.string(),
  telefono_contacto_visible: z.string(),
  email_contacto_principal: z.string(),
  direccion_fisica_opcional: z.string(),
  banner_principal_home: z.object({
    activo: z.boolean(),
    imagen_url_desktop: z.string(),
    imagen_url_mobile: z.string(),
    alt_text: z.string(),
    titulo_superpuesto: z.string(),
    subtitulo_superpuesto: z.string(),
    texto_boton: z.string(),
    link_boton: z.string()
  }),
  secciones_home_destacadas: z.array(z.object({
    titulo_seccion: z.string(),
    criterio_productos: z.string(),
    limite: z.number()
  })),
  texto_footer_copyright: z.string(),
  links_redes_sociales: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional()
  }),
  menu_navegacion_principal: z.array(z.object({
    texto: z.string(),
    url: z.string(),
    subcategorias: z.array(z.object({
      texto: z.string(),
      url: z.string()
    })).optional()
  })),
  footer_links_ayuda: z.array(z.object({
    texto: z.string(),
    url: z.string()
  })),
  moneda_simbolo: z.string(),
  whatsapp_numero_consultas: z.string()
});

// Input sanitization function
export const sanitizeInput = (input: string): string => {
  // Remove any potentially harmful scripts or HTML
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
};

// Email validation function
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation function
export const validatePhone = (phone: string): boolean => {
  // Simple phone validation - allows numbers, spaces, dashes, parentheses, and plus
  const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){6,}$/;
  return phoneRegex.test(phone);
};

// URL validation function
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Webhook URL validation function
export const validateWebhookUrl = (url: string): boolean => {
  if (!validateUrl(url)) return false;
  
  try {
    const urlObj = new URL(url);
    // Additional webhook-specific validation (must be https)
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Encryption functions
export const encryptCartData = (data: any): string | null => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const decryptCartData = (encryptedData: string): any | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
