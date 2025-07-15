"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Package, Truck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { QrCodePix } from "qrcode-pix";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";

interface Order {
  id: string;
  status: string;
  created_at?: string;
  // Adicione outros campos relevantes se necessário
}

export default function AcompanharPedidoPage() {
  const [email, setEmail] = useState("");
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
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  React.useEffect(() => {
    if (!result?.order || !selectedOrderId) return;
    const channel = supabase
      .channel("order-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${selectedOrderId}`,
        },
        (payload) => {
          if (payload.new && payload.new.status !== result.order.status) {
            setResult((prev) =>
              prev
                ? {
                    ...prev,
                    order: {
                      ...prev.order,
                      status: payload.new.status,
                    },
                  }
                : prev
            );
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [result?.order, selectedOrderId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setOrders([]);
    setSelectedOrderId("");
    try {
      const res = await fetch(
        `/api/orders/track?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar pedidos");
      setOrders(data.orders || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar detalhes do pedido selecionado
  const fetchOrderDetail = async (orderId: string) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `/api/orders/track?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&order=${encodeURIComponent(orderId)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar pedido");
      setResult(data);
      setSelectedOrderId(orderId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Dicionário de status em português
  const statusLabels: Record<string, string> = {
    pending_payment: "Aguardando pagamento",
    paid: "Pago",
    processing: "Em preparação",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
    aguardando_retirada: "Aguardando retirada",
  };
  // Critério de pedido ativo
  function isPedidoAtivo(status: string) {
    return [
      "pending_payment",
      "paid",
      "processing",
      "shipped",
      "aguardando_retirada",
    ].includes(status);
  }

  const shippingLabels: Record<string, string> = {
    pickup: "Retirar no local",
    delivery: "Entrega",
  };

  return (
    <div className="min-h-screen bg-[#e1e1e1] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg mx-auto mb-4 flex justify-start">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-secondary focus:text-secondary text-base font-sans bg-transparent border-none p-0 focus:outline-none font-medium"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              stroke="#b689e0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>
      </div>
      <Card
        className="w-full max-w-lg mx-auto bg-white border border-primary/60 rounded-2xl shadow-md"
        style={{ boxShadow: '0 2px 8px 0 #b689e01a' }}
      >
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2 text-black font-bold text-2xl font-sans"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}
          >
            <Package className="w-6 h-6 text-primary" />
            Acompanhar Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 font-sans" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            <div>
              <Label
                htmlFor="email"
                className="text-foreground font-medium font-sans"
                style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
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
                className="border border-primary/60 rounded-lg bg-white text-black font-sans focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-primary/40 placeholder:font-normal px-4 py-2"
                style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
              />
            </div>
            <div>
              <Label
                htmlFor="phone"
                className="text-foreground font-medium font-sans"
              >
                Telefone usado no pedido
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                placeholder="(11) 99999-9999"
                className="border border-[#d4af37]/60 rounded-[0.75rem] bg-white text-[#1a1a1a] font-sans focus:ring-2 focus:ring-[#6d348b]/40 focus:border-[#6d348b] placeholder:text-[#bfaecb] placeholder:font-normal px-4 py-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-[0.75rem] font-bold text-base bg-[#6d348b] text-white shadow-md hover:bg-[#4b206b] transition-all duration-300 py-4 font-sans"
              style={{
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0 2px 8px 0 #d4af3720",
              }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Buscar pedidos
            </Button>
          </form>

          {/* Lista de pedidos encontrados */}
          {orders.length > 0 && !selectedOrderId && (
            <div className="mt-8 space-y-4">
              <h3 className="font-bold text-lg text-[#6d348b] mb-2">
                Pedidos encontrados:
              </h3>
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="border border-[#d4af37]/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#f8e5d8]/40"
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="font-semibold">
                        #{order.id.slice(0, 8)}...
                      </span>{" "}
                      <span className="text-sm text-muted-foreground">
                        ({new Date(order.created_at || "").toLocaleString()})
                      </span>
                      <div className="flex flex-nowrap items-center gap-2 mt-1 min-h-[28px]">
                        <span className="text-sm whitespace-nowrap">
                          Status:
                        </span>
                        <span className="font-bold text-[#6d348b] text-sm whitespace-nowrap max-w-[140px] overflow-hidden text-ellipsis">
                          {statusLabels[order.status] || order.status}
                        </span>
                        {isPedidoAtivo(order.status) ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ede3f6] text-[#6d348b] border border-[#d4af37]/40 min-w-[90px] text-center">
                            Em andamento
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f4eae6] text-[#bfaecb] border border-[#d4af37]/20 min-w-[90px] text-center">
                            Finalizado
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 sm:mt-0 sm:ml-4 self-end sm:self-center"
                      onClick={() => fetchOrderDetail(order.id)}
                    >
                      Ver detalhes
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 text-[#e65a4d] bg-[#fff8f0] border border-[#e65a4d]/30 rounded-xl p-2 font-sans shadow-sm">
              <XCircle className="w-5 h-5" style={{ color: "#e65a4d" }} />
              <span className="text-[#1a1a1a]">{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6 font-sans">
              <div className="flex items-center gap-3 mt-8 mb-4">
                <Truck className="w-6 h-6" style={{ color: "#d4af37" }} />
                <span
                  className="text-xl font-bold font-serif text-[#6d348b]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Status:{" "}
                  {statusLabels[result.order.status] || result.order.status}
                </span>
              </div>

              {result.order.status === "pending_payment" &&
                result.order.payment_method === "card" &&
                result.order.stripe_checkout_session_id && (
                  <div className="my-4">
                    <Button
                      className="w-full rounded-2xl bg-secondary text-secondary-foreground shadow-md transition-all duration-300 py-3"
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
              <div className="font-semibold mb-2 text-[#1a1a1a] mt-4 text-lg">
                Histórico:
              </div>
              <ul className="text-sm space-y-4">
                {result.history.map((h, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-2 bg-white border border-[#d4af37]/60 rounded-2xl shadow-sm p-4"
                    style={{ boxShadow: "0 1px 4px 0 #d4af3720" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-[#6d348b] text-base"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        Status:
                      </span>
                      <span
                        className="text-base text-[#1a1a1a] font-sans"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {statusLabels[h.status] || h.status || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm text-[#6d348b] font-semibold"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Data:
                      </span>
                      <span
                        className="text-sm text-[#1a1a1a] font-sans"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {h.changed_at
                          ? new Date(h.changed_at).toLocaleString("pt-BR")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm text-[#6d348b] font-semibold"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Por:
                      </span>
                      <span
                        className="text-sm text-[#1a1a1a]/70 font-sans"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {h.changed_by || "-"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="font-semibold mb-2 text-[#1a1a1a] mt-4 text-lg">
                Itens do pedido:
              </div>
              <ul
                className="text-sm space-y-2 bg-white rounded-2xl p-4 border border-[#d4af37]/60 shadow-sm"
                style={{ boxShadow: "0 1px 4px 0 #d4af3720" }}
              >
                {result.items &&
                Array.isArray(result.items) &&
                result.items.length > 0 ? (
                  result.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 p-2 border-b last:border-b-0 border-[#ede3f6]"
                    >
                      <span
                        className="font-semibold text-[#1a1a1a]"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.products?.name}
                      </span>
                      <span
                        className="text-[#6d348b] font-medium"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Qtd: {item.quantity}
                      </span>
                      <span
                        className="text-[#6d348b] font-semibold"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.price_at_purchase.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#6d348b]">Nenhum item encontrado.</li>
                )}
              </ul>
              <div className="text-sm text-[#1a1a1a] mt-4">
                <div>
                  Total:{" "}
                  <span className="font-bold">
                    R${" "}
                    {Number(result.order.total_price)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
                <div>
                  Método de envio:{" "}
                  {shippingLabels[result.order.shipping_method] ||
                    result.order.shipping_method}
                </div>
                {result.order.tracking_code && (
                  <div>
                    Código de rastreio:{" "}
                    <span className="font-mono">
                      {result.order.tracking_code}
                    </span>
                  </div>
                )}
                <div>
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
