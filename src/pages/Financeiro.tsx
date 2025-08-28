import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Download, Filter, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { downloadCSV } from '@/utils/shareUtils';

interface Commission {
  id: string;
  commission_amount: number;
  status: string;
  created_at: string;
  deal_value: number;
  commission_rate: number;
  referrals: {
    address: string;
    property_type: string;
  };
  profiles: {
    name: string;
    email: string;
  };
}

export default function Financeiro() {
  const { user } = useAuth();
  const userRole = useUserRole();
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (userRole !== 'finance' && userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchCommissions();
  }, [user, userRole, navigate]);

  const fetchCommissions = async () => {
    setLoading(true);
    
    let query = supabase
      .from('commissions')
      .select(`
        *,
        referrals:referral_id (
          address,
          property_type
        ),
        profiles:user_id (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching commissions:', error);
    } else {
      setCommissions(data || []);
    }

    setLoading(false);
  };

  const markAsPaid = async (commissionId: string) => {
    const { error } = await supabase
      .from('commissions')
      .update({ status: 'paid' })
      .eq('id', commissionId);

    if (error) {
      alert('Erro ao marcar como pago: ' + error.message);
    } else {
      setCommissions(commissions.map(c => 
        c.id === commissionId ? { ...c, status: 'paid' } : c
      ));
    }
  };

  const exportToCSV = () => {
    const csvData = commissions.map(commission => ({
      'Data': format(new Date(commission.created_at), 'dd/MM/yyyy', { locale: ptBR }),
      'Usuario': commission.profiles?.name || 'N/A',
      'Email': commission.profiles?.email || 'N/A',
      'Endereço': commission.referrals?.address || 'N/A',
      'Tipo': commission.referrals?.property_type || 'N/A',
      'Valor do Negócio': `R$ ${commission.deal_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      'Taxa (%)': `${(commission.commission_rate * 100).toFixed(1)}%`,
      'Comissão': `R$ ${commission.commission_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      'Status': commission.status === 'paid' ? 'Pago' : 'Pendente'
    }));

    const filename = `comissoes-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadCSV(csvData, filename);
  };

  const totalPending = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  const totalPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  if (!user || (userRole !== 'finance' && userRole !== 'admin')) {
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
                Painel Financeiro
              </h1>
              <p className="text-muted-foreground">
                Gestão de comissões e pagamentos
              </p>
            </div>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPending)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPaid)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalPending + totalPaid)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchCommissions} className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commissions List */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Comissões</CardTitle>
            <CardDescription>
              Lista de todas as comissões ({commissions.length} registros)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando comissões...</p>
              </div>
            ) : commissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma comissão encontrada.</p>
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
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(commission.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="font-medium">{commission.profiles?.name || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">{commission.profiles?.email || 'N/A'}</p>
                      <p className="text-sm">{commission.referrals?.address || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[200px]">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Comissão</p>
                        <p className="font-semibold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(commission.commission_amount)}
                        </p>
                      </div>
                      {commission.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => markAsPaid(commission.id)}
                          className="mt-2"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como Pago
                        </Button>
                      )}
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