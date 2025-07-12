import Link from "next/link";

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-lg p-8 border border-border">
        <h1 className="text-3xl font-serif font-bold mb-4 text-center">
          Quem Somos
        </h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">
          A Manifeste é uma marca premium dedicada a proporcionar experiências
          sofisticadas e seguras para o seu bem-estar. Nosso compromisso é com a
          qualidade, o design minimalista e a confiança em cada detalhe.
        </p>
        <p className="text-base text-foreground text-center">
          Somos apaixonados por inovação, transparência e respeito. Nossa equipe
          trabalha para entregar produtos exclusivos, atendimento humanizado e
          uma jornada de compra premium, do início ao fim.
        </p>
        <div className="mt-8 text-center">
          <Link href="/" className="text-accent hover:underline font-medium">
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}
