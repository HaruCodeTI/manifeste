"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectValue } from "@/components/ui/select";
import { useCartContext } from "@/contexts/CartContext";
import { getProductImageUrl } from "@/lib/supabaseClient";
import { calcularTotalPagamento, TAP_TO_PAY_FEES } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
};

// Função utilitária para buscar dados do CEP
async function fetchCepData(cep: string) {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.erro) return null;
  return data;
}

// Utilitário para validação simples de e-mail e telefone
function isValidEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function isValidPhone(phone: string) {
  return /^\(?\d{2}\)?\s?9?\d{4,5}-?\d{4}$/.test(phone.replace(/\D/g, ""));
}

type PaymentMethod =
  | "pix"
  | "debit"
  | "card"
  | "card_installments"
  | "delivery";
type ShippingMethod = "delivery" | "pickup";

interface ShippingInfo {
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

// Stepper visual component
function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center w-full mb-10">
      <div className="flex items-center gap-0 w-full max-w-xl">
        {/* Step 1 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-200 ${
              step === 1
                ? "bg-[#b689e0] border-[#b689e0] text-white shadow-lg scale-110"
                : step > 1
                  ? "bg-[#00b85b] border-[#00b85b] text-white shadow-lg scale-110"
                  : "bg-white border-[#b689e0] text-[#b689e0]"
            }`}
          >
            {step > 1 ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              "1"
            )}
          </div>
          <span
            className={`mt-2 text-xs font-semibold uppercase tracking-wide ${
              step === 1
                ? "text-[#b689e0]"
                : step > 1
                  ? "text-[#00b85b]"
                  : "text-gray-400"
            }`}
          >
            Entrega
          </span>
        </div>
        {/* Line */}
        <div
          className={`h-1 flex-1 mx-1 md:mx-2 rounded-full transition-all duration-200 ${step === 2 ? "bg-[#b689e0]" : "bg-gray-200"}`}
        ></div>
        {/* Step 2 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-200 ${step === 2 ? "bg-[#b689e0] border-[#b689e0] text-white shadow-lg scale-110" : "bg-white border-[#b689e0] text-[#b689e0]"}`}
          >
            2
          </div>
          <span
            className={`mt-2 text-xs font-semibold uppercase tracking-wide ${step === 2 ? "text-[#b689e0]" : "text-gray-400"}`}
          >
            Pagamento
          </span>
        </div>
      </div>
    </div>
  );
}

// Função para mapear paymentMethod para o tipo esperado pela função utilitária
function mapPaymentMethodToUtil(
  m: PaymentMethod
): "pix" | "debito" | "credito_avista" | "credito_parcelado" {
  if (m === "pix") return "pix";
  if (m === "debit") return "debito";
  if (m === "card") return "credito_avista";
  if (m === "card_installments") return "credito_parcelado";
  return "pix"; // fallback seguro
}

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCartContext();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [installments, setInstallments] = useState(2); // Começa em 2x para parcelado
  const maxInstallments = 3;
  const [shippingMethod] = useState<ShippingMethod>("delivery");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [shippingCost, setShippingCost] = useState(0);

  const subtotal = getTotalPrice();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [showCouponField, setShowCouponField] = useState(false);
  const discount = coupon
    ? coupon.type === "percentage"
      ? (subtotal * coupon.value) / 100
      : coupon.value
    : 0;
  const { total, valorParcela, descontoPix } = calcularTotalPagamento({
    subtotal,
    shipping: shippingCost,
    desconto: discount,
    metodo: mapPaymentMethodToUtil(paymentMethod),
    parcelas: installments,
  });

  const [step, setStep] = useState(1);

  const [cepBuscado, setCepBuscado] = useState(false);

  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
  const cepValido =
    shippingInfo.cep.replace(/\D/g, "").length === 8 && cepBuscado;

  const isStep1Valid =
    isValidEmail(customerInfo.email) &&
    cepValido &&
    customerInfo.name.trim().length > 1 &&
    customerInfo.phone.trim().length >= 10 &&
    isValidPhone(customerInfo.phone) &&
    shippingInfo.number.trim().length > 0;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Digite um código de cupom");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");
    setCoupon(null);

    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Cupom inválido");
      }

      setCoupon(data.coupon);
      setShowCouponField(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCouponError(err.message || "Erro ao validar cupom");
      } else {
        setCouponError("Erro ao validar cupom");
      }
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  useEffect(() => {
    if (shippingMethod === "pickup") {
      setShippingCost(0);
    } else {
      if (subtotal >= 100) {
        setShippingCost(0);
      } else {
        setShippingCost(15);
      }
    }
  }, [subtotal, shippingMethod]);

  const handleCheckout = async () => {
    setIsFinalizingOrder(true);
    try {
      console.log("paymentMethod", paymentMethod);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            variant_id: item.variant_id,
            product_id: item.product_id,
            color: item.color,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingInfo,
          customerInfo,
          shippingCost: shippingMethod === "pickup" ? 0 : shippingCost,
          shippingMethod,
          paymentMethod,
          total: total,
          coupon: coupon ? { id: coupon.id, code: coupon.code } : undefined,
          descontoPix: descontoPix || 0, // Enviar desconto PIX
          installments:
            paymentMethod === "card_installments" ? installments : 1,
          payment_fee:
            paymentMethod === "card_installments"
              ? TAP_TO_PAY_FEES.credito_parcelado[installments] || 0
              : 0,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro ao criar pedido");
      clearCart();
      router.push(`/sucesso?order=${data.orderId}`);
    } catch {
      setIsFinalizingOrder(false);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#e1e1e1]">
        <Header
          onCartClick={() => {}}
          onTrackOrderClick={() => {}}
          categories={[]}
          selectedCategory={""}
          onCategoryChange={() => {}}
        />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              Carrinho Vazio
            </h1>
            <p
              className="text-muted-foreground mb-6"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              Adicione produtos ao carrinho para continuar com a compra.
            </p>
            <Button
              asChild
              className="text-primary hover:text-secondary focus:text-secondary font-sans font-medium"
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
            >
              <Link href="/produtos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Produtos
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Gera as opções de parcelas (2x a 12x)
  const installmentOptions = Array.from(
    { length: maxInstallments - 1 },
    (_, i) => i + 2
  ).map((n) => {
    const { valorParcela } = calcularTotalPagamento({
      subtotal,
      shipping: shippingCost,
      desconto: discount,
      metodo: "credito_parcelado", // Sempre parcelado para opções de parcela
      parcelas: n,
    });
    const taxa = TAP_TO_PAY_FEES.credito_parcelado[n] || 0;
    const semJuros = taxa === 0;
    return {
      n,
      label: semJuros
        ? `${n}x de R$ ${valorParcela?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} sem juros`
        : `${n}x de R$ ${valorParcela?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} `,
    };
  });

  return (
    <div className="min-h-screen bg-[#ede3f6] font-[Poppins,Arial,sans-serif]">
      <Header
        onCartClick={() => {}}
        onTrackOrderClick={() => {}}
        categories={[]}
        selectedCategory={""}
        onCategoryChange={() => {}}
      />
      <main className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Stepper step={step} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Coluna esquerda: Formulário de steps */}
          <div className="space-y-8">
            {step === 1 && (
              <Card className="bg-white border-none rounded-2xl shadow-md p-0">
                <CardContent className="p-0">
                  {/* DADOS DE CONTATO */}
                  <div className="px-6 pt-8 pb-4 border-b border-[#ede3f6]">
                    <div className="mb-2 text-xs font-bold text-[#6d348b] tracking-widest font-[Poppins] uppercase">
                      Dados de contato
                    </div>
                    <div className="flex flex-col gap-3">
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                        placeholder="E-mail"
                      />
                    </div>
                  </div>
                  {/* ENTREGA */}
                  <div className="px-6 pt-8 pb-4 border-b border-[#ede3f6]">
                    <div className="mb-2 text-xs font-bold text-[#6d348b] tracking-widest font-[Poppins] uppercase">
                      Entrega
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 items-center w-full max-w-md">
                        <Input
                          id="cep"
                          value={shippingInfo.cep}
                          onChange={(e) =>
                            setShippingInfo((prev) => ({
                              ...prev,
                              cep: e.target.value,
                            }))
                          }
                          placeholder="CEP"
                          maxLength={9}
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0] flex-1"
                        />
                        <Button
                          type="button"
                          className="bg-[#b689e0] text-white font-bold px-4 py-2 rounded-lg ml-2"
                          disabled={
                            shippingInfo.cep.replace(/\D/g, "").length !== 8
                          }
                          onClick={async () => {
                            const cleanCep = shippingInfo.cep.replace(
                              /\D/g,
                              ""
                            );
                            if (cleanCep.length === 8) {
                              const data = await fetchCepData(cleanCep);
                              if (data) {
                                setShippingInfo((prev) => ({
                                  ...prev,
                                  address: data.logradouro || "",
                                  neighborhood: data.bairro || "",
                                  city: data.localidade || "",
                                  state: data.uf || "MS",
                                }));
                                setCepBuscado(true);
                              }
                            }
                          }}
                        >
                          Buscar
                        </Button>
                        <button
                          type="button"
                          className="text-xs text-[#b689e0] underline ml-2 font-[Poppins]"
                          onClick={() =>
                            window.open(
                              "https://buscacepinter.correios.com.br/app/endereco/index.php",
                              "_blank"
                            )
                          }
                        >
                          Não sei meu CEP
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* ENDEREÇO (só aparece após buscar o CEP) */}
                  {cepValido && (
                    <div className="px-6 pt-8 pb-4 border-b border-[#ede3f6] animate-fadein">
                      <div className="mb-2 text-xs font-bold text-[#6d348b] tracking-widest font-[Poppins] uppercase">
                        Dados para entrega
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) =>
                            setCustomerInfo((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                          placeholder="Nome"
                        />
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                          placeholder="Telefone com DDD"
                        />
                      </div>
                      <div className="mb-3">
                        <Input
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) =>
                            setShippingInfo((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                          placeholder="Endereço"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <Input
                          id="number"
                          value={shippingInfo.number}
                          onChange={(e) =>
                            setShippingInfo((prev) => ({
                              ...prev,
                              number: e.target.value,
                            }))
                          }
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                          placeholder="Número"
                        />
                        <Input
                          id="complement"
                          value={shippingInfo.complement}
                          onChange={(e) =>
                            setShippingInfo((prev) => ({
                              ...prev,
                              complement: e.target.value,
                            }))
                          }
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                          placeholder="Complemento (opcional)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          id="neighborhood"
                          value={shippingInfo.neighborhood}
                          onChange={(e) =>
                            setShippingInfo((prev) => ({
                              ...prev,
                              neighborhood: e.target.value,
                            }))
                          }
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                          placeholder="Bairro"
                        />
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="font-[Poppins] bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0]"
                          placeholder="Cidade"
                        />
                      </div>
                      {/* Regra do frete */}
                      <div className="mt-6 bg-[#f5f5f5] rounded-lg p-4 flex items-center gap-4">
                        <span className="font-bold text-[#6d348b] text-base">
                          Expresso
                        </span>
                        <span className="text-gray-600 text-sm">
                          Chega em até 1h em Campo Grande
                        </span>
                        <span className="ml-auto font-bold text-[#00b85b] text-base">
                          {subtotal > 100 ? "Grátis" : "R$ 15,00"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="px-6 pt-8 pb-8 flex justify-center">
                    <Button
                      className="w-full max-w-xs py-3 rounded-full font-bold text-white bg-[#fe53b3] text-lg font-[Poppins] hover:bg-[#b689e0] transition-all duration-200 shadow-lg disabled:opacity-60"
                      disabled={!isStep1Valid}
                      onClick={() => setStep(2)}
                    >
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {step === 2 && (
              <Card className="bg-white border-none rounded-2xl shadow-md p-0">
                <CardContent className="p-0">
                  <div className="px-6 pt-8 pb-4 border-b border-[#ede3f6]">
                    <div className="mb-2 text-xs font-bold text-[#6d348b] tracking-widest font-[Poppins] uppercase">
                      Pagamento
                    </div>
                    <div className="w-full max-w-xs">
                      <label
                        htmlFor="paymentMethod"
                        className="block text-sm font-medium font-[Poppins] mb-1"
                      >
                        Forma de pagamento
                      </label>
                      <Select
                        id="paymentMethod"
                        value={paymentMethod}
                        onValueChange={(v) =>
                          setPaymentMethod(v as PaymentMethod)
                        }
                        className="block w-full rounded-lg border border-[#b689e0] bg-white text-black font-[Poppins] text-base px-3 py-2 focus:border-[#fe53b3] focus:ring-1 focus:ring-[#fe53b3] transition-colors duration-200"
                      >
                        <SelectValue placeholder="Selecione..." />
                        <SelectItem value="pix">Pix</SelectItem>
                        <SelectItem value="debit">Débito</SelectItem>
                        <SelectItem value="card">
                          Cartão de Crédito (à vista)
                        </SelectItem>
                        <SelectItem value="card_installments">
                          Cartão de Crédito (parcelado)
                        </SelectItem>
                      </Select>
                    </div>
                    <div className="mt-2 text-xs text-[#b689e0] font-[Poppins] w-full">
                      O pagamento será realizado na entrega, escolha a
                      modalidade para calcular o valor final.
                    </div>
                    {paymentMethod === "card_installments" && (
                      <div className="mt-2 w-full max-w-xs">
                        <label
                          htmlFor="installments"
                          className="block text-sm font-medium font-[Poppins] mb-1"
                        >
                          Número de parcelas
                        </label>
                        <select
                          id="installments"
                          value={installments}
                          onChange={(e) =>
                            setInstallments(Number(e.target.value))
                          }
                          className="mt-1 block w-full rounded-lg border border-[#b689e0] bg-white text-black font-[Poppins] text-base px-3 py-2 focus:border-[#fe53b3] focus:ring-1 focus:ring-[#fe53b3] transition-colors duration-200"
                        >
                          {installmentOptions.map((opt) => (
                            <option key={opt.n} value={opt.n}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  {/* Campos dinâmicos para cartão, se necessário, podem ser adicionados aqui */}
                  <div className="px-6 pt-8 pb-8 flex justify-center">
                    <button
                      disabled={!paymentMethod || isFinalizingOrder}
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-[#b689e0] to-[#fe53b3] text-white text-sm font-semibold py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-[Poppins] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isFinalizingOrder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Finalizando...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          Finalizar Pedido
                        </>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          {/* Coluna direita: Resumo do pedido (exibir sempre) */}
          <div className="space-y-8">
            <Card className="bg-white border-none rounded-2xl shadow-md p-0">
              <CardContent className="p-0">
                <div className="px-6 pt-8 pb-4 border-b border-[#ede3f6]">
                  <div className="mb-2 text-xs font-bold text-[#6d348b] tracking-widest font-[Poppins] uppercase">
                    Resumo do pedido
                  </div>
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div
                        key={item.variant_id}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={getProductImageUrl(item.image)}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border border-[#e1e1e1] bg-[#f5f5f5]"
                        />
                        <div className="flex-1">
                          <div className="font-[Poppins] text-sm text-black font-bold">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Cor: {item.color}
                          </div>
                          <div className="text-xs text-gray-500">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="font-[Poppins] text-sm text-black font-bold min-w-[60px] text-right">
                          {item.price === 0
                            ? "Grátis"
                            : `R$ ${(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 pt-6 pb-4 border-b border-[#ede3f6]">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-bold text-black">
                      R${" "}
                      {subtotal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">
                        Desconto ({coupon.code})
                      </span>
                      <span className="font-bold text-[#00b85b]">
                        -R${" "}
                        {discount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  {paymentMethod === "pix" && descontoPix > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Desconto PIX (5%)</span>
                      <span className="font-bold text-[#00b85b]">
                        -R${" "}
                        {descontoPix.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Custo de frete</span>
                    <span className="font-bold text-black">
                      {subtotal > 100 ? "Grátis" : "R$ 15,00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 w-full">
                    <span className="text-black">Total</span>
                    <span className="text-black">
                      R$
                      {total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                      {paymentMethod === "card_installments" &&
                      installments > 1 &&
                      valorParcela
                        ? ` (${installments}x de R$ ${valorParcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-6">
                  {!coupon ? (
                    <div className="space-y-3">
                      {!showCouponField ? (
                        <button
                          onClick={() => setShowCouponField(true)}
                          className="text-xs text-[#b689e0] font-bold font-[Poppins] hover:text-[#fe53b3] hover:scale-105 transition-all duration-200 flex items-center gap-1"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-[#b689e0]"
                          >
                            <path
                              d="M12 5V19M5 12H19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Adicionar cupom de desconto
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="Digite o código do cupom"
                              className="flex-1 text-sm bg-[#f5f5f5] border border-[#e1e1e1] px-3 py-2 rounded-lg focus:border-[#b689e0] focus:outline-none focus:ring-1 focus:ring-[#b689e0] transition-all duration-200"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleValidateCoupon();
                                }
                              }}
                            />
                            <Button
                              onClick={handleValidateCoupon}
                              disabled={
                                isValidatingCoupon || !couponCode.trim()
                              }
                              className="bg-[#b689e0] text-white text-xs px-3 py-2 rounded-lg hover:bg-[#fe53b3] disabled:opacity-50"
                            >
                              {isValidatingCoupon ? "..." : "Aplicar"}
                            </Button>
                          </div>
                          {couponError && (
                            <div className="text-xs text-red-500 font-[Poppins]">
                              {couponError}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setShowCouponField(false);
                              setCouponCode("");
                              setCouponError("");
                            }}
                            className="text-xs text-gray-500 underline font-[Poppins] hover:text-gray-700"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-[#f0f8f0] rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#00b85b]">
                          ✓ {coupon.code}
                        </span>
                        <span className="text-xs text-gray-600">
                          {coupon.type === "percentage"
                            ? `${coupon.value}% de desconto`
                            : `R$ ${coupon.value.toFixed(2)} de desconto`}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-200"
                        title="Remover cupom"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-red-500"
                        >
                          <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
