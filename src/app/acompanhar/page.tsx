"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Package, Truck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { QrCodePix } from "qrcode-pix";
import { QRCodeSVG } from "qrcode.react";
import { JSX, useState } from "react";

export default function AcompanharPedidoPage() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    order: {
      status: string;
      payment_method: string;
      stripe_checkout_session_id?: string;
      total_price: number;
      shipping_method: string;
      tracking_code?: string;
      created_at: string;
    };
    history: { status: string; changed_at: string; changed_by?: string }[];
    items: {
      products?: { name: string };
      quantity: number;
      price_at_purchase: number;
    }[];
  } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `/api/orders/track?email=${encodeURIComponent(email)}&order=${encodeURIComponent(orderId)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar pedido");
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: Record<string, string> = {
    pending_payment: "Aguardando pagamento",
    paid: "Pago",
    processing: "Em preparação",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
  };

  const shippingLabels: Record<string, string> = {
    pickup: "Retirar no local",
    delivery: "Entrega",
  };

  const statusIcons: Record<string, JSX.Element> = {
    pending_payment: <Truck className="w-6 h-6 text-yellow-500" />,
    paid: <CheckCircle className="w-6 h-6 text-blue-500" />,
    processing: <Truck className="w-6 h-6 text-primary" />,
    shipped: <Truck className="w-6 h-6 text-primary" />,
    delivered: <CheckCircle className="w-6 h-6 text-green-500" />,
    cancelled: <XCircle className="w-6 h-6 text-destructive" />,
    refunded: <XCircle className="w-6 h-6 text-destructive" />,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Botão de voltar sempre visível */}
      <div className="w-full max-w-lg mx-auto mb-4 flex justify-start">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#ffacc2] hover:underline text-base font-serif px-2 py-1"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              stroke="#ffacc2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>
      </div>
      <Card className="w-full max-w-lg mx-auto rounded-2xl shadow-lg border-none bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground font-serif font-bold text-2xl">
            <Package className="w-6 h-6" style={{ color: "#ffacc2" }} />
            Acompanhar Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <Label
                htmlFor="email"
                className="text-foreground font-medium font-sans"
              >
                E-mail usado no pedido
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="placeholder:text-muted-foreground focus:ring-2 focus:ring-[#ffacc2] focus:border-[#ffacc2] border border-neutral-200 rounded-xl bg-white text-black"
              />
            </div>
            <div>
              <Label
                htmlFor="order"
                className="text-foreground font-medium font-sans"
              >
                Código do pedido
              </Label>
              <Input
                id="order"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="Ex: 123e4567-..."
                className="placeholder:text-muted-foreground focus:ring-2 focus:ring-[#ffacc2] focus:border-[#ffacc2] border border-neutral-200 rounded-xl bg-white text-black"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-2xl font-semibold text-base bg-black text-white shadow-md hover:bg-[#ffacc2] hover:text-black transition-all duration-300 py-3 font-sans"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Buscar pedido
            </Button>
          </form>

          {error && (
            <div className="mt-6 flex items-center gap-2 text-destructive bg-red-50 border border-red-200 rounded-xl p-2 font-sans">
              <XCircle className="w-5 h-5" />
              <span className="text-black">{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6 font-sans">
              <div className="flex items-center gap-3">
                {statusIcons[result.order.status] || (
                  <Truck className="w-6 h-6" style={{ color: "#ffacc2" }} />
                )}
                <span className="text-lg font-bold font-serif text-[#ffacc2]">
                  Status:{" "}
                  {statusLabels[result.order.status] || result.order.status}
                </span>
              </div>

              {result.order.status === "pending_payment" &&
                result.order.payment_method === "card" &&
                result.order.stripe_checkout_session_id && (
                  <div className="my-4">
                    <Button
                      className="w-full rounded-2xl bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 transition-all duration-300 py-3"
                      onClick={() => {
                        window.location.href = `https://checkout.stripe.com/pay/${result.order.stripe_checkout_session_id}`;
                      }}
                    >
                      Pagar agora
                    </Button>
                  </div>
                )}

              {result.order.payment_method === "pix" &&
                result.order.status === "pending_payment" && (
                  <div className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <h3 className="font-bold mb-2 text-yellow-900 text-lg">
                      Pagamento via PIX
                    </h3>
                    <p className="text-yellow-900">
                      Valor:{" "}
                      <span className="font-bold">
                        R${" "}
                        {Number(result.order.total_price)
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="font-mono font-semibold text-yellow-900"
                        id="pix-key"
                      >
                        Chave PIX: seu-pix@seudominio.com
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="ml-1 rounded-lg"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "seu-pix@seudominio.com"
                          );
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                    <div className="my-2 flex flex-col items-center">
                      {(() => {
                        const payload = QrCodePix({
                          version: "01",
                          key: "seu-pix@seudominio.com",
                          name: "Manifeste",
                          city: "Campo Grande",
                          value: Number(result.order.total_price),
                        }).payload();
                        return <QRCodeSVG value={payload} size={160} />;
                      })()}
                      <span className="text-xs text-gray-700 mt-1">
                        Escaneie para pagar
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      Após o pagamento, envie o comprovante para{" "}
                      <b>seu-email@seudominio.com</b> ou aguarde a confirmação
                      manual.
                    </p>
                  </div>
                )}
              <div className="font-semibold mb-2 text-white mt-4 text-lg">
                Histórico:
              </div>
              <ul className="text-sm space-y-2 bg-white/10 rounded-xl p-4 border border-neutral-700">
                {result.history.map((h, i) => (
                  <li key={i} className="text-white/90">
                    <span className="font-semibold text-white">
                      {statusLabels[h.status] || h.status}
                    </span>{" "}
                    em{" "}
                    {new Date(h.changed_at).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                    {h.changed_by ? ` (${h.changed_by})` : ""}
                  </li>
                ))}
              </ul>
              <div className="font-semibold mb-2 text-white mt-4 text-lg">
                Itens do pedido:
              </div>
              <ul className="text-sm space-y-2 bg-white/10 rounded-xl p-4 border border-neutral-700">
                {result.items.map((item, i) => (
                  <li key={i} className="text-white/90">
                    {item.products?.name} — Qtd: {item.quantity} — R${" "}
                    {item.price_at_purchase.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </li>
                ))}
              </ul>
              <div className="text-sm text-muted-foreground mt-4">
                <div className="text-white">
                  Total:{" "}
                  <span className="font-bold">
                    R${" "}
                    {Number(result.order.total_price)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
                <div className="text-white">
                  Método de envio:{" "}
                  {shippingLabels[result.order.shipping_method] ||
                    result.order.shipping_method}
                </div>
                {result.order.tracking_code && (
                  <div className="text-white">
                    Código de rastreio:{" "}
                    <span className="font-mono">
                      {result.order.tracking_code}
                    </span>
                  </div>
                )}
                <div className="text-white">
                  Pedido feito em:{" "}
                  {new Date(result.order.created_at).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
