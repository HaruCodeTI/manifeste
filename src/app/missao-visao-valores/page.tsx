import Link from "next/link";

export default function MissaoVisaoValoresPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-lg p-8 border border-border">
        <h1 className="text-3xl font-serif font-bold mb-4 text-center">
          Missão, Visão e Valores
        </h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Missão</h2>
          <p className="text-base text-muted-foreground">
            Oferecer produtos premium que promovam bem-estar, confiança e
            sofisticação, com atendimento humanizado e seguro.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Visão</h2>
          <p className="text-base text-muted-foreground">
            Ser referência nacional em experiências premium, reconhecida pela
            inovação, design e excelência no cuidado com o cliente.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Valores</h2>
          <ul className="list-disc pl-6 text-base text-muted-foreground">
            <li>Ética e transparência</li>
            <li>Respeito à diversidade</li>
            <li>Inovação constante</li>
            <li>Qualidade em cada detalhe</li>
            <li>Atendimento humanizado</li>
          </ul>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-accent hover:underline font-medium">
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}
