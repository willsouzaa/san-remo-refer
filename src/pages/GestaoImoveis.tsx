import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useAuth from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Home, Plus, Edit, Trash2, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Referral {
  id: string;
  address: string;
  property_type: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  estimate_value: number;
  notes: string;
  status: string;
  created_at: string;
  commission_percent: number;
  profiles: {
    name: string;
    email: string;
  };
}

export default function GestaoImoveis() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchReferrals();
  }, [user, isAdmin, navigate]);

  const fetchReferrals = async () => {
    setLoading(true);
    
    let query = supabase
      .from('referrals')
      .select(`
        *,
        profiles:user_id (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (typeFilter !== 'all') {
      query = query.eq('property_type', typeFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching referrals:', error);
    } else {
      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(referral =>
          referral.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          referral.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          referral.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setReferrals(filteredData);
    }

    setLoading(false);
  };

  const handleEdit = (referral: Referral) => {
    setEditingId(referral.id);
    setEditData({
      status: referral.status,
      commission_percent: referral.commission_percent || 10,
      estimate_value: referral.estimate_value,
      notes: referral.notes
    });
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('referrals')
      .update(editData)
      .eq('id', id);

    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      setEditingId(null);
      fetchReferrals();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este imóvel?')) return;

    const { error } = await supabase
      .from('referrals')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      fetchReferrals();
    }
  };

  const handleChange = (field: string, value: any) => {
    setEditData({ ...editData, [field]: value });
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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Gestão de Imóveis
              </h1>
              <p className="text-muted-foreground">
                Gerencie todas as indicações de imóveis da plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Endereço, proprietário, indicador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="all">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_analise">Em análise</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="fechado">Fechado</option>
                  <option value="rejeitado">Rejeitado</option>
                </select>
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="all">Todos</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchReferrals} className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Imóveis Indicados</CardTitle>
            <CardDescription>
              Total de {referrals.length} imóveis encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando imóveis...</p>
              </div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-muted-foreground">
                  Ajuste os filtros ou aguarde novas indicações
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(referral.status)}>
                            {getStatusLabel(referral.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground capitalize">
                            {referral.property_type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(referral.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <h3 className="font-semibold">{referral.address}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p><strong>Proprietário:</strong> {referral.owner_name}</p>
                          <p><strong>Telefone:</strong> {referral.owner_phone || 'N/A'}</p>
                          <p><strong>Email:</strong> {referral.owner_email || 'N/A'}</p>
                          <p><strong>Indicador:</strong> {referral.profiles?.name || 'N/A'}</p>
                        </div>
                        {referral.notes && (
                          <p className="text-sm"><strong>Observações:</strong> {referral.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingId === referral.id ? (
                          <>
                            <Button size="sm" onClick={() => handleSave(referral.id)}>
                              Salvar
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(referral)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(referral.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {editingId === referral.id && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <select
                            id="status"
                            value={editData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em_analise">Em análise</option>
                            <option value="aprovado">Aprovado</option>
                            <option value="fechado">Fechado</option>
                            <option value="rejeitado">Rejeitado</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="commission">Comissão (%)</Label>
                          <Input
                            id="commission"
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={editData.commission_percent}
                            onChange={(e) => handleChange('commission_percent', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="value">Valor Estimado</Label>
                          <Input
                            id="value"
                            type="number"
                            value={editData.estimate_value}
                            onChange={(e) => handleChange('estimate_value', parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="md:col-span-2 lg:col-span-1">
                          <Label htmlFor="notes">Observações</Label>
                          <Textarea
                            id="notes"
                            value={editData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {!editingId && referral.estimate_value && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm font-medium">
                          Valor estimado: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(referral.estimate_value)}
                        </span>
                        {referral.commission_percent && (
                          <span className="text-sm font-medium">
                            Comissão: {referral.commission_percent}%
                          </span>
                        )}
                      </div>
                    )}
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