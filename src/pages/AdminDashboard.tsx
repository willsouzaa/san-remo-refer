import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    if (user === undefined || isAdmin === undefined) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
    setLoading(false);
    // eslint-disable-next-line
  }, [user, isAdmin]);

  async function fetchData() {
    const { data: referralsData } = await supabase.from("referrals").select("*");
    const { data: commissionsData } = await supabase.from("commissions").select("*");
    const { data: profilesData } = await supabase.from("profiles").select("id, name, email, phone");
    setReferrals(referralsData || []);
    setCommissions(commissionsData || []);
    setProfiles(profilesData || []);
  }

  // Filtro de indicações por status
  const filteredReferrals = statusFilter
    ? referrals.filter((r) => r.status === statusFilter)
    : referrals;

  // Métricas
  const totalIndicacoes = referrals.length;
  const aprovadas = referrals.filter(r => r.status === "aprovado").length;
  const pendentes = referrals.filter(r => r.status === "pendente").length;
  const rejeitadas = referrals.filter(r => r.status === "rejeitado").length;
  const totalComissoes = commissions.reduce((acc, c) => acc + (c.commission_amount || 0), 0);
  const comissoesPagas = commissions.filter(c => c.status === "paid").length;
  const comissoesPendentes = commissions.filter(c => c.status !== "paid").length;

  // Helper para buscar dados do usuário
  function getUserInfo(userId: string) {
    return profiles.find((p) => p.id === userId) || {};
  }

  // Exemplo de alteração de status/ganhos (você pode adaptar para abrir um modal ou inline edit)
  async function handleUpdateCommission(commissionId: string, newStatus: string) {
    await supabase.from("commissions").update({ status: newStatus }).eq("id", commissionId);
    fetchData();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Indicações</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{totalIndicacoes}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indicações Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{aprovadas}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indicações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{pendentes}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indicações Rejeitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{rejeitadas}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de Comissões (R$)</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">R$ {totalComissoes.toLocaleString("pt-BR")}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comissões Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{comissoesPagas}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comissões Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{comissoesPendentes}</span>
          </CardContent>
        </Card>
      </div>

      {/* Filtro de status */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrar por status:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="em_analise">Em análise</option>
          <option value="aprovado">Aprovado</option>
          <option value="rejeitado">Rejeitado</option>
          <option value="fechado">Fechado</option>
        </select>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Todas as Indicações</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Indicador</th>
                <th className="px-4 py-2 border">E-mail</th>
                <th className="px-4 py-2 border">Telefone</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Criada em</th>
                <th className="px-4 py-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map((ref) => {
                const userInfo = getUserInfo(ref.user_id);
                return (
                  <tr key={ref.id}>
                    <td className="px-4 py-2 border">{ref.id}</td>
                    <td className="px-4 py-2 border">{userInfo.name || "-"}</td>
                    <td className="px-4 py-2 border">{userInfo.email || "-"}</td>
                    <td className="px-4 py-2 border">{userInfo.phone || "-"}</td>
                    <td className="px-4 py-2 border">{ref.status}</td>
                    <td className="px-4 py-2 border">{new Date(ref.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 border">
                      {/* Exemplo de ação: aprovar/rejeitar */}
                      {/* <button onClick={() => handleUpdateReferral(ref.id, "aprovado")}>Aprovar</button> */}
                      <button className="text-blue-600 hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comissões</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Indicador</th>
                <th className="px-4 py-2 border">Valor do Negócio</th>
                <th className="px-4 py-2 border">Comissão</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((com) => {
                const userInfo = getUserInfo(com.user_id);
                return (
                  <tr key={com.id}>
                    <td className="px-4 py-2 border">{com.id}</td>
                    <td className="px-4 py-2 border">{userInfo.name || "-"}</td>
                    <td className="px-4 py-2 border">R$ {com.deal_value}</td>
                    <td className="px-4 py-2 border">R$ {com.commission_amount}</td>
                    <td className="px-4 py-2 border">{com.status}</td>
                    <td className="px-4 py-2 border">
                      {/* Exemplo: marcar como paga */}
                      {com.status !== "paid" && (
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => handleUpdateCommission(com.id, "paid")}
                        >
                          Marcar como paga
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}