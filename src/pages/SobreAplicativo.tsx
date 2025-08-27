import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const SobreAplicativo = () => {
  return (
    <div className="min-h-screen bg-background">

      <section className="py-24 text-center bg-orange-50">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">Sobre o Aplicativo</h1>
        <p className="text-lg md:text-xl text-blue-800 max-w-2xl mx-auto mb-12">
          O San Remo Indica foi desenvolvido para você ganhar comissões de forma simples, rápida e segura.
          Tudo online, sem burocracia, conectando você a oportunidades reais no mercado imobiliário.
        </p>

        <div className="max-w-3xl mx-auto text-left space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">Simples de usar</h2>
            <p className="text-blue-700">
              Um painel intuitivo que permite cadastrar imóveis, acompanhar indicações e receber comissões de forma prática.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">Seguro</h2>
            <p className="text-blue-700">
              Todos os dados são protegidos com alta segurança, garantindo que suas informações e das propriedades permaneçam confidenciais.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">Rápido</h2>
            <p className="text-blue-700">
              Cadastre indicações em minutos e acompanhe todo o processo pelo seu painel, sem complicações.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Button variant="secondary" size="lg" onClick={() => window.location.href='/indicar'}>
            INDICAR IMÓVEL
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SobreAplicativo;
