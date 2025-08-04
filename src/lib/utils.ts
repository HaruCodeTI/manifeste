import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TAP_TO_PAY_FEES = {
  debito: 0,
  credito_avista: 0,
  credito_parcelado: [
    0, // 0x
    0, // 1x
    0, // 2x
    0, // 3x
  ],
};

export function calcDebito(price: number) {
  return +(price * (1 + TAP_TO_PAY_FEES.debito)).toFixed(2);
}

export function calcCreditoAvista(price: number) {
  return +(price * (1 + TAP_TO_PAY_FEES.credito_avista)).toFixed(2);
}

export function calcCreditoParcelado(price: number, parcelas: number) {
  const taxa = 0;
  const total = +(price * (1 + taxa)).toFixed(2);
  const parcela = +(total / parcelas).toFixed(2);
  return { total, parcela };
}

// Nova função para calcular preço PIX (5% de desconto)
export function calcPix(price: number) {
  return +(price * 0.95).toFixed(2); // 5% de desconto
}

// Retorna o total, taxa e (se parcelado) valor da parcela
export function calcularTotalPagamento({
  subtotal,
  shipping,
  desconto,
  metodo,
  parcelas = 1,
}: {
  subtotal: number;
  shipping: number;
  desconto: number;
  metodo: "pix" | "debito" | "credito_avista" | "credito_parcelado";
  parcelas?: number;
}) {
  // 1. Aplica desconto de cupom sobre produtos
  const subtotalComDesconto = subtotal - desconto;

  // 2. Aplica desconto PIX (5% sobre produtos, após cupom)
  let descontoPix = 0;
  if (metodo === "pix") {
    descontoPix = subtotalComDesconto * 0.05; // 5% de desconto
  }

  // 3. Calcula base para taxas (subtotal - cupom - pix + frete)
  const base = subtotalComDesconto - descontoPix + shipping;

  // 4. Calcula taxa (exceto para pix/débito)
  let taxa = 0;
  if (metodo === "credito_avista") {
    taxa = TAP_TO_PAY_FEES.credito_avista;
  } else if (metodo === "credito_parcelado") {
    taxa = TAP_TO_PAY_FEES.credito_parcelado[parcelas] || 0;
  }

  // 5. Para pix/débito, retorna valor base sem taxa
  if (metodo === "pix" || metodo === "debito") {
    return {
      total: +base.toFixed(2),
      valorParcela: undefined,
      descontoPix: +descontoPix.toFixed(2), // Retorna desconto PIX para exibição
    };
  }

  // 6. Para crédito, aplica taxa sobre o base
  const total = +(base * (1 + taxa)).toFixed(2);
  const valorParcela =
    metodo === "credito_parcelado" && parcelas > 1
      ? +(total / parcelas).toFixed(2)
      : undefined;
  return { total, valorParcela, descontoPix: 0 };
}
