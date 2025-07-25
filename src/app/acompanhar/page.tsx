"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductImageUrl } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Loader2, Package, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface Order {
  id: string;
  status: string;
  created_at?: string;
  total_price?: number;
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
      installments?: number;
      payment_fee?: number;
    };
    history: { status: string; changed_at: string; changed_by?: string }[];
    items: {
      products?: { name: string };
      quantity: number;
      price_at_purchase: number;
      product_variants?: {
        color?: string;
        image_urls?: string[];
      };
    }[];
  } | null>(null);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

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

  const shippingLabels: Record<string, string> = {
    pickup: "Retirar no local",
    delivery: "Entrega",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-[#00b85b] text-white";
      case "shipped":
        return "bg-[#b689e0] text-white";
      case "processing":
        return "bg-[#fe53b3] text-white";
      case "paid":
        return "bg-[#00b85b] text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const paymentMethodLabels: Record<string, string> = {
    pix: "Pix",
    debit: "Débito",
    card: "Cartão de Crédito (à vista)",
    card_installments: "Cartão de Crédito (parcelado)",
    cash: "Dinheiro",
    boleto: "Boleto",
  };

  return (
    <div className="min-h-screen bg-[#ede3f6] font-[Poppins,Arial,sans-serif]">
      <Header
        onCartClick={() => {}}
        onTrackOrderClick={() => {}}
        categories={[]}
        selectedCategory={""}
        onCategoryChange={() => {}}
      />
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#b689e0] hover:text-[#fe53b3] transition-colors font-[Poppins]"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar à loja
          </Link>
        </div>

        <Card className="bg-white border-none rounded-2xl shadow-md">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-black font-[Poppins]">
              <Package className="w-8 h-8 text-[#b689e0]" />
              Acompanhar Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-black mb-2 font-[Poppins]"
                  >
                    E-mail usado no pedido
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="seu@email.com"
                    className="w-full bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0] focus:outline-none focus:ring-1 focus:ring-[#b689e0] transition-all duration-200 font-[Poppins] text-black"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-black mb-2 font-[Poppins]"
                  >
                    Telefone usado no pedido
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#f5f5f5] border border-[#e1e1e1] text-base px-4 py-3 rounded-lg focus:border-[#b689e0] focus:outline-none focus:ring-1 focus:ring-[#b689e0] transition-all duration-200 font-[Poppins] text-black"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#fe53b3] hover:bg-[#b689e0] text-white font-bold py-3 rounded-lg transition-all duration-200 font-[Poppins] flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Buscar pedidos
              </Button>
            </form>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-[Poppins]">
                {error}
              </div>
            )}

            {/* Lista de pedidos encontrados */}
            {orders.length > 0 && !selectedOrderId && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black font-[Poppins]">
                  Pedidos encontrados:
                </h3>
                <div className="space-y-3">
                  {orders.map((order, idx) => (
                    <button
                      key={order.id}
                      onClick={() => fetchOrderDetail(order.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 font-[Poppins] ${
                        idx === 0
                          ? "border-[#b689e0] bg-[#f8f4ff] shadow-md"
                          : "border-[#e1e1e1] bg-white hover:border-[#b689e0] hover:bg-[#f8f4ff]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-gray-600">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "pt-BR"
                              )
                            : "-"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="font-semibold text-black">
                          {order.total_price !== undefined
                            ? `R$ ${order.total_price.toFixed(2).replace(".", ",")}`
                            : "-"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-[#00b85b] text-white font-semibold">
                            Mais recente
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Detalhes do pedido selecionado */}
            {result && selectedOrderId && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="font-bold text-black font-[Poppins]">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusColor(result.order.status)}`}
                  >
                    {statusLabels[result.order.status] || result.order.status}
                  </span>
                </div>

                <div className="bg-[#f8f4ff] rounded-lg p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-[Poppins] mb-1">
                        Total
                      </span>
                      <span className="font-bold text-[#b689e0] font-[Poppins] text-lg">
                        R${" "}
                        {result.order.total_price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-[Poppins] mb-1">
                        Pagamento
                      </span>
                      <span className="font-semibold text-black font-[Poppins]">
                        {paymentMethodLabels[result.order.payment_method] ||
                          result.order.payment_method}
                      </span>

                      {result.order.payment_method === "card_installments" &&
                        (result.order.installments ?? 1) > 1 && (
                          <span className="text-xs text-[#b689e0] font-[Poppins] mt-1">
                            {result.order.installments ?? 1}x
                          </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-[Poppins] mb-1">
                        Entrega
                      </span>
                      <span className="font-semibold text-black font-[Poppins]">
                        {shippingLabels[result.order.shipping_method]}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-[Poppins] mb-1">
                        Data
                      </span>
                      <span className="font-semibold text-black font-[Poppins]">
                        {new Date(result.order.created_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                    {result.order.tracking_code && (
                      <div className="flex flex-col sm:col-span-2 lg:col-span-4">
                        <span className="text-sm text-gray-600 font-[Poppins] mb-1">
                          Código de Rastreio
                        </span>
                        <span className="font-semibold text-[#b689e0] font-[Poppins]">
                          {result.order.tracking_code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Histórico de status */}
                <div>
                  <h4 className="font-bold text-black mb-3 font-[Poppins]">
                    Histórico:
                  </h4>
                  <div className="space-y-2">
                    {result.history.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm"
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(h.status)}`}
                        >
                          {statusLabels[h.status] || h.status}
                        </span>
                        <span className="text-gray-600 font-[Poppins] text-xs sm:text-sm">
                          {new Date(h.changed_at).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itens do pedido */}
                <div>
                  <h4 className="font-bold text-black mb-3 font-[Poppins]">
                    Itens do pedido:
                  </h4>
                  <div className="bg-white rounded-lg border border-[#e1e1e1] overflow-hidden">
                    {result.items &&
                    Array.isArray(result.items) &&
                    result.items.length > 0 ? (
                      <div className="divide-y divide-[#e1e1e1]">
                        {result.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 gap-2"
                          >
                            <div className="flex items-center gap-3">
                              {item.product_variants &&
                              item.product_variants.image_urls &&
                              item.product_variants.image_urls[0] ? (
                                <img
                                  src={getProductImageUrl(
                                    item.product_variants.image_urls[0]
                                  )}
                                  alt={item.products?.name || "Produto"}
                                  className="w-14 h-14 rounded-lg object-cover border border-[#e1e1e1] bg-[#f5f5f5]"
                                />
                              ) : (
                                <div className="w-14 h-14 flex items-center justify-center bg-[#f5f5f5] text-[#b689e0] rounded-lg border border-[#e1e1e1]">
                                  ?
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-semibold text-black font-[Poppins] text-sm sm:text-base">
                                  {item.products?.name}
                                </span>
                                {item.product_variants &&
                                  item.product_variants.color && (
                                    <span className="text-xs text-gray-500">
                                      Cor: {item.product_variants.color}
                                    </span>
                                  )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                              <span className="text-gray-600 font-[Poppins]">
                                Qtd: {item.quantity}
                              </span>
                              <span className="font-semibold text-[#b689e0] font-[Poppins]">
                                {item.price_at_purchase.toLocaleString(
                                  "pt-BR",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-gray-600 font-[Poppins]">
                        Nenhum item encontrado.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
