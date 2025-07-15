"use client";
import { createClient } from "@supabase/supabase-js";
import {
  CheckCircle,
  PackageCheck,
  PackageX,
  Pencil,
  Truck,
} from "lucide-react";
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
  card: "Cartão",
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
  // Adicione outros campos conforme necessário
}

export default function AdminPedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoAdminList[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "created_at" | "total_price" | "status" | "customer_name"
  >("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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
  const pagedPedidos = [...pedidos]
    .sort((a, b) => {
      let vA = a[sortBy] || "";
      let vB = b[sortBy] || "";
      if (sortBy === "total_price") {
        vA = Number(vA);
        vB = Number(vB);
      }
      if (vA < vB) return sortDir === "asc" ? -1 : 1;
      if (vA > vB) return sortDir === "asc" ? 1 : -1;
      return 0;
    })
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Função para ação rápida
  async function handleQuickAction(id: string, newStatus: string) {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    await supabase
      .from("order_status_history")
      .insert({ order_id: id, status: newStatus, changed_by: "admin" });
  }

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("admin_auth") !== "true"
    ) {
      router.replace("/admin/login");
      return;
    }
    // Buscar pedidos
    async function fetchPedidos() {
      setLoading(true);
      setErrorMsg("");
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, customer_name, customer_email, customer_phone, created_at, total_price, status, shipping_method, payment_method"
        )
        .order("created_at", { ascending: false });
      if (!error) setPedidos(data || []);
      else setErrorMsg(error.message || "Erro desconhecido ao buscar pedidos");
      setLoading(false);
    }
    fetchPedidos();
    // Realtime
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
    <div className="min-h-screen bg-[#ede3f6] flex flex-col items-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-5xl border border-[#d4af37]/40">
        <h1 className="text-2xl font-bold text-[#6d348b] mb-6 text-center">
          Painel de Pedidos
        </h1>
        {/* Cards de resumo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#ede3f6] rounded-xl p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Total de Pedidos
            </div>
            <div className="text-2xl font-bold text-[#6d348b]">
              {totalPedidos}
            </div>
          </div>
          <div className="bg-[#f8e5d8] rounded-xl p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Total em Vendas
            </div>
            <div className="text-2xl font-bold text-[#e65a4d]">
              R$ {totalVendas.toFixed(2).replace(".", ",")}
            </div>
          </div>
          <div className="bg-[#ede3f6] rounded-xl p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Pedidos Ativos
            </div>
            <div className="text-2xl font-bold text-[#6d348b]">{ativos}</div>
          </div>
          <div className="bg-[#f8e5d8] rounded-xl p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Finalizados
            </div>
            <div className="text-2xl font-bold text-[#bfaecb]">
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
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#d4af37]/20 text-[#6d348b]">
                  <th
                    className="px-2 py-2 text-left w-28 cursor-pointer"
                    onClick={() => {
                      setSortBy("created_at");
                      setSortDir(
                        sortBy === "created_at" && sortDir === "desc"
                          ? "asc"
                          : "desc"
                      );
                    }}
                  >
                    Código{" "}
                    {sortBy === "created_at"
                      ? sortDir === "desc"
                        ? "↓"
                        : "↑"
                      : ""}
                  </th>
                  <th
                    className="px-3 py-2 text-left w-48 cursor-pointer"
                    onClick={() => {
                      setSortBy("customer_name");
                      setSortDir(
                        sortBy === "customer_name" && sortDir === "desc"
                          ? "asc"
                          : "desc"
                      );
                    }}
                  >
                    Cliente{" "}
                    {sortBy === "customer_name"
                      ? sortDir === "desc"
                        ? "↓"
                        : "↑"
                      : ""}
                  </th>
                  <th
                    className="px-3 py-2 text-left w-40 cursor-pointer"
                    onClick={() => {
                      setSortBy("created_at");
                      setSortDir(
                        sortBy === "created_at" && sortDir === "desc"
                          ? "asc"
                          : "desc"
                      );
                    }}
                  >
                    Data{" "}
                    {sortBy === "created_at"
                      ? sortDir === "desc"
                        ? "↓"
                        : "↑"
                      : ""}
                  </th>
                  <th
                    className="px-2 py-2 text-left w-24 cursor-pointer"
                    onClick={() => {
                      setSortBy("total_price");
                      setSortDir(
                        sortBy === "total_price" && sortDir === "desc"
                          ? "asc"
                          : "desc"
                      );
                    }}
                  >
                    Valor{" "}
                    {sortBy === "total_price"
                      ? sortDir === "desc"
                        ? "↓"
                        : "↑"
                      : ""}
                  </th>
                  <th
                    className="px-2 py-2 text-left w-40 cursor-pointer"
                    onClick={() => {
                      setSortBy("status");
                      setSortDir(
                        sortBy === "status" && sortDir === "desc"
                          ? "asc"
                          : "desc"
                      );
                    }}
                  >
                    Status{" "}
                    {sortBy === "status"
                      ? sortDir === "desc"
                        ? "↓"
                        : "↑"
                      : ""}
                  </th>
                  <th className="px-2 py-2 text-left w-24">Entrega</th>
                  <th className="px-2 py-2 text-left w-24">Pagamento</th>
                  <th className="px-2 py-2 text-left w-20">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pagedPedidos.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={
                      "border-b last:border-b-0 " +
                      (idx % 2 === 0 ? "bg-[#f8e5d8]/40" : "bg-white")
                    }
                  >
                    <td className="px-2 py-2 font-mono">
                      #{p.id.slice(0, 8)}...
                    </td>
                    <td className="px-3 py-2 truncate max-w-[180px]">
                      {p.customer_name || p.customer_email}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                    <td className="px-2 py-2">
                      R$ {p.total_price?.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="px-2 py-2 font-semibold text-[#6d348b]">
                      {statusLabels[p.status || ""] || p.status}
                    </td>
                    <td className="px-2 py-2">
                      {shippingLabels[p.shipping_method || ""] || p.shipping_method}
                    </td>
                    <td className="px-2 py-2">
                      {paymentLabels[p.payment_method || ""] || p.payment_method}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 items-center">
                        <button
                          className="bg-gray-500 text-white rounded px-2 py-1 text-xs font-bold hover:bg-gray-700 transition flex items-center gap-1"
                          onClick={() => router.push(`/admin/pedidos/${p.id}`)}
                          title="Ver/Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Ações rápidas */}
                        {["processing", "paid", "pending_payment"].includes(
                          p.status
                        ) &&
                          p.shipping_method === "delivery" && (
                            <button
                              className="bg-blue-600 text-white rounded px-2 py-1 text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1"
                              onClick={() => handleQuickAction(p.id, "shipped")}
                              title="Sair para entrega"
                            >
                              <Truck className="w-4 h-4" /> Sair p/ entrega
                            </button>
                          )}
                        {["processing", "paid", "pending_payment"].includes(
                          p.status
                        ) &&
                          p.shipping_method === "pickup" && (
                            <button
                              className="bg-yellow-400 text-gray-900 rounded px-2 py-1 text-xs font-bold hover:bg-yellow-500 transition flex items-center gap-1"
                              onClick={() =>
                                handleQuickAction(p.id, "aguardando_retirada")
                              }
                              title="Pronto para retirar"
                            >
                              <PackageCheck className="w-4 h-4" /> Pronto p/
                              retirar
                            </button>
                          )}
                        {["shipped", "aguardando_retirada"].includes(
                          p.status
                        ) && (
                          <button
                            className="bg-green-600 text-white rounded px-2 py-1 text-xs font-bold hover:bg-green-800 transition flex items-center gap-1"
                            onClick={() => handleQuickAction(p.id, "delivered")}
                            title="Finalizar pedido"
                          >
                            <CheckCircle className="w-4 h-4" /> Finalizar
                          </button>
                        )}
                        {!["delivered", "cancelled", "refunded"].includes(
                          p.status
                        ) && (
                          <button
                            className="bg-red-500 text-white rounded px-2 py-1 text-xs font-bold hover:bg-red-700 transition flex items-center gap-1"
                            onClick={() => handleQuickAction(p.id, "cancelled")}
                            title="Cancelar pedido"
                          >
                            <PackageX className="w-4 h-4" /> Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Paginação */}
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
    </div>
  );
}
