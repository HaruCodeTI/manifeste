import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-black text-foreground border-t border-border pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Coluna 1: Informações */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Informações</h2>
          <ul className="space-y-4 text-lg text-muted-foreground">
            <li>
              <Link href="/quem-somos">Quem Somos</Link>
            </li>
            <li>
              <Link href="/missao-visao-valores">Missão, Visão e Valores</Link>
            </li>
            <li>
              <Link href="/trocas-e-devolucoes">Trocas e Devoluções</Link>
            </li>
          </ul>
        </div>
        {/* Coluna 2: Fale Conosco */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Fale Conosco</h2>
          <ul className="space-y-4 text-lg text-muted-foreground">
            <li>
              <Link href="#">WhatsApp</Link>
            </li>
            <li>
              <Link href="#">E-mail</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Ícones sociais */}
      <div className="flex justify-center gap-8 mt-12 mb-8">
        <Link href="#" aria-label="Instagram">
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.5" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}
