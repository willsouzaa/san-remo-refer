import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Dashboard", href: "/dashboard", protected: true },
    { name: "FAQ", href: "/faq" },
    { name: "Indicar", href: "/indicar", protected: true },
    { name: "Comissões", href: "/comissoes", protected: true },
    { name: "Admin", href: "/admin", adminOnly: true },
    { name: "Como Funciona", href: "/como-funciona" },
    { name: "Sobre o Aplicativo", href: "/sobre-aplicativo" },
  ];

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

      {/* Menu mobile estilizado */}
      {isMenuOpen && (
        <div className="bg-white shadow-lg rounded-b-xl py-6 px-4 flex flex-col items-center space-y-3 animate-fade-in-down border-t border-blue-100">
          {navigation.map((item) => {
            if (item.protected && !user) return null;
            if (item.adminOnly && !isAdmin) return null;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="w-full text-blue-800 hover:bg-blue-50 hover:text-orange-500 text-base font-medium rounded transition-colors py-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="w-full flex flex-col items-center pt-2 border-t border-blue-100">
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center mt-2"
              >
                <LogOut className="h-4 w-4 mr-1" /> Sair
              </Button>
            ) : (
              <Link
                to="/auth"
                className="w-full text-blue-800 hover:bg-blue-50 hover:text-orange-500 text-base font-medium rounded transition-colors py-2 text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Animação fade-in-down */}
      <style>
        {`
          .animate-fade-in-down {
            animation: fadeInDown 0.25s ease;
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;