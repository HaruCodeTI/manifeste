"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Order {
  id: string;
  status: string;
  created_at?: string;
  total_price?: number;
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
        `/api/orders/track?email=${encodeURIComponent(
          email
        )}&phone=${encodeURIComponent(phone)}`
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
        `/api/orders/track?email=${encodeURIComponent(
          email
        )}&phone=${encodeURIComponent(phone)}&order=${encodeURIComponent(
          orderId
        )}`
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
  // Remover a função isPedidoAtivo

  const shippingLabels: Record<string, string> = {
    pickup: "Retirar no local",
    delivery: "Entrega",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      {" "}
      {/* fundo branco */}
      <div className="w-full max-w-lg mx-auto mb-4 flex justify-start">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#b689e0] hover:text-[#6d348b] focus:text-[#6d348b] text-base font-sans bg-transparent border-none p-0 focus:outline-none font-medium"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
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
        className="w-full max-w-lg mx-auto bg-white border border-[#b689e0]/40 rounded-none shadow-md"
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
            <Package className="w-6 h-6 text-[#b689e0]" />
            Acompanhar Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 font-sans"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            <div>
              <Label
                htmlFor="email"
                className="text-black font-medium font-sans"
                style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
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
                className="border border-[#b689e0]/40 rounded-none bg-white text-black font-sans focus:ring-2 focus:ring-[#b689e0]/30 focus:border-[#b689e0] placeholder:text-[#b689e0]/40 placeholder:font-normal px-4 py-2"
                style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
              />
            </div>
            <div>
              <Label
                htmlFor="phone"
                className="text-black font-medium font-sans"
                style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
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
                className="border border-[#b689e0]/40 rounded-none bg-white text-black font-sans focus:ring-2 focus:ring-[#b689e0]/30 focus:border-[#b689e0] placeholder:text-[#b689e0]/40 placeholder:font-normal px-4 py-2"
                style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-none font-bold text-base bg-[#b689e0] text-white shadow-md hover:bg-[#6d348b] transition-all duration-200 py-4 font-sans"
              style={{
                fontFamily: "Montserrat, Arial, sans-serif",
                boxShadow: "0 2px 8px 0 #b689e01a",
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
              <h3 className="font-bold text-lg text-[#b689e0] mb-2">
                Pedidos encontrados:
              </h3>
              <ul className="space-y-2">
                {orders.map((order, idx) => (
                  <li key={order.id}>
                    <Button
                      onClick={() => fetchOrderDetail(order.id)}
                      className={`w-full flex flex-col items-start text-left gap-0 px-4 py-1.5 bg-white border ${
                        idx === 0
                          ? "border-[#b689e0] ring-2 ring-[#b689e0]/30"
                          : "border-[#ece6f6]"
                      } hover:bg-[#f6f0fa] transition-all duration-150 rounded-xl shadow-none min-h-0 max-w-full`}
                      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                    >
                      <div className="text-xs md:text-sm text-black/70 w-full flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                        <span>•</span>
                        <span>
                          {order.total_price !== undefined
                            ? `R$ ${order.total_price
                                .toFixed(2)
                                .replace(".", ",")}`
                            : "-"}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[#b689e0]">
                          {statusLabels[order.status] || order.status}
                        </span>
                        {idx === 0 && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-[#b689e0]/10 text-[#b689e0] font-semibold whitespace-nowrap">
                            Mais recente
                          </span>
                        )}
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Detalhes do pedido selecionado */}
          {result && selectedOrderId && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-black">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold bg-[#faf6fd] text-[#b689e0] border border-[#b689e0]/30`}
                >
                  {statusLabels[result.order.status] || result.order.status}
                </span>
              </div>
              {/* Adicione barra de progresso ou badges extras se desejar */}
              <div className="flex flex-col gap-1">
                <span className="text-black font-medium">
                  Total:{" "}
                  <span className="text-[#b689e0] font-bold">
                    R$ {result.order.total_price.toFixed(2).replace(".", ",")}
                  </span>
                </span>
                <span className="text-black font-medium">
                  Pagamento:{" "}
                  <span className="text-[#b689e0] font-semibold">
                    {result.order.payment_method}
                  </span>
                </span>
                <span className="text-black font-medium">
                  Entrega:{" "}
                  <span className="text-[#b689e0] font-semibold">
                    {shippingLabels[result.order.shipping_method]}
                  </span>
                </span>
                {result.order.tracking_code && (
                  <span className="text-black font-medium">
                    Código de rastreio:{" "}
                    <span className="text-[#b689e0] font-semibold">
                      {result.order.tracking_code}
                    </span>
                  </span>
                )}
                <span className="text-black font-medium">
                  Data do pedido:{" "}
                  <span className="text-[#b689e0] font-semibold">
                    {new Date(result.order.created_at).toLocaleDateString()}
                  </span>
                </span>
              </div>
              {/* Histórico de status */}
              <div className="mt-4">
                <h4 className="font-bold text-black mb-2">Histórico:</h4>
                <ul className="space-y-1">
                  {result.history.map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-0.5 rounded bg-[#faf6fd] text-[#b689e0] border border-[#b689e0]/20 font-semibold">
                        {statusLabels[h.status] || h.status}
                      </span>
                      <span className="text-black/70">
                        {new Date(h.changed_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
            </div>
          )}
        </CardContent>
      </Card>
      {error && (
        <div className="mt-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}
    </div>
  );
}
