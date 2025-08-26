import { Button } from "@/components/ui/button"
import { Building2, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <span className="font-bold text-blue-800 text-lg">San Remo Imóveis</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="#como-funciona" className="text-sm font-medium text-blue-800 hover:text-orange-500">
            Como funciona
          </Link>
          <Link to="#sobre-aplicativo" className="text-sm font-medium text-blue-800 hover:text-orange-500">
            Sobre o aplicativo
          </Link>
          <Button variant="secondary" onClick={() => window.location.href='/indicar'}>
            INDICAR
          </Button>
        </nav>

        {/* Mobile Menu */}
        <button className="md:hidden p-2 rounded-lg text-blue-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow py-2 flex flex-col items-center space-y-2">
          <Link to="#como-funciona" className="text-blue-800 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>
            Como funciona
          </Link>
          <Link to="#sobre-aplicativo" className="text-blue-800 hover:text-orange-500" onClick={() => setIsMenuOpen(false)}>
            Sobre o aplicativo
          </Link>
          <Button variant="secondary" className="w-4/5" onClick={() => window.location.href='/indicar'}>
            INDICAR
          </Button>
        </div>
      )}
    </header>
  )
}

export default Header
