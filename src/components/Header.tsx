import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useIsAdmin, useIsStaff, useUserRole } from "@/hooks/useIsAdmin";

interface NavigationItem {
  name: string;
  href: string;
  section: "public" | "user" | "admin" | "finance" | "commercial";
  protected?: boolean;
  adminOnly?: boolean;
  financeOnly?: boolean;
  commercialOnly?: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const isStaff = useIsStaff();
  const userRole = useUserRole();
  const navigate = useNavigate();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Organização das rotas por seção
  const navigation: NavigationItem[] = [
    { name: "Início", href: "/", section: "public" },
    { name: "Como Funciona", href: "/como-funciona", section: "public" },
    { name: "Sobre o Aplicativo", href: "/sobre-aplicativo", section: "public" },
    { name: "FAQ", href: "/faq", section: "public" },

    { name: "Dashboard", href: "/dashboard", section: "user", protected: true },
    { name: "Indicar", href: "/indicar", section: "user", protected: true },
    { name: "Comissões", href: "/comissoes", section: "user", protected: true },

    { name: "Admin", href: "/admin", section: "admin", adminOnly: true },
    { name: "Gestão de Imóveis", href: "/gestao-imoveis", section: "admin", adminOnly: true },
    { name: "Usuários", href: "/usuarios", section: "admin", adminOnly: true },

    { name: "Financeiro", href: "/financeiro", section: "finance", financeOnly: true },
    { name: "Comercial", href: "/comercial", section: "commercial", commercialOnly: true },
  ];

  // Filtra e organiza por seção
  const sections = [
    { title: "Área do Usuário", key: "user" },
    { title: "Administração", key: "admin" },
    { title: "Financeiro", key: "finance" },
    { title: "Comercial", key: "commercial" },
    { title: "Público", key: "public" },
  ];

  const filteredNavigation = (section: string) =>
    navigation.filter((item) => {
      if (item.section !== section) return false;
      if (item.protected && !user) return false;
      if (item.adminOnly && !isAdmin) return false;
      if (item.financeOnly && userRole !== "finance" && !isAdmin) return false;
      if (item.commercialOnly && userRole !== "commercial" && !isAdmin) return false;
      return true;
    });

  const handleSignOut = () => {
    logout();
    navigate("/auth");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center shadow-lg">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <span className="font-bold text-blue-800 text-lg tracking-wide">San Remo Imóveis</span>
        </Link>

        {/* Botão Menu Hambúrguer estilizado */}
        <button
          className={`p-2 rounded-lg transition-colors duration-200 border-2 border-blue-100 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-800 shadow ${isMenuOpen ? "bg-blue-100" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

       {/* Sidebar lateral */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? "visible" : "invisible pointer-events-none"}`}
        style={{ background: isMenuOpen ? "rgba(0,0,0,0.25)" : "transparent" }}
      >
        <nav
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100">
            <span className="font-bold text-blue-800 text-lg">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
              <X className="h-6 w-6 text-blue-800" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {sections.map((section) => {
              const items = filteredNavigation(section.key);
              if (!items.length) return null;
              return (
                <div key={section.key}>
                  <div className="text-xs font-semibold text-blue-400 uppercase mb-2">{section.title}</div>
                  <div className="flex flex-col space-y-1">
                    {items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="text-blue-800 hover:bg-blue-50 hover:text-orange-500 text-base font-medium rounded transition-colors py-2 px-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-4 border-t border-blue-100">
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-1" /> Sair
              </Button>
            ) : (
              <Link
                to="/auth"
                className="w-full text-blue-800 hover:bg-blue-50 hover:text-orange-500 text-base font-medium rounded transition-colors py-2 text-center block"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;