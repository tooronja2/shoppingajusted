
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Button } from '@/components/ui/button';
import { useMagneticEffect } from '../hooks/useScrollAnimation';

const Header = () => {
  const { config, getCartItemsCount } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const cartItemsCount = getCartItemsCount();
  const logoRef = useMagneticEffect();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  if (!config) return null;

  console.log('Header - config.links_redes_sociales:', config.links_redes_sociales);

  return (
    <header className={`bg-white border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg backdrop-blur-md bg-white/95' : 'shadow-sm'
    }`}>
      {/* Top bar with contact info */}
      <div className="bg-black text-white py-2 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm relative z-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 hover:text-purple-300 transition-colors">
              <Phone className="w-4 h-4 animate-pulse" />
              {config.telefono_contacto_visible}
            </span>
            <span className="hidden md:block hover:text-purple-300 transition-colors">{config.email_contacto_principal}</span>
          </div>
          <div className="flex items-center gap-4">
            {config.links_redes_sociales?.instagram && (
              <a href={config.links_redes_sociales.instagram} target="_blank" rel="noopener noreferrer" 
                 className="hover:text-purple-300 transition-all duration-300 hover:scale-110">
                Instagram
              </a>
            )}
            {config.links_redes_sociales?.facebook && (
              <a href={config.links_redes_sociales.facebook} target="_blank" rel="noopener noreferrer" 
                 className="hover:text-purple-300 transition-all duration-300 hover:scale-110">
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo with improved spacing */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 
                ref={logoRef as React.RefObject<HTMLHeadingElement>}
                className="text-xl md:text-2xl font-bold text-primary gradient-text hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                {config.nombre_tienda}
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation with better spacing */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
            {(config.menu_navegacion_principal || []).map((item, index) => (
              <div key={index} className="relative group">
                <Link
                  to={item.url}
                  className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium text-sm xl:text-base relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left whitespace-nowrap"
                >
                  {item.texto}
                </Link>
                {item.subcategorias && Array.isArray(item.subcategorias) && (
                  <div className="absolute top-full left-0 mt-2 w-48 glass-morphism shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-lg">
                    {item.subcategorias.map((subitem, subindex) => (
                      <Link
                        key={subindex}
                        to={subitem.url}
                        className="block px-4 py-2 text-foreground/80 hover:bg-muted hover:text-foreground transition-all duration-200 first:rounded-t-lg last:rounded-b-lg text-sm"
                      >
                        {subitem.texto}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search bar - hidden on smaller screens to save space */}
          <form onSubmit={handleSearch} className="hidden xl:flex items-center w-full max-w-xs">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 group-hover:shadow-md bg-background text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <Button variant="ghost" size="sm" className="hidden md:flex magnetic-button hover-lift">
              <User className="w-5 h-5" />
            </Button>
            
            <Link to="/carrito" className="relative">
              <Button variant="ghost" size="sm" className="magnetic-button hover-lift">
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden magnetic-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet search - shown on medium and smaller screens */}
        <div className="xl:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border glass-morphism">
          <div className="px-4 py-4 space-y-2">
            {(config.menu_navegacion_principal || []).map((item, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Link
                  to={item.url}
                  className="block py-2 text-foreground/80 hover:text-foreground font-medium transition-all duration-300 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.texto}
                </Link>
                {item.subcategorias && Array.isArray(item.subcategorias) && (
                  <div className="pl-4 space-y-1">
                    {item.subcategorias.map((subitem, subindex) => (
                      <Link
                        key={subindex}
                        to={subitem.url}
                        className="block py-1 text-foreground/60 hover:text-foreground text-sm transition-all duration-300 hover:translate-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subitem.texto}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
