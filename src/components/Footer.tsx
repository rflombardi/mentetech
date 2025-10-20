import { Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNewsletter } from "@/contexts/NewsletterContext";
import logoMenteTech from "@/assets/logo-mente-tech-new.png";
import { Categoria } from "@/types/blog";

interface FooterProps {
  categorias: Categoria[];
}

const Footer = ({ categorias }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const { openModal } = useNewsletter();

  return (
    <footer className="bg-gradient-to-br from-primary to-secondary text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={logoMenteTech} 
                alt="Mente Tech Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">Mente Tech</h3>
                <p className="text-white/80 text-sm">IA para PMEs</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Democratizando o acesso à Inteligência Artificial para pequenas e médias empresas brasileiras.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categorias</h4>
            <ul className="space-y-2 text-sm">
              {categorias.slice(0, 4).map((categoria) => (
                <li key={categoria.id}>
                  <Link 
                    to={`/categoria/${categoria.slug}`}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {categoria.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/guias" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Guias Práticos
                </Link>
              </li>
              <li>
                <Link 
                  to="/cases" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Cases de Sucesso
                </Link>
              </li>
              <li>
                <Link 
                  to="/ferramentas" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Ferramentas Recomendadas
                </Link>
              </li>
              <li>
                <Link 
                  to="/glossario" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Glossário de IA
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/sobre" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link 
                  to="/contato" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacidade" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to="/termos" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold">Fique por dentro das novidades</h4>
            <p className="text-white/80 text-sm max-w-md mx-auto">
              Receba conteúdo exclusivo sobre IA para PMEs direto no seu e-mail
            </p>
            <Button 
              onClick={openModal}
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 font-medium px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Mail className="h-5 w-5 mr-3" />
              Assinar Newsletter Gratuita
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-white/80">
              © {currentYear} Mente Tech. Todos os direitos reservados.
            </div>
            <div className="text-sm text-white/80">
              Feito com ❤️ para PMEs brasileiras
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;