import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Home, TrendingUp, CheckCircle, DollarSign, Calendar, LogOut, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Referral {
  id: string;
  address: string;
  property_type: string;
  status: string;
  estimate_value: number | null;
  created_at: string;
}

interface Stats {
  total: number;
  approved: number;
  closed: number;
  totalCommission: number;
}

export default function Dashboard() {
  // Excluir indicação
  const handleDeleteReferral = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta indicação?')) return;
    // Busca os dados antes de excluir para enviar ao webhook
    const { data: referralData, error: fetchError } = await supabase.from('referrals').select('*').eq('id', id).single();
    if (fetchError || !referralData) {
      alert('Erro ao buscar imóvel para exclusão: ' + (fetchError?.message || 'Não encontrado'));
      return;
    }
    const { error } = await supabase.from('referrals').delete().eq('id', id);
    if (error) {
      alert('Erro ao excluir: ' + error.message);
      console.error('Detalhes do erro Supabase ao excluir:', error);
    } else {
      setReferrals(referrals.filter(r => r.id !== id));
      setStats(s => ({ ...s, total: s.total - 1 }));
      // Envia webhook para n8n
      try {
        await fetch('https://pauloamancio1.app.n8n.cloud/webhook-test/6c1e5c7d-cbd7-47e6-9207-a8185724479f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...referralData, action: 'delete' })
        });
      } catch (err) {
        console.error('Erro ao enviar webhook de exclusão:', err);
      }
    }
  };
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, closed: 0, totalCommission: 0 });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch referrals
    const { data: referralsData, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch all referrals for stats
    const { data: allReferrals, error: statsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('user_id', user.id);

    // Fetch commissions
    const { data: commissionsData, error: commissionsError } = await supabase
      .from('commissions')
      .select('commission_amount')
      .eq('user_id', user.id);

    if (referralsError || statsError || commissionsError) {
      console.error('Error fetching dashboard data:', { referralsError, statsError, commissionsError });
    } else {
      setReferrals(referralsData || []);

      const totalCommission = (commissionsData || []).reduce((sum, c) => sum + c.commission_amount, 0);

      setStats({
        total: allReferrals?.length || 0,
        approved: allReferrals?.filter(r => r.status === 'aprovado').length || 0,
        closed: allReferrals?.filter(r => r.status === 'fechado').length || 0,
        totalCommission
      });
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'secondary';
      case 'em_analise': return 'outline';
      case 'aprovado': return 'default';
      case 'fechado': return 'default';
      case 'rejeitado': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em análise';
      case 'aprovado': return 'Aprovado';
      case 'fechado': return 'Fechado';
      case 'rejeitado': return 'Rejeitado';
      default: return status;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Olá, {user.name || user.email}! Acompanhe suas indicações e ganhos.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/indicar')} size="lg" className="shadow-elegant">
              <Plus className="h-4 w-4 mr-2" />
              Indicar Imóvel
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Indicações
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Indicações registradas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Indicações Aprovadas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.approved}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% de aprovação
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Negócios Fechados
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.closed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}% conversão
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Comissão Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalCommission)}
              </div>
              <p className="text-xs text-muted-foreground">
                Taxa de 10% sobre vendas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Referrals and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Indicações Recentes</CardTitle>
              <CardDescription>
                Suas últimas indicações de imóveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando indicações...</p>
                  </div>
                </div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma indicação ainda</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece indicando seu primeiro imóvel para a San Remo
                  </p>
                  <Button onClick={() => navigate('/indicar')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Fazer primeira indicação
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(referral.status)}>
                            {getStatusLabel(referral.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground capitalize">
                            {referral.property_type}
                          </span>
                        </div>
                        <p className="font-medium">{referral.address}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(referral.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        {referral.estimate_value && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Valor estimado</p>
                            <p className="font-semibold">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(referral.estimate_value)}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Button size="icon" variant="ghost" title="Editar" onClick={() => navigate(`/editar-indicacao/${referral.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" title="Excluir" onClick={() => handleDeleteReferral(referral.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/indicar')} className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Nova Indicação
              </Button>
              <Button onClick={() => navigate('/comissoes')} variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Ver Comissões
              </Button>
              <Button onClick={() => navigate('/faq')} variant="outline" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}