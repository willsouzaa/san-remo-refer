import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { HelpCircle, DollarSign, Clock, Home, Users, Star } from "lucide-react"

const FAQ = () => {
  const faqs = [
    {
      question: "Quanto recebo por indicação?",
      answer: "Você recebe uma comissão de 10% sobre o valor líquido recebido pela imobiliária quando o negócio é fechado. Por exemplo: se a imobiliária receber R$ 10.000 de comissão, você ganha R$ 1.000. Essa porcentagem pode variar em casos especiais e será sempre informada previamente.",
      icon: DollarSign,
      category: "Comissão"
    },
    {
      question: "Quando recebo minha comissão?",
      answer: "Sua comissão é paga após a conclusão do negócio e o recebimento da comissão pela San Remo. O prazo médio é de 30 dias após o fechamento do contrato. Você acompanha o status no seu dashboard em tempo real.",
      icon: Clock,
      category: "Pagamento"
    },
    {
      question: "Quais tipos de imóveis posso indicar?",
      answer: "Você pode indicar qualquer tipo de imóvel: casas, apartamentos, terrenos, imóveis comerciais, rurais e de temporada. Não há restrição de valor ou localização, desde que o proprietário tenha interesse real em vender.",
      icon: Home,
      category: "Indicações"
    },
    {
      question: "Como funciona o processo de indicação?",
      answer: "É muito simples: 1) Cadastre-se no sistema, 2) Preencha o formulário com os dados do imóvel e proprietário, 3) Nossa equipe entra em contato com o proprietário, 4) Acompanhe o status pelo dashboard, 5) Receba sua comissão quando o negócio for fechado.",
      icon: Users,
      category: "Processo"
    },
    {
      question: "Preciso ter CRECI para indicar imóveis?",
      answer: "Não! Qualquer pessoa pode ser um indicador. Você não precisa de CRECI ou conhecimento técnico em imóveis. Basta conhecer pessoas que querem vender seus imóveis e fazer a conexão com a San Remo.",
      icon: Star,
      category: "Requisitos"
    },
    {
      question: "E se o proprietário não fechar negócio?",
      answer: "Não tem problema! Você só recebe comissão quando o negócio é efetivamente fechado, mas não há penalidade alguma se isso não acontecer. Cada indicação é uma oportunidade, e mesmo as não concretizadas ajudam a construir seu histórico no sistema.",
      icon: HelpCircle,
      category: "Processo"
    },
    {
      question: "Posso indicar imóveis de parentes e amigos?",
      answer: "Sim! Você pode indicar imóveis de qualquer pessoa, incluindo familiares e amigos. Na verdade, essas são as melhores indicações, pois há maior confiança entre as partes envolvidas.",
      icon: Users,
      category: "Indicações"
    },
    {
      question: "Há limite de indicações que posso fazer?",
      answer: "Não há limite! Você pode fazer quantas indicações quiser. Quanto mais indicações qualificadas você fizer, maior seu potencial de ganhos. Nosso sistema acompanha seu histórico e performance.",
      icon: Star,
      category: "Indicações"
    }
  ]

  const categories = [...new Set(faqs.map(faq => faq.category))]

  return (
    <div className="min-h-screen bg-background">

      
      <main className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-6 shadow-gold">
              <HelpCircle className="h-8 w-8 text-secondary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre o programa San Remo Indica e comece a ganhar dinheiro indicando imóveis
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="px-4 py-2">
                {category}
              </Badge>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Dúvidas Comuns</CardTitle>
                <CardDescription>
                  Encontre respostas para as principais perguntas sobre indicações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => {
                    const IconComponent = faq.icon
                    return (
                      <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                        <AccordionTrigger className="text-left group hover:text-secondary transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                              <IconComponent className="h-4 w-4 text-secondary" />
                            </div>
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pl-11 pr-4 pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-hero text-primary-foreground shadow-elegant">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
                <p className="text-primary-foreground/90 mb-6">
                  Nossa equipe está pronta para ajudar você a começar
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/5511987654321" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-6 py-2 rounded-md font-medium transition-all duration-300 shadow-gold hover:shadow-elegant transform hover:scale-105"
                  >
                    Falar no WhatsApp
                  </a>
                  <a 
                    href="tel:1134567890"
                    className="inline-flex items-center justify-center gap-2 border border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground h-10 px-6 py-2 rounded-md font-medium transition-all duration-300"
                  >
                    Ligar Agora
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FAQ