import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

export default function CadastrarPix() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nome: user?.name || "",
    tipoPix: "cpf",
    chavePix: "",
    banco: "",
  });
  const [loading, setLoading] = useState(false);
  const [pixCadastrado, setPixCadastrado] = useState<null | typeof form>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Aqui você pode salvar no Supabase, se desejar
    // await supabase.from("pix_keys").insert([{ ...form, user_id: user.id }]);

    // Exibe os dados cadastrados abaixo do formulário
    setPixCadastrado(form);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Cadastrar PIX</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                value={form.nome}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
                required
                autoComplete="name"
              />
              <span className="text-xs text-muted-foreground">
                O nome do recebedor é o mesmo do usuário logado.
              </span>
            </div>
            <div>
              <Label htmlFor="tipoPix">Tipo de chave PIX</Label>
              <select
                id="tipoPix"
                name="tipoPix"
                value={form.tipoPix}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="telefone">Telefone</option>
                <option value="email">E-mail</option>
                <option value="aleatoria">Aleatória</option>
              </select>
            </div>
            <div>
              <Label htmlFor="chavePix">Chave PIX</Label>
              <Input
                id="chavePix"
                name="chavePix"
                value={form.chavePix}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="banco">Nome do banco</Label>
              <Input
                id="banco"
                name="banco"
                value={form.banco}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Confirmar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Exibe os dados do PIX cadastrado abaixo do formulário */}
      {pixCadastrado && (
        <Card className="w-full max-w-md mt-6 border-green-400 border-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">PIX cadastrado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Nome completo: </span>
              {pixCadastrado.nome}
            </div>
            <div>
              <span className="font-semibold">Tipo de chave: </span>
              {pixCadastrado.tipoPix}
            </div>
            <div>
              <span className="font-semibold">Chave PIX: </span>
              {pixCadastrado.chavePix}
            </div>
            <div>
              <span className="font-semibold">Banco: </span>
              {pixCadastrado.banco}
            </div>
          </CardContent>
        </Card>
      )}
    </div>)};