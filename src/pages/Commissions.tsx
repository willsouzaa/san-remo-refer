import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, DollarSign, Calendar, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Commission {
  id: string;
  deal_value: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  created_at: string;
  referral: {
    id: string;
    address: string;
    property_type: string;
  };
}

export default function Commissions() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchCommissions();
  }, [user]);

  const fetchCommissions = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('commissions')
      .select(`
        *,
        referral:referrals(id, address, property_type)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching commissions:', error);
    } else {
      setCommissions(data || []);
    }
    setLoading(false);
  };

  const totalPending = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  const totalPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pendente
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPending)}
              </div>
              <p className="text-xs text-muted-foreground">
                Comissões aguardando pagamento
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pago
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPaid)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total já recebido
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Minhas Comissões
            </CardTitle>
            <CardDescription>
              Histórico de comissões das suas indicações fechadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando comissões...</p>
                </div>
              </div>
            ) : commissions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma comissão ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não possui comissões registradas. Continue indicando imóveis!
                </p>
                <Button onClick={() => navigate('/indicar')}>
                  Indicar imóvel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                          {commission.status === 'paid' ? 'Pago' : 'Pendente'}
                        </Badge>
                        <span className="text-sm text-muted-foreground capitalize">
                          {commission.referral.property_type}
                        </span>
                      </div>
                      <p className="font-medium">{commission.referral.address}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(commission.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <span>
                          Taxa: {(commission.commission_rate * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(commission.commission_amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Negócio: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(commission.deal_value)}
                      </div>
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