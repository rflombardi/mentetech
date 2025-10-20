import { Search, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNewsletter } from "@/contexts/NewsletterContext";
import logoMenteTech from "@/assets/logo-mente-tech-new.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Categoria } from "@/types/blog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

interface HeaderProps {
  categorias: Categoria[];
}

const Header = ({ categorias }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useNewsletter();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src={logoMenteTech} 
              alt="Mente Tech Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">Mente Tech</h1>
              <p className="text-xs text-muted-foreground -mt-1">IA para PMEs</p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 ml-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Início
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors duration-200 font-medium bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                    Categorias
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 bg-background">
                      <div className="grid gap-2">
                        {categorias && categorias.length > 0 ? (
                          categorias.map((categoria) => (
                            <Link
                              key={categoria.id}
                              to={`/categoria/${categoria.slug}`}
                              className="group block p-3 rounded-md hover:bg-accent transition-colors duration-200"
                            >
                              <div className="font-medium text-foreground group-hover:text-accent-foreground transition-colors">{categoria.nome}</div>
                              {categoria.descricao && (
                                <p className="text-sm text-muted-foreground group-hover:text-accent-foreground mt-1 line-clamp-2 transition-colors">
                                  {categoria.descricao}
                                </p>
                              )}
                            </Link>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-muted-foreground">
                            Nenhuma categoria disponível
                          </div>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuViewport />
            </NavigationMenu>
            
            <Link 
              to="/sobre" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Sobre
            </Link>
            <Link 
              to="/contato" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Contato
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar artigos sobre IA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus:bg-background dark:focus:bg-muted transition-colors duration-200"
              />
            </div>
          </div>

          {/* CTA Button & Admin */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/admin">
              <Button 
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
            <ThemeToggle />
            <Button 
              onClick={openModal}
              variant="default"
              className="bg-gradient-primary hover:opacity-90 transition-opacity duration-200"
            >
              Newsletter Gratuita
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </Link>
                {categorias.map((categoria) => (
                  <Link
                    key={categoria.id}
                    to={`/categoria/${categoria.slug}`}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 pl-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {categoria.nome}
                  </Link>
                ))}
                <Link 
                  to="/sobre" 
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link 
                  to="/contato" 
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
                <Link 
                  to="/admin" 
                  className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </nav>
              
              {/* Mobile Theme Toggle */}
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              
              {/* Mobile CTA */}
              <Button 
                onClick={() => {
                  setIsMenuOpen(false);
                  openModal();
                }}
                variant="default"
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Newsletter Gratuita
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;