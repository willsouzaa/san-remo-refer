import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { 
  Users, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Plus,
  TrendingUp,
  Calendar,
  Home
} from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  // Mock data - será substituído por dados reais do Supabase
  const stats = {
    totalIndicacoes: 12,
    aprovadas: 8,
    fechadas: 3,
    comissaoEstimada: 4500
  }

  const recentIndicacoes = [
    {
      id: 1,
      endereco: "Rua das Flores, 123 - Vila Madalena",
      tipo: "Apartamento",
      valor: 450000,
      status: "em_analise",
      data: "2024-01-15",
      proprietario: "João Silva"
    },
    {
      id: 2,
      endereco: "Av. Paulista, 1000 - Bela Vista",
      tipo: "Comercial",
      valor: 890000,
      status: "aprovado",
      data: "2024-01-10",
      proprietario: "Maria Santos"
    },
    {
      id: 3,
      endereco: "Rua Augusta, 500 - Consolação",
      tipo: "Casa",
      valor: 750000,
      status: "fechado",
      data: "2024-01-05",
      proprietario: "Carlos Lima"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'em_analise': return 'bg-blue-100 text-blue-800'
      case 'aprovado': return 'bg-green-100 text-green-800'
      case 'rejeitado': return 'bg-red-100 text-red-800'
      case 'fechado': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente'
      case 'em_analise': return 'Em Análise'
      case 'aprovado': return 'Aprovado'
      case 'rejeitado': return 'Rejeitado'
      case 'fechado': return 'Fechado'
      default: return 'Desconhecido'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Bem-vindo ao seu Dashboard
            </h1>
            <p className="text-muted-foreground">
              Acompanhe suas indicações e comissões em tempo real
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Indicações
                </CardTitle>
                <FileText className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.totalIndicacoes}</div>
                <p className="text-xs text-muted-foreground">+2 esta semana</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Aprovadas
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.aprovadas}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.aprovadas / stats.totalIndicacoes) * 100)}% de aprovação
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Negócios Fechados
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.fechadas}</div>
                <p className="text-xs text-muted-foreground">+1 este mês</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50 hover:shadow-gold transition-all duration-300 bg-gradient-gold text-secondary-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary-foreground/80">
                  Comissão Estimada
                </CardTitle>
                <DollarSign className="h-4 w-4 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {stats.comissaoEstimada.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-secondary-foreground/80">
                  10% sobre negócios fechados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Indicações Recentes</CardTitle>
                <CardDescription>
                  Suas últimas indicações e seus status atuais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIndicacoes.map((indicacao) => (
                    <div key={indicacao.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30 hover:shadow-card transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Home className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-primary">{indicacao.endereco}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{indicacao.tipo}</span>
                            <span>•</span>
                            <span>R$ {indicacao.valor.toLocaleString('pt-BR')}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(indicacao.data).toLocaleDateString('pt-BR')}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(indicacao.status)}>
                        {getStatusText(indicacao.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/minhas-indicacoes">Ver Todas as Indicações</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Ações Rápidas</CardTitle>
                <CardDescription>
                  Acesse rapidamente as principais funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="hero" className="w-full" size="lg" asChild>
                  <Link to="/indicar">
                    <Plus className="mr-2 h-5 w-5" />
                    Nova Indicação
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/comissoes">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Minhas Comissões
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/faq">
                    <Users className="mr-2 h-4 w-4" />
                    Central de Ajuda
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Banner */}
          <Card className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    🎉 Programa de Indicação San Remo
                  </h3>
                  <p className="text-primary-foreground/90">
                    Ganhe <strong>10% de comissão</strong> sobre cada negócio fechado. 
                    Simples, rápido e seguro!
                  </p>
                </div>
                <Button variant="secondary" asChild>
                  <Link to="/faq">Saiba Mais</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard