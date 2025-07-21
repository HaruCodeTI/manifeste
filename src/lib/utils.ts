import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TAP_TO_PAY_FEES = {
  debito: 0.0089,
  credito_avista: 0.0315,
  credito_parcelado: [
    0, // 0x
    0, // 1x
    0.0539, // 2x
    0.0612, // 3x
    0.0685, // 4x
    0.0757, // 5x
    0.0828, // 6x
    0.0899, // 7x
    0.0969, // 8x
    0.1038, // 9x
    0.1106, // 10x
    0.1174, // 11x
    0.124, // 12x
  ],
};

export function calcDebito(price: number) {
  return +(price * (1 + TAP_TO_PAY_FEES.debito)).toFixed(2);
}

export function calcCreditoAvista(price: number) {
  return +(price * (1 + TAP_TO_PAY_FEES.credito_avista)).toFixed(2);
}

export function calcCreditoParcelado(price: number, parcelas: number) {
  const taxa = TAP_TO_PAY_FEES.credito_parcelado[parcelas] || 0;
  const total = +(price * (1 + taxa)).toFixed(2);
  const parcela = +(total / parcelas).toFixed(2);
  return { total, parcela };
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
  // 1. Aplica desconto só sobre produtos
  const base = subtotal - desconto + shipping;
  // 2. Calcula taxa (exceto para pix/débito)
  let taxa = 0;
  if (metodo === "credito_avista") {
    taxa = TAP_TO_PAY_FEES.credito_avista;
  } else if (metodo === "credito_parcelado") {
    taxa = TAP_TO_PAY_FEES.credito_parcelado[parcelas] || 0;
  }
  // 3. Para pix/débito, retorna valor base sem taxa
  if (metodo === "pix" || metodo === "debito") {
    return { total: +base.toFixed(2), valorParcela: undefined };
  }
  // 4. Para crédito, aplica taxa sobre o base
  const total = +(base * (1 + taxa)).toFixed(2);
  const valorParcela =
    metodo === "credito_parcelado" && parcelas > 1
      ? +(total / parcelas).toFixed(2)
      : undefined;
  return { total, valorParcela };
}
