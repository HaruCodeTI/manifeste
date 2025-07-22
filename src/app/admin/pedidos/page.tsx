"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";
import { Eye, Truck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  pickup: "Retirada no local",
  delivery: "Entrega",
};
const paymentLabels: Record<string, string> = {
  card: "Cartão de crédito",
  card_installments: "Cartão de crédito (parcelado)",
  pix: "PIX",
  delivery: "Na entrega",
};

const PAGE_SIZE = 10;

interface PedidoAdminList {
  id: string;
  status: string;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  total_price?: number;
  shipping_method?: string;
  payment_method?: string;
  order_status_history?: {
    status: string;
    changed_at: string;
    changed_by?: string;
  }[];
  installments?: number;
  payment_fee?: number;
  shipping_address?: {
    name?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
}

export default function AdminPedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoAdminList[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "created_at" | "total_price" | "customer_name" | "status"
  >("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedPedido, setSelectedPedido] = useState<PedidoAdminList | null>(
    null
  );

  // Resumo
  const totalPedidos = pedidos.length;
  const totalVendas = pedidos.reduce((sum, p) => sum + (p.total_price || 0), 0);
  const ativos = pedidos.filter((p) =>
    [
      "pending_payment",
      "paid",
      "processing",
      "shipped",
      "aguardando_retirada",
    ].includes(p.status)
  ).length;
  const finalizados = pedidos.filter((p) =>
    ["delivered", "cancelled", "refunded"].includes(p.status)
  ).length;
  // Paginação
  const totalPages = Math.ceil(totalPedidos / PAGE_SIZE);

  // Filtro e ordenação
  const filteredPedidos = pedidos
    .filter((p) => !statusFilter || p.status === statusFilter)
    .filter((p) => {
      if (!search) return true;
      const val =
        `${p.customer_name || ""} ${p.customer_email || ""}`.toLowerCase();
      return val.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      let vA: string | number = "";
      let vB: string | number = "";
      if (sortBy === "created_at") {
        vA = a.created_at;
        vB = b.created_at;
      } else if (sortBy === "total_price") {
        vA = a.total_price || 0;
        vB = b.total_price || 0;
      } else if (sortBy === "customer_name") {
        vA = a.customer_name || "";
        vB = b.customer_name || "";
      } else if (sortBy === "status") {
        vA = a.status;
        vB = b.status;
      }
      if (vA < vB) return sortDir === "asc" ? -1 : 1;
      if (vA > vB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  const pagedPedidos = filteredPedidos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  async function handleQuickAction(id: string, newStatus: string) {
    setErrorMsg("");

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    if (updateError) {
      setErrorMsg(updateError.message || "Erro ao atualizar status do pedido");

      return;
    }

    await supabase
      .from("order_status_history")
      .insert({ order_id: id, status: newStatus, changed_by: "admin" });
    fetchPedidos();
  }

  async function fetchPedidos() {
    setLoading(true);
    setErrorMsg("");
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, customer_name, customer_email, customer_phone, created_at, total_price, status, shipping_method, payment_method, installments, payment_fee, shipping_address"
      )
      .order("created_at", { ascending: false });
    if (!error) {
      setPedidos(data || []);
    } else setErrorMsg(error.message || "Erro desconhecido ao buscar pedidos");
    setLoading(false);
  }

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("admin_auth") !== "true"
    ) {
      router.replace("/admin/login");
      return;
    }
    fetchPedidos();
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          setPedidos((prev) =>
            prev.map((p) =>
              p.id === payload.new.id ? { ...p, ...payload.new } : p
            )
          );
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      <div className="bg-white rounded shadow-md p-8 w-full max-w-7xl border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Painel de Pedidos
        </h1>
        {/* Filtros e ordenação */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <select
              className="border rounded px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os status</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <Input
              placeholder="Buscar cliente/email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 text-sm border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="border rounded px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "created_at"
                    | "total_price"
                    | "customer_name"
                    | "status"
                )
              }
            >
              <option value="created_at">Data</option>
              <option value="total_price">Valor</option>
              <option value="customer_name">Cliente</option>
              <option value="status">Status</option>
            </select>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
        {/* Cards de resumo com cores neutras e coerentes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Total de Pedidos</div>
            <div className="text-2xl font-bold text-gray-800">
              {totalPedidos}
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Total em Vendas</div>
            <div className="text-2xl font-bold text-green-700">
              R$ {totalVendas.toFixed(2).replace(".", ",")}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Pedidos Ativos</div>
            <div className="text-2xl font-bold text-blue-700">{ativos}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Finalizados</div>
            <div className="text-2xl font-bold text-gray-700">
              {finalizados}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-muted-foreground">
            Carregando pedidos...
          </div>
        ) : errorMsg ? (
          <div className="text-center text-red-600 font-bold my-4">
            {errorMsg}
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Pedidos</h1>
            <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left font-semibold">
                      Código
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Cliente
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">Data</th>
                    <th className="px-4 py-2 text-left font-semibold">Valor</th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Entrega
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Pagamento
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedPedidos.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b last:border-b-0 hover:bg-gray-100 transition"
                    >
                      <td className="px-4 py-2 font-mono whitespace-normal">
                        #{p.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-2 truncate max-w-[180px] whitespace-normal">
                        {p.customer_name || p.customer_email}
                      </td>
                      <td className="px-4 py-2 whitespace-normal">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-normal">
                        R$ {p.total_price?.toFixed(2).replace(".", ",")}
                      </td>
                      <td className="px-4 py-2 whitespace-normal">
                        <Badge variant="outline">
                          {statusLabels[p.status || ""] || p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 whitespace-normal">
                        {shippingLabels[p.shipping_method || ""] ||
                          p.shipping_method}
                      </td>
                      <td className="px-4 py-2 whitespace-normal">
                        {paymentLabels[p.payment_method || ""] ||
                          p.payment_method}
                        {p.installments && (
                          <span className="block text-xs text-gray-500">
                            {p.installments}x
                          </span>
                        )}
                        {p.payment_fee && (
                          <span className="block text-xs text-gray-500">
                            Taxa: R${" "}
                            {p.payment_fee.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex gap-2 whitespace-normal">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPedido(p)}
                          title="Detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-green-500 text-white"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Tem certeza que deseja marcar este pedido como ENVIADO?"
                              )
                            ) {
                              handleQuickAction(p.id, "shipped");
                            }
                          }}
                          title="Disparar entrega"
                        >
                          <Truck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-red-500 text-white"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Tem certeza que deseja CANCELAR este pedido?"
                              )
                            ) {
                              handleQuickAction(p.id, "cancelled");
                            }
                          }}
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded bg-[#ede3f6] text-[#6d348b] font-bold disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded bg-[#ede3f6] text-[#6d348b] font-bold disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>

      {selectedPedido && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-0 w-full max-w-md sm:max-w-2xl relative border border-gray-200 flex flex-col overflow-hidden">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl z-10"
              onClick={() => setSelectedPedido(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            {/* Cabeçalho com status e código */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#f7f3fa] px-6 py-4 border-b">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-xs text-gray-500">Pedido</span>
                <span className="text-lg font-bold text-[#6d348b] font-mono">
                  #{selectedPedido.id}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Status atual</span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: "#ede3f6", color: "#6d348b" }}
                >
                  {statusLabels[selectedPedido.status]}
                </span>
              </div>
            </div>
            {/* Conteúdo principal */}
            <div className="flex flex-col sm:flex-row gap-6 px-6 py-6">
              {/* Dados principais */}
              <div className="flex-1 space-y-3 min-w-0">
                <div>
                  <span className="block text-xs text-gray-500">Cliente</span>
                  <span className="block font-medium text-gray-900 truncate">
                    {selectedPedido.customer_name ||
                      selectedPedido.customer_email}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">
                    Data do pedido
                  </span>
                  <span className="block text-gray-800">
                    {new Date(selectedPedido.created_at).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Entrega</span>
                  <span className="block text-gray-800">
                    {shippingLabels[selectedPedido.shipping_method || ""] ||
                      selectedPedido.shipping_method}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Pagamento</span>
                  <span className="block text-gray-800">
                    {paymentLabels[selectedPedido.payment_method || ""] ||
                      selectedPedido.payment_method}
                    {selectedPedido.installments && (
                      <span className="ml-1 text-xs text-gray-500">
                        {selectedPedido.installments}x
                      </span>
                    )}
                    {selectedPedido.payment_fee && (
                      <span className="ml-1 text-xs text-gray-500">
                        Taxa: R${" "}
                        {selectedPedido.payment_fee
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">
                    Valor total
                  </span>
                  <span className="block font-bold text-green-700 text-lg">
                    R${" "}
                    {selectedPedido.total_price?.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
              {selectedPedido.shipping_method !== "pickup" &&
                selectedPedido.shipping_address && (
                  <div className="mt-4 p-3 bg-[#f7f3fa] rounded border text-sm space-y-1">
                    <span className="block text-xs text-gray-500 mb-1">
                      Endereço de entrega
                    </span>
                    <div className="text-gray-900 font-medium">
                      {selectedPedido.shipping_address.address}
                      {selectedPedido.shipping_address.number &&
                        `, ${selectedPedido.shipping_address.number}`}
                      {selectedPedido.shipping_address.complement && (
                        <span>
                          {" "}
                          - {selectedPedido.shipping_address.complement}
                        </span>
                      )}
                    </div>
                    {selectedPedido.shipping_address.neighborhood && (
                      <div className="text-gray-700">
                        {selectedPedido.shipping_address.neighborhood}
                      </div>
                    )}
                    <div className="text-gray-700">
                      {selectedPedido.shipping_address.city}
                      {selectedPedido.shipping_address.state &&
                        ` - ${selectedPedido.shipping_address.state}`}
                    </div>
                    {selectedPedido.shipping_address.zip_code && (
                      <div className="text-gray-500 text-xs">
                        CEP: {selectedPedido.shipping_address.zip_code}
                      </div>
                    )}
                  </div>
                )}
              {/* Linha do tempo do status */}
              <div className="flex-1 min-w-0">
                <span className="block text-xs text-gray-500 mb-2">
                  Histórico de status
                </span>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
                  {/* Exemplo: [{status: 'paid', changed_at: '...', changed_by: 'admin'}] */}
                  {(selectedPedido.order_status_history ?? []).length > 0 ? (
                    (selectedPedido.order_status_history ?? []).map(
                      (
                        h: {
                          status: string;
                          changed_at: string;
                          changed_by?: string;
                        },
                        i: number
                      ) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${h.status === selectedPedido.status ? "bg-[#6d348b]" : "bg-gray-300"}`}
                          ></div>
                          <span
                            className={`text-xs ${h.status === selectedPedido.status ? "font-bold text-[#6d348b]" : "text-gray-700"}`}
                          >
                            {statusLabels[h.status] || h.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(h.changed_at).toLocaleString()}
                          </span>
                          {h.changed_by && (
                            <span className="text-xs text-gray-400 ml-auto">
                              por {h.changed_by}
                            </span>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <span className="text-xs text-gray-400">Sem histórico</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
