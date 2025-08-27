import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

export default function EditReferral() {
  const { id } = useParams();
  console.log('ID da URL:', id);
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id) {
      fetchReferral();
    }
  }, [user, id]);

  const fetchReferral = async () => {
    if (!id) {
      toast({ title: 'Erro', description: 'ID não informado na URL', variant: 'destructive' });
      return;
    }
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      console.error('Erro ao buscar imóvel:', error, 'ID:', id);
      toast({ title: 'Erro', description: error?.message || 'Imóvel não encontrado', variant: 'destructive' });
    } else {
      setReferral(data);
      console.log('Imóvel carregado para edição:', data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      address: formData.get('address') as string,
      property_type: formData.get('property_type') as string,
      owner_name: formData.get('owner_name') as string,
      owner_phone: formData.get('owner_phone') as string,
      owner_email: formData.get('owner_email') as string,
      estimate_value: parseFloat(formData.get('estimate_value') as string) || null,
      notes: formData.get('notes') as string
    };
    const { data, error } = await supabase
      .from('referrals')
      .update(updatedData)
      .eq('id', id)
      .select();
    if (error) {
      console.error('Erro ao atualizar imóvel:', error);
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    } else {
      const updated = data && data[0];
      console.log('Imóvel atualizado:', updated);
      // Envia webhook para n8n
      try {
        await fetch('https://pauloamancio1.app.n8n.cloud/webhook-test/6c1e5c7d-cbd7-47e6-9207-a8185724479f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...updated, action: 'edit' })
        });
      } catch (err) {
        console.error('Erro ao enviar webhook de edição:', err);
      }
      toast({ title: 'Indicação atualizada!', description: 'Os dados foram salvos.' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  if (!referral) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Carregando dados do imóvel...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao dashboard
          </Button>
        </div>
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Editar Indicação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço do imóvel *</Label>
                  <Input id="address" name="address" defaultValue={referral.address} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">Tipo do imóvel *</Label>
                  <Select name="property_type" defaultValue={referral.property_type} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimate_value">Valor estimado (R$)</Label>
                  <Input id="estimate_value" name="estimate_value" type="number" step="0.01" defaultValue={referral.estimate_value || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner_name">Nome do proprietário *</Label>
                  <Input id="owner_name" name="owner_name" defaultValue={referral.owner_name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner_phone">Telefone do proprietário</Label>
                  <Input id="owner_phone" name="owner_phone" type="tel" defaultValue={referral.owner_phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner_email">E-mail do proprietário</Label>
                  <Input id="owner_email" name="owner_email" type="email" defaultValue={referral.owner_email} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">Observações adicionais</Label>
                  <Textarea id="notes" name="notes" rows={4} defaultValue={referral.notes} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
