import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const roles = [
  { value: "indicator", label: "Indicador" },
  { value: "finance", label: "Financeiro" },
  { value: "commercial", label: "Comercial" },
  { value: "admin", label: "Admin" },
];

export default function AdminUsers() {
  const isAdmin = useIsAdmin();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", role: "indicator" });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("profiles").select("id, email, name, role");
    setUsers(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Busca usuário pelo email
    const { data: user } = await supabase.from("profiles").select("id").eq("email", form.email).maybeSingle();

    if (user) {
      // Atualiza role e nome se já existe
      await supabase.from("profiles").update({ name: form.name, role: form.role }).eq("id", user.id);
      toast({ title: "Usuário atualizado com sucesso!" });
    } else {
      toast({ title: "Usuário não encontrado. O cadastro deve ser feito pelo próprio usuário via tela de cadastro.", variant: "destructive" });
    }

    setForm({ email: "", name: "", role: "indicator" });
    setLoading(false);
    fetchUsers();
  }

  async function handleRoleChange(userId: string, newRole: string) {
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    toast({ title: "Role atualizado!" });
    fetchUsers();
  }

  if (!isAdmin) return <div className="p-8 text-center text-red-600">Acesso restrito ao administrador.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Gerenciar Usuários</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 flex-wrap">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label>Nome</Label>
          <Input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={form.role} onValueChange={role => setForm(f => ({ ...f, role }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o acesso" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(r => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading} className="self-end">
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </form>

      <h3 className="font-semibold mb-2">Usuários cadastrados</h3>
      <table className="min-w-full bg-white border rounded shadow text-sm">
        <thead>
          <tr>
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <Select value={u.role} onValueChange={role => handleRoleChange(u.id, role)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="p-2 border">
                {/* Aqui você pode adicionar ações extras, como resetar senha, etc */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}