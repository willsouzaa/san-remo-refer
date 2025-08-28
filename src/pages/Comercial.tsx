import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuth from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, DollarSign, TrendingUp, Share2, Copy, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateReferralLink, shareToWhatsApp, shareToFacebook, shareToInstagram } from '@/utils/shareUtils';

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  total_referrals: number;
  total_commission: number;
}

interface Commission {
  id: string;
  commission_amount: number;
  status: string;
  created_at: string;
  deal_value: number;
}

export default function Comercial() {
  const { user } = useAuth();
  const userRole = useUserRole();
  const navigate = useNavigate();
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferred: 0,
    totalCommission: 0,
    activeReferrals: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (userRole !== 'commercial' && userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchCommercialData();
  }, [user, userRole, navigate]);

  const fetchCommercialData = async () => {
    if (!user) return;
    
    setLoading(true);

    // For now, we'll simulate commercial data since the referred_by relationship isn't implemented
    // In a real scenario, you'd have a referred_by field in profiles table
    
    // Fetch all users (simulating referred users for demonstration)
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .eq('role', 'indicator');

    // Fetch commissions related to those users
    const { data: commissionsData } = await supabase
      .from('commissions')
      .select(`
        *,
        profiles!inner(name, email)
      `);

    // Calculate stats (simplified for demonstration)
    const totalCommission = commissionsData?.reduce((sum, c) => sum + c.commission_amount, 0) || 0;
    const activeReferrals = users?.length || 0;

    setReferredUsers(users?.map(user => ({
      ...user,
      total_referrals: Math.floor(Math.random() * 10), // Simulated data
      total_commission: Math.floor(Math.random() * 5000) // Simulated data
    })) || []);

    setCommissions(commissionsData || []);
    
    setStats({
      totalReferred: users?.length || 0,
      totalCommission,
      activeReferrals
    });

    setLoading(false);
  };

  const copyReferralLink = () => {
    const link = generateReferralLink(user?.id || '');
    navigator.clipboard.writeText(link);
    alert('Link de referência copiado para o clipboard!');
  };

  if (!user || (userRole !== 'commercial' && userRole !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Painel Comercial
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus indicadores e acompanhe as comissões
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Indicadores Referidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReferred}</div>
              <p className="text-xs text-muted-foreground">
                Total de usuários indicados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Indicações Ativas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeReferrals}</div>
              <p className="text-xs text-muted-foreground">
                Indicadores ativos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalCommission)}
              </div>
              <p className="text-xs text-muted-foreground">
                De indicações dos seus referidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Link de Convite
            </CardTitle>
            <CardDescription>
              Compartilhe seu link de referência para captar novos indicadores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono break-all">
                  {generateReferralLink(user.id)}
                </p>
                <Button variant="outline" size="sm" onClick={copyReferralLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button onClick={() => shareToWhatsApp(user.id)} variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button onClick={() => shareToFacebook(user.id)} variant="outline" size="sm">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button onClick={() => shareToInstagram(user.id)} variant="outline" size="sm">
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </Button>
              <Button onClick={copyReferralLink} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referred Users */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Indicadores Referidos</CardTitle>
            <CardDescription>
              Lista dos indicadores que você trouxe para a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : referredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum indicador referido ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Compartilhe seu link de convite para começar a ganhar comissões
                </p>
                <Button onClick={copyReferralLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar Link
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {referredUsers.map((referredUser) => (
                  <div
                    key={referredUser.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{referredUser.name}</p>
                      <p className="text-sm text-muted-foreground">{referredUser.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Referido em {format(new Date(referredUser.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {referredUser.total_referrals} indicações
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(referredUser.total_commission)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Commissions */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Histórico de Comissões</CardTitle>
            <CardDescription>
              Suas comissões provenientes dos indicadores referidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {commissions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma comissão ainda</h3>
                <p className="text-muted-foreground">
                  As comissões aparecerão quando seus indicadores fecharem negócios
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {commissions.slice(0, 5).map((commission) => (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                          {commission.status === 'paid' ? 'Pago' : 'Pendente'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(commission.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Valor do negócio: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(commission.deal_value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(commission.commission_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}