import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Save } from "lucide-react";

// Ajuste o tipo do usuário para incluir pix_key opcional
interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  pix_key?: string | null;
  created_at?: string;
}

interface Referral {
  id: string;
  address: string;
  status: string;
  estimate_value: number | null;
  commission_percent: number | null;
  commission_amount: number | null;
  user_id: string;
  user: Profile | null;
}

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "em_analise", label: "Em análise" },
  { value: "aprovado", label: "Aprovado" },
  { value: "fechado", label: "Fechado" },
  { value: "rejeitado", label: "Rejeitado" },
  { value: "alugado", label: "Alugado" },
];

export default function AdminDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchReferrals();
  }, []);

  async function fetchReferrals() {
    const { data, error } = await supabase
      .from("referrals")
      .select(`
        id,
        address,
        status,
        estimate_value,
        commission_percent,
        commission_amount,
        user_id,
        user:profiles(id, name, email, phone, role, pix_key, created_at)
      `);

    if (!error && data) setReferrals(data as Referral[]);
  }

  function handleEdit(referral: Referral) {
    setEditingId(referral.id);
    setEditData({
      status: referral.status,
      commission_percent: referral.commission_percent ?? 10,
      pix_key: referral.user?.pix_key ?? "",
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  async function handleSave(referral: Referral) {
    await supabase
      .from("referrals")
      .update({
        status: editData.status,
        commission_percent: Number(editData.commission_percent),
      })
      .eq("id", referral.id);

    // Atualiza PIX do usuário na tabela "profiles"
    if (referral.user_id && editData.pix_key !== undefined) {
      await supabase
        .from("profiles")
        .update({ pix_key: editData.pix_key })
        .eq("id", referral.user_id);
    }

    setEditingId(null);
    fetchReferrals();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestão de Imóveis (Admin)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border">Endereço</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">% Comissão</th>
              <th className="p-2 border">Valor Estimado</th>
              <th className="p-2 border">Usuário</th>
              <th className="p-2 border">PIX</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((ref) => (
              <tr key={ref.id}>
                <td className="p-2 border">{ref.address}</td>
                <td className="p-2 border">
                  {editingId === ref.id ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleChange}
                      className="border rounded px-2 py-1"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge>{ref.status}</Badge>
                  )}
                </td>
                <td className="p-2 border">
                  {editingId === ref.id ? (
                    <input
                      type="number"
                      name="commission_percent"
                      value={editData.commission_percent}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-16"
                      min={0}
                      max={100}
                    />
                  ) : (
                    `${ref.commission_percent ?? 10}%`
                  )}
                </td>
                <td className="p-2 border">
                  {ref.estimate_value
                    ? ref.estimate_value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "-"}
                </td>
                <td className="p-2 border">
                  {ref.user?.name || ref.user?.email}
                </td>
                <td className="p-2 border">
                  {editingId === ref.id ? (
                    <input
                      type="text"
                      name="pix_key"
                      value={editData.pix_key}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-40"
                    />
                  ) : (
                    ref.user?.pix_key ? ref.user.pix_key : "Não informado"
                  )}
                </td>
                <td className="p-2 border">
                  {editingId === ref.id ? (
                    <Button
                      size="sm"
                      onClick={() => handleSave(ref)}
                      className="mr-2"
                    >
                      <Save className="h-4 w-4 mr-1" /> Salvar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(ref)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Aqui pode entrar o botão de exportar para Google Sheets futuramente */}
    </div>
  );