import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { 
  ArrowRight, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Shield, 
  Users,
  Star,
  Handshake,
  TrendingUp,
  Home,
  Phone
} from "lucide-react"
import { Link } from "react-router-dom"
import heroImage from "@/assets/hero-bg.jpg"

const LandingPage = () => {
  const features = [
  {
    icon: DollarSign,
    title: "Comissão Garantida",
    description: "Ganhe até 10% sobre o valor líquido de cada negócio fechado. Quanto mais indicar, mais você fatura!",
    highlight: "Comissões altas"
  },
  {
    icon: Clock,
    title: "Processo Ágil",
    description: "Sistema simples e intuitivo. Cadastre suas indicações em minutos e acompanhe o status em tempo real.",
    highlight: "Rápido e fácil"
  },
  {
    icon: Shield,
    title: "Totalmente Seguro",
    description: "Seus dados e os do proprietário são protegidos com tecnologia de ponta, garantindo segurança total nas transações.",
    highlight: "100% seguro"
  }
]


  const steps = [
  {
    step: "1",
    title: "Cadastre-se",
    description: "Crie sua conta gratuita e tenha acesso imediato ao dashboard de indicações."
  },
  {
    step: "2", 
    title: "Indique Imóveis",
    description: "Preencha o formulário de forma rápida e maximize suas chances de receber comissões."
  },
  {
    step: "3",
    title: "Acompanhe",
    description: "Veja o status das suas indicações em tempo real e saiba exatamente quando a comissão será liberada."
  },
  {
    step: "4",
    title: "Receba",
    description: "Receba pagamentos rapidamente assim que o negócio for fechado, sem burocracia."
  }
]


  const testimonials = [
    {
      name: "Ana Paula",
      role: "Indicadora desde 2023",
      content: "Já ganhei mais de R$ 15.000 em comissões indicando imóveis para a San Remo. Super recomendo!",
      rating: 5
    },
    {
      name: "Roberto Silva",
      role: "Corretor parceiro",
      content: "O sistema é muito fácil de usar e o pagamento sempre em dia. Excelente oportunidade!",
      rating: 5
    },
    {
      name: "Mariana Costa",
      role: "Nova indicadora",
      content: "Minha primeira indicação já foi aprovada! Processo super transparente e equipe muito atenciosa.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        </div>
        
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto text-primary-foreground">
            <Badge className="mb-6 bg-secondary text-secondary-foreground shadow-gold">
              ✨ Programa San Remo Indica
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
  Indique imóveis para a <span className="text-secondary">San Remo</span> e <span className="text-secondary">ganhe até 10% de comissão</span>
</h1>

            
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
  <strong>Simples, rápido e seguro.</strong> Conecte proprietários à San Remo e <strong>garanta sua comissão em cada negócio fechado</strong>.
</p>

            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/dashboard">
                  Faça parte da rede de indicadores
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/indicar">Indicar Imóvel</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">10%</div>
                <div className="text-sm text-primary-foreground/80">Comissão padrão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">R$ 1M+</div>
                <div className="text-sm text-primary-foreground/80">Já pagos em comissões</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">500+</div>
                <div className="text-sm text-primary-foreground/80">Indicadores ativos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Por que escolher o San Remo Indica?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A forma mais inteligente de monetizar sua rede de contatos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                      <IconComponent className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="mx-auto">{feature.highlight}</Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              4 passos simples para começar a ganhar dinheiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-elegant group-hover:shadow-gold transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 translate-x-4 text-muted-foreground h-6 w-6" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              O que dizem nossos indicadores
            </h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para começar a ganhar?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
  Junte-se a centenas de indicadores que já estão <strong>lucrando milhares de reais</strong> com o San Remo Indica.
</p>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/dashboard">
                <Users className="mr-2 h-5 w-5" />
                Entrar na Rede
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
              asChild
            >
              <a href="https://wa.me/5511987654321" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-5 w-5" />
                Falar Conosco
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage