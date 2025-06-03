
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Eleganza</h2>
            <p className="text-gray-300 mb-4 max-w-md">
              Tu destino para la moda elegante y contemporánea. Descubre nuestras colecciones exclusivas diseñadas para destacar tu estilo único.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="/productos" className="text-gray-300 hover:text-white transition-colors">Productos</a></li>
              <li><a href="/productos?categoria=Camisas" className="text-gray-300 hover:text-white transition-colors">Camisas</a></li>
              <li><a href="/productos?categoria=Vestidos" className="text-gray-300 hover:text-white transition-colors">Vestidos</a></li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@eleganza.com</li>
              <li>Teléfono: +52 55 1234 5678</li>
              <li>WhatsApp: +52 55 8765 4321</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Eleganza. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
