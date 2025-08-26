import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Home, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

export default function ReferralForm() {
  const [loading, setLoading] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para indicar um imóvel.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!lgpdAccepted) {
      toast({
        title: "Aceite os termos",
        description: "Você deve aceitar os termos da LGPD para continuar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const referralData = {
      user_id: user.id,
      address: formData.get('address') as string,
      property_type: formData.get('property_type') as string,
      owner_name: formData.get('owner_name') as string,
      owner_phone: formData.get('owner_phone') as string,
      owner_email: formData.get('owner_email') as string,
      estimate_value: parseFloat(formData.get('estimate_value') as string) || null,
      notes: formData.get('notes') as string
    };


    const { error } = await supabase
      .from('referrals')
      .insert([referralData]);

    // Envia os dados para o n8n webhook
    try {
      await fetch('https://pauloamancio1.app.n8n.cloud/webhook-test/6c1e5c7d-cbd7-47e6-9207-a8185724479f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(referralData)
      });
    } catch (err) {
      console.error('Erro ao enviar para o n8n:', err);
    }

    if (error) {
      toast({
        title: "Erro ao criar indicação",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Indicação criada com sucesso!",
        description: "Sua indicação foi registrada e está sendo analisada pela nossa equipe."
      });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Acesso necessário</CardTitle>
            <CardDescription>
              Você precisa estar logado para indicar um imóvel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate('/auth')} className="w-full">
              Fazer login
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
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

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Indicar Imóvel
            </CardTitle>
            <CardDescription>
              Preencha as informações do imóvel que você deseja indicar para a San Remo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço do imóvel *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Rua, número, bairro, cidade"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type">Tipo do imóvel *</Label>
                  <Select name="property_type" required>
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
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimate_value"
                      name="estimate_value"
                      type="number"
                      step="0.01"
                      placeholder="500000.00"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_name">Nome do proprietário *</Label>
                  <Input
                    id="owner_name"
                    name="owner_name"
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_phone">Telefone do proprietário</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="owner_phone"
                      name="owner_phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_email">E-mail do proprietário</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="owner_email"
                      name="owner_email"
                      type="email"
                      placeholder="email@exemplo.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">Observações adicionais</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Informações adicionais sobre o imóvel, condições especiais, etc."
                    rows={4}
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="lgpd" 
                    checked={lgpdAccepted}
                    onCheckedChange={(checked) => setLgpdAccepted(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="lgpd"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Aceito os termos da LGPD
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Concordo que a San Remo utilize as informações fornecidas para entrar em contato com o proprietário do imóvel indicado, conforme a Lei Geral de Proteção de Dados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Comissão:</strong> Você receberá 10% do valor líquido recebido pela imobiliária caso o negócio seja fechado.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !lgpdAccepted}>
                {loading ? "Criando indicação..." : "Criar indicação"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}