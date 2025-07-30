import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <div>
      <footer
        className="w-full pt-12 pb-6 px-4 font-sans shadow-sm border-t"
        style={{
          background:
            "linear-gradient(90deg, var(--background) 0%, var(--secondary) 100%)",
          borderTop:
            "2px solid linear-gradient(90deg, var(--background) 0%, var(--secondary) 100%)",
          borderRadius: 0,
          fontFamily: "Poppins, Arial, sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2
              className="text-2xl font-bold mb-6 text-white"
              style={{
                letterSpacing: "0.02em",
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Informações
            </h2>
            <ul className="space-y-4 text-lg">
              <li>
                <Link
                  href="/quem-somos"
                  className="transition-colors duration-200 text-white hover:text-secondary focus:text-white font-sans"
                  style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                >
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link
                  href="/missao-visao-valores"
                  className="transition-colors duration-200 text-white hover:text-secondary focus:text-white font-sans"
                  style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                >
                  Missão, Visão e Valores
                </Link>
              </li>
              <li>
                <Link
                  href="/trocas-e-devolucoes"
                  className="transition-colors duration-200 text-white hover:text-secondary focus:text-white font-sans"
                  style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                >
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="transition-colors duration-200 text-white hover:text-secondary focus:text-white font-sans"
                  style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-entrega"
                  className="transition-colors duration-200 text-white hover:text-secondary focus:text-white font-sans"
                  style={{ fontFamily: "Poppins, Arial, sans-serif" }}
                >
                  Política de Entrega
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 items-start md:items-end justify-between h-full">
            <h2
              className="text-2xl font-bold mb-4 text-white text-right"
              style={{
                fontFamily: "Poppins, Arial, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              Fale Conosco
            </h2>
            <div
              className="flex flex-col gap-2 text-white text-lg font-sans items-start text-left md:items-end md:text-right"
              style={{ fontFamily: "Poppins, Arial, sans-serif" }}
            >
              <a
                href="mailto:contato@manifestecg.com.br"
                className="hover:text-secondary transition flex items-center justify-start md:justify-end w-full"
              >
                <span
                  style={{ display: "inline-block", width: "1.8em" }}
                ></span>
                contato@manifestecg.com.br
              </a>
              <a
                href="https://wa.me/5567996590570"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition flex items-center justify-start md:justify-end w-full"
              >
                <span
                  style={{ display: "inline-block", width: "1.8em" }}
                ></span>
                (67) 99659-0570
              </a>
              <a
                href="https://instagram.com/manifeste.cg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-secondary transition text-xl w-full justify-start md:justify-end"
                style={{ fontFamily: "Poppins, Arial, sans-serif" }}
              >
                <FaInstagram className="text-2xl" /> @manifeste.cg
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
