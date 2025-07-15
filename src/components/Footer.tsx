import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="w-full bg-muted text-primary border-t-2 border-accent pt-12 pb-6 px-4 font-sans shadow-sm"
      style={{ borderRadius: "0 0 0.75rem 0.75rem" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2
            className="text-2xl font-semibold mb-6 text-accent"
            style={{ letterSpacing: "0.02em" }}
          >
            Informações
          </h2>
          <ul className="space-y-4 text-lg">
            <li>
              <Link
                href="/quem-somos"
                className="transition-colors duration-200 text-primary hover:text-secondary focus:text-primary"
              >
                Quem Somos
              </Link>
            </li>
            <li>
              <Link
                href="/missao-visao-valores"
                className="transition-colors duration-200 text-primary hover:text-secondary focus:text-primary"
              >
                Missão, Visão e Valores
              </Link>
            </li>
            <li>
              <Link
                href="/trocas-e-devolucoes"
                className="transition-colors duration-200 text-primary hover:text-secondary focus:text-primary"
              >
                Trocas e Devoluções
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2
            className="text-2xl font-semibold mb-6 text-accent"
            style={{ letterSpacing: "0.02em" }}
          >
            Fale Conosco
          </h2>
          <ul className="space-y-4 text-lg">
            <li>
              <Link
                href="#"
                className="transition-colors duration-200 text-primary hover:text-secondary focus:text-primary"
              >
                WhatsApp
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="transition-colors duration-200 text-primary hover:text-secondary focus:text-primary"
              >
                E-mail
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-12 mb-8">
        <Link href="#" aria-label="Instagram">
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="#d4af37"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ filter: "drop-shadow(0 2px 8px #d4af3720)" }}
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
