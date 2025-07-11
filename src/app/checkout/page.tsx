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
import { useState } from "react";

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
  const total = subtotal + (shippingMethod === "pickup" ? 0 : shippingCost);

  const calculateShipping = async () => {
    if (!shippingInfo.cep || shippingInfo.cep.length < 8) return;
    setIsCalculatingShipping(true);
    setTimeout(() => {
      const cost = Math.random() * 20 + 10; // Entre R$ 10 e R$ 30
      setShippingCost(cost);
      setIsCalculatingShipping(false);
    }, 1000);
  };

  const handleCheckout = async () => {
    try {
      if (paymentMethod === "card") {
        // Cria sessão Stripe e redireciona
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart }),
        });
        const data = await response.json();
        if (!response.ok || !data.url)
          throw new Error(data.error || "Erro ao criar checkout Stripe");
        clearCart();
        window.location.href = data.url;
        return;
      }
      // Outros métodos: cria pedido local
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
          total: total,
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
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => {}} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Carrinho Vazio</h1>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao carrinho para continuar com a compra.
            </p>
            <Button asChild>
              <Link href="/">
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
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => {}} />
      <main className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Produtos
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Formulário de Checkout */}
          <div className="space-y-8">
            {/* Informações do Cliente */}
            <Card className="rounded-2xl shadow-lg border-none bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black font-semibold text-xl">
                  <MapPin className="w-5 h-5 text-secondary" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-black font-medium">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Seu nome completo"
                      className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-black font-medium">
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
                      className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-black font-medium">
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
                    className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Método de Entrega */}
            <Card className="rounded-2xl shadow-lg border-none bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black font-semibold text-xl">
                  <Truck className="w-5 h-5 text-secondary" />
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
                    <span className="text-black">Entrega no endereço</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="pickup"
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-black">Retirar no local</span>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Endereço de Entrega */}
            {shippingMethod === "delivery" && (
              <Card className="rounded-2xl shadow-lg border-none bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black font-semibold text-xl">
                    <Truck className="w-5 h-5 text-secondary" />
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
                          className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
                        />
                        <Button
                          onClick={calculateShipping}
                          disabled={isCalculatingShipping || !shippingInfo.cep}
                          size="sm"
                          className="border border-muted rounded-xl bg-background text-black hover:bg-secondary/10 focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
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
                        className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
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
                      className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
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
                        className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
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
                        className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
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
                      className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
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
                      className="border border-muted rounded-xl bg-background text-black focus:ring-2 focus:ring-secondary/40 focus:border-secondary placeholder:text-muted"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Método de Pagamento */}
            <Card className="rounded-2xl shadow-lg border-none bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black font-semibold text-xl">
                  <CreditCard className="w-5 h-5 text-secondary" />
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
                    <span className="text-black">Cartão de Crédito/Débito</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="pix"
                      checked={paymentMethod === "pix"}
                      onChange={() => setPaymentMethod("pix")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-black">PIX</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="delivery"
                      checked={paymentMethod === "delivery"}
                      onChange={() => setPaymentMethod("delivery")}
                      className="border border-muted rounded-full focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    />
                    <span className="text-black">Pagamento na Entrega</span>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-lg border-none bg-card">
              <CardHeader>
                <CardTitle className="text-black font-semibold text-xl">
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
                      <p className="font-medium text-black">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity} x R${" "}
                        {item.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <p className="font-semibold text-black">
                      R${" "}
                      {(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-black">Subtotal:</span>
                    <span className="text-black">
                      R$ {subtotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Frete:</span>
                    <span className="text-black">
                      {shippingMethod === "pickup"
                        ? "Grátis"
                        : shippingCost > 0
                          ? `R$ ${shippingCost.toFixed(2).replace(".", ",")}`
                          : "Calculando..."}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-black border-t pt-2">
                    <span className="text-black">Total:</span>
                    <span className="text-black">
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={handleCheckout}
              className="w-full py-6 text-lg font-semibold rounded-2xl shadow-md hover:bg-secondary/10 focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
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
