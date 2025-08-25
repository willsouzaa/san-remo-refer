import { Button } from "@/components/ui/button"
import { Building2, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "FAQ", href: "/faq" }
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elegant group-hover:shadow-gold transition-all duration-300">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-primary">San Remo</span>
              <span className="text-sm text-secondary block -mt-1 font-medium">Indica</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  isActive(item.href) 
                    ? "text-secondary border-b-2 border-secondary pb-1" 
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Entrar
            </Button>
            <Button variant="hero" onClick={() => window.location.href = '/indicar'}>
              Indicar Imóvel
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-primary hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-muted text-secondary"
                      : "text-muted-foreground hover:text-secondary hover:bg-muted/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/auth'}>
                  Entrar
                </Button>
                <Button variant="hero" className="w-full" onClick={() => window.location.href = '/indicar'}>
                  Indicar Imóvel
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header