import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ComoFunciona = () => {
  const steps = [
    { step: 1, title: "Cadastre-se", description: "Crie sua conta gratuita no San Remo Indica." },
    { step: 2, title: "Indique Imóveis", description: "Preencha os dados do imóvel e proprietário." },
    { step: 3, title: "Acompanhe", description: "Monitore o status da sua indicação pelo dashboard." },
    { step: 4, title: "Receba", description: "Ganhe sua comissão quando o negócio for fechado." },
  ];

  return (
    <div className="min-h-screen bg-background">

      <section className="py-24 text-center bg-blue-50">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">Como funciona o San Remo Indica</h1>
        <p className="text-lg md:text-xl text-blue-700 max-w-2xl mx-auto mb-12">
          4 passos simples para você começar a ganhar dinheiro indicando imóveis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((s) => (
            <div key={s.step} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-orange-400 transition-all">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white text-2xl font-bold mb-4">
                {s.step}
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{s.title}</h3>
              <p className="text-blue-700">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Button variant="secondary" size="lg" asChild>
            <a href="/indicar" className="flex items-center gap-2">
              Começar Agora
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComoFunciona;
