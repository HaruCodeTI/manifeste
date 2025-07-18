"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectItem, SelectValue } from "@/components/ui/select";
import { useCartContext } from "@/contexts/CartContext";
import { ArrowLeft, CreditCard, MapPin, Package, Truck } from "lucide-react";
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

type PaymentMethod = "card" | "pix" | "delivery";
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

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCartContext();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("delivery");
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
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const subtotal = getTotalPrice();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const discount = coupon
    ? coupon.type === "percentage"
      ? (subtotal * coupon.value) / 100
      : coupon.value
    : 0;
  const totalWithDiscount = Math.max(
    0,
    subtotal - discount + (shippingMethod === "pickup" ? 0 : shippingCost)
  );

  const handleValidateCoupon = async () => {
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
      if (!res.ok) throw new Error(data.error || "Cupom inválido");
      setCoupon(data.coupon);
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

  const calculateShipping = () => {
    // Frete grátis acima de 100 reais
    if (subtotal > 100) {
      setShippingCost(0);
    } else {
      setShippingCost(15);
    }
    setIsCalculatingShipping(false);
  };

  // Atualizar frete sempre que subtotal ou método mudar
  useEffect(() => {
    if (shippingMethod === "pickup") {
      setShippingCost(0);
    } else {
      calculateShipping();
    }
  }, [subtotal, shippingMethod]);

  const handleCheckout = async () => {
    try {
      if (paymentMethod === "card") {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            customerInfo,
            shippingInfo,
            shippingCost: shippingMethod === "pickup" ? 0 : shippingCost,
            shippingMethod,
            paymentMethod,
            total: totalWithDiscount,
            coupon: coupon ? { id: coupon.id, code: coupon.code } : undefined,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.url)
          throw new Error(data.error || "Erro ao criar checkout Stripe");
        clearCart();
        window.location.href = data.url;
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingInfo,
          customerInfo,
          shippingCost: shippingMethod === "pickup" ? 0 : shippingCost,
          shippingMethod,
          paymentMethod,
          total: totalWithDiscount,
          coupon: coupon ? { id: coupon.id, code: coupon.code } : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao criar pedido");
      clearCart();
      router.push(`/sucesso?order=${data.orderId}`);
    } catch {
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

  return (
    <div className="min-h-screen bg-white">
      <Header
        onCartClick={() => {}}
        onTrackOrderClick={() => {}}
        categories={[]}
        selectedCategory={""}
        onCategoryChange={() => {}}
      />
      <main className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-[#b689e0] hover:text-[#6d348b] focus:text-[#6d348b] font-sans font-medium"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            <Link href="/produtos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Produtos
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Formulário de Checkout */}
          <div className="space-y-8">
            {/* Campo de cupom */}
            <Card className="bg-white border border-[#b689e0]/40 rounded-none shadow-md">
              <CardHeader>
                <CardTitle className="text-black font-bold text-lg font-sans">
                  Cupom de desconto
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o código do cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={handleValidateCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                  >
                    {isValidatingCoupon ? "Validando..." : "Aplicar"}
                  </Button>
                </div>
                {coupon && (
                  <div className="text-green-700 text-sm font-semibold">
                    Cupom aplicado: {coupon.code} (
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : `R$ ${coupon.value}`}
                    )
                  </div>
                )}
                {couponError && (
                  <div className="text-red-600 text-sm font-semibold">
                    {couponError}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Informações do Cliente */}
            <Card
              className="bg-white border border-[#b689e0]/40 rounded-none shadow-md"
              style={{ boxShadow: "0 2px 8px 0 #b689e01a" }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-black font-bold text-2xl font-sans"
                  style={{
                    fontFamily: "Montserrat, Arial, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  <MapPin className="w-5 h-5 text-[#b689e0]" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-black font-medium font-sans"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 transition"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-black font-medium font-sans"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      E-mail
                    </Label>
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
                      placeholder="seu@email.com"
                      className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-black font-medium font-sans"
                    style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                  >
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="(11) 99999-9999"
                    className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                    style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Método de Entrega */}
            <Card
              className="bg-white border border-[#b689e0]/40 rounded-none shadow-md"
              style={{ boxShadow: "0 2px 8px 0 #b689e01a" }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-black font-bold text-2xl font-sans"
                  style={{
                    fontFamily: "Montserrat, Arial, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  <Truck className="w-5 h-5 text-[#b689e0]" />
                  Entrega ou Retirada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={shippingMethod}
                  onChange={(e) =>
                    setShippingMethod(
                      (e.target as HTMLInputElement).value as ShippingMethod
                    )
                  }
                  className="flex flex-col gap-3"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="delivery"
                      checked={shippingMethod === "delivery"}
                      onChange={() => setShippingMethod("delivery")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-foreground">Entrega no endereço</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="pickup"
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-foreground">Retirar no local</span>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            {shippingMethod === "delivery" && (
              <Card
                className="bg-white border border-[#b689e0]/40 rounded-none shadow-md"
                style={{ boxShadow: "0 2px 8px 0 #b689e01a" }}
              >
                <CardHeader>
                  <CardTitle
                    className="flex items-center gap-2 text-black font-bold text-2xl font-sans"
                    style={{
                      fontFamily: "Montserrat, Arial, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    <Package className="w-5 h-5 text-[#b689e0]" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cep"
                          value={shippingInfo.cep}
                          onChange={async (e) => {
                            const value = e.target.value;
                            setShippingInfo((prev) => ({
                              ...prev,
                              cep: value,
                            }));
                            const cleanCep = value.replace(/\D/g, "");
                            if (cleanCep.length === 8) {
                              const data = await fetchCepData(cleanCep);
                              if (data) {
                                setShippingInfo((prev) => ({
                                  ...prev,
                                  cep: value,
                                  address: data.logradouro || "",
                                  neighborhood: data.bairro || "",
                                  city: data.localidade || "",
                                  state: data.uf || "",
                                }));
                              }
                            }
                          }}
                          placeholder="00000-000"
                          maxLength={9}
                          className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        />
                        <Button
                          onClick={calculateShipping}
                          disabled={isCalculatingShipping || !shippingInfo.cep}
                          size="sm"
                          className="border border-muted rounded-xl bg-background text-foreground hover:bg-secondary/10 focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                        >
                          {isCalculatingShipping ? "Calculando..." : "Calcular"}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Select
                        id="state"
                        value={shippingInfo.state}
                        onValueChange={(value) =>
                          setShippingInfo((prev) => ({ ...prev, state: value }))
                        }
                        required
                        className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        <SelectValue placeholder="Selecione o estado" />
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Rua, Avenida, etc."
                      className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={shippingInfo.number}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({
                            ...prev,
                            number: e.target.value,
                          }))
                        }
                        placeholder="123"
                        className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={shippingInfo.complement}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({
                            ...prev,
                            complement: e.target.value,
                          }))
                        }
                        placeholder="Apartamento, bloco, etc."
                        className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={shippingInfo.neighborhood}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          neighborhood: e.target.value,
                        }))
                      }
                      placeholder="Nome do bairro"
                      className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="Nome da cidade"
                      className="bg-white border border-[#b689e0]/40 rounded-none px-4 py-2 font-sans focus:border-[#b689e0] focus:ring-2 focus:ring-[#b689e0]/30 placeholder:text-[#b689e0]/40 placeholder:font-normal"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Método de Pagamento */}
            <Card
              className="bg-white border border-[#b689e0]/40 rounded-none shadow-md"
              style={{ boxShadow: "0 2px 8px 0 #b689e01a" }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2 text-black font-bold text-2xl font-sans"
                  style={{
                    fontFamily: "Montserrat, Arial, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  <CreditCard className="w-5 h-5 text-[#b689e0]" />
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      (e.target as HTMLInputElement).value as PaymentMethod
                    )
                  }
                  className="flex flex-col gap-3"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-foreground">
                      Cartão de Crédito/Débito
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="pix"
                      checked={paymentMethod === "pix"}
                      onChange={() => setPaymentMethod("pix")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-foreground">PIX</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="delivery"
                      checked={paymentMethod === "delivery"}
                      onChange={() => setPaymentMethod("delivery")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-foreground">
                      Pagamento na Entrega
                    </span>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card
              className="bg-white border border-[#b689e0]/40 rounded-none shadow-md"
              style={{ boxShadow: "0 2px 8px 0 #b689e01a" }}
            >
              <CardHeader>
                <CardTitle
                  className="text-black font-bold text-2xl font-sans"
                  style={{
                    fontFamily: "Montserrat, Arial, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity} x R${" "}
                        {item.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      R${" "}
                      {(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground">Subtotal:</span>
                    <span className="text-foreground">
                      R$ {subtotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-green-700">
                      <span>Desconto ({coupon.code}):</span>
                      <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-foreground">Frete:</span>
                    <span className="text-foreground">
                      {shippingMethod === "pickup"
                        ? "Grátis"
                        : shippingCost === 0
                        ? "Grátis"
                        : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground border-t pt-2">
                    <span className="text-foreground">Total:</span>
                    <span className="text-foreground">
                      R$ {totalWithDiscount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={handleCheckout}
              className="w-full py-4 rounded-[0.75rem] text-lg font-bold bg-[#6d348b] text-white hover:bg-[#4b206b] transition-all duration-300 shadow-md font-sans"
              style={{
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0 2px 8px 0 #d4af3720",
              }}
              disabled={
                !customerInfo.name ||
                !customerInfo.email ||
                (shippingMethod === "delivery" && !shippingInfo.cep)
              }
            >
              {paymentMethod === "card" && "Pagar com Cartão"}
              {paymentMethod === "pix" && "Gerar PIX"}
              {paymentMethod === "delivery" && "Finalizar Pedido"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
