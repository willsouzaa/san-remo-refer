import { Building2, Phone, MessageCircle, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shadow-gold">
                <Building2 className="h-7 w-7 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">San Remo Indica</h3>
                <p className="text-primary-foreground/70 text-sm">Imobiliária San Remo</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-md">
              Indique imóveis para a San Remo e ganhe recompensas quando o negócio for fechado. 
              Simples, rápido e seguro. Faça parte da nossa rede de indicadores.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-secondary">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-secondary flex-shrink-0" />
                <div>
                  <p className="text-primary-foreground/90">(11) 3456-7890</p>
                  <p className="text-primary-foreground/70 text-xs">Segunda à Sexta, 9h às 18h</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left p-0 h-auto hover:bg-primary-light/20"
                asChild
              >
                <a 
                  href="https://wa.me/5511987654321" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-sm py-2"
                >
                  <MessageCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                  <div>
                    <p className="text-primary-foreground/90">(11) 98765-4321</p>
                    <p className="text-primary-foreground/70 text-xs">WhatsApp - 24h</p>
                  </div>
                </a>
              </Button>

              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary-foreground/90">Rua das Palmeiras, 123</p>
                  <p className="text-primary-foreground/70 text-xs">Centro - São Paulo/SP</p>
                  <p className="text-primary-foreground/70 text-xs">CEP: 01234-567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-secondary">Redes Sociais</h4>
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto hover:bg-primary-light/20"
                asChild
              >
                <a 
                  href="https://facebook.com/sanremo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-sm py-2"
                >
                  <Facebook className="h-4 w-4 text-secondary" />
                  <span className="text-primary-foreground/90">Facebook</span>
                </a>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto hover:bg-primary-light/20"
                asChild
              >
                <a 
                  href="https://instagram.com/sanremo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-sm py-2"
                >
                  <Instagram className="h-4 w-4 text-secondary" />
                  <span className="text-primary-foreground/90">Instagram</span>
                </a>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto hover:bg-primary-light/20"
                asChild
              >
                <a 
                  href="https://linkedin.com/company/sanremo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-sm py-2"
                >
                  <Linkedin className="h-4 w-4 text-secondary" />
                  <span className="text-primary-foreground/90">LinkedIn</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Imobiliária San Remo. Todos os direitos reservados.
          </p>
          <p className="text-primary-foreground/40 text-xs mt-1">
            Desenvolvido com tecnologia Lovable
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer