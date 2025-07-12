import Link from "next/link";

export default function TrocasDeDevolucoesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-lg p-8 border border-border">
        <h1 className="text-3xl font-serif font-bold mb-4 text-center">
          Trocas e Devoluções
        </h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">
          Prezamos pela sua satisfação! Se precisar trocar ou devolver um
          produto, siga as orientações abaixo:
        </p>
        <ul className="list-disc pl-6 text-base text-muted-foreground mb-6">
          <li>
            Solicite a troca ou devolução em até 7 dias após o recebimento.
          </li>
          <li>
            O produto deve estar sem uso, em embalagem original e com nota
            fiscal.
          </li>
          <li>
            Entre em contato pelo nosso e-mail ou WhatsApp para iniciar o
            processo.
          </li>
          <li>
            Após análise, enviaremos as instruções para envio ou reembolso.
          </li>
        </ul>
        <p className="text-base text-foreground text-center">
          Dúvidas? Fale conosco! Nosso time está pronto para ajudar.
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
