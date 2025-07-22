"use client";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, PackageCheck, PackageX, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
const statusOptions = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "aguardando_retirada",
];

interface PedidoAdmin {
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
  // Adicione outros campos conforme necessário
}

export default function AdminPedidoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [pedido, setPedido] = useState<PedidoAdmin | null>(null);
  const [history, setHistory] = useState<PedidoAdmin["order_status_history"]>(
    []
  );
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("admin_auth") !== "true"
    ) {
      window.location.href = "/admin/login";
      return;
    }
    async function fetchPedido() {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_status_history(status, changed_at, changed_by)")
        .eq("id", id)
        .single();
      if (!error && data) {
        setPedido(data);
        setStatus(data.status);
        setHistory(
          (data.order_status_history || []).sort(
            (a: { changed_at: string }, b: { changed_at: string }) =>
              new Date(a.changed_at).getTime() -
              new Date(b.changed_at).getTime()
          )
        );
      }
    }
    fetchPedido();

    const channel = supabase
      .channel("admin-order-detail")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setPedido((prev: PedidoAdmin | null) =>
            prev ? { ...prev, ...payload.new } : prev
          );
          setStatus(payload.new.status);
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [id, router]);

  async function handleStatusUpdate() {
    setSaving(true);
    setMsg("");
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (!error) {
      await supabase
        .from("order_status_history")
        .insert({ order_id: id, status, changed_by: "admin" });
      setMsg("Status atualizado com sucesso!");
      // Refetch pedido/histórico
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*, order_status_history(status, changed_at, changed_by)")
        .eq("id", id)
        .single();
      if (!fetchError && data) {
        setPedido(data);
        setStatus(data.status);
        setHistory(
          (data.order_status_history || []).sort(
            (a: { changed_at: string }, b: { changed_at: string }) =>
              new Date(a.changed_at).getTime() -
              new Date(b.changed_at).getTime()
          )
        );
      }
    } else {
      setMsg("Erro ao atualizar status");
    }
    setSaving(false);
  }

  async function handleQuickAction(newStatus: string) {
    setSaving(true);
    setMsg("");
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      await supabase
        .from("order_status_history")
        .insert({ order_id: id, status: newStatus, changed_by: "admin" });
      setMsg("Status atualizado com sucesso!");
      // Refetch pedido/histórico
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*, order_status_history(status, changed_at, changed_by)")
        .eq("id", id)
        .single();
      if (!fetchError && data) {
        setPedido(data);
        setStatus(data.status);
        setHistory(
          (data.order_status_history || []).sort(
            (a: { changed_at: string }, b: { changed_at: string }) =>
              new Date(a.changed_at).getTime() -
              new Date(b.changed_at).getTime()
          )
        );
      }
    } else {
      setMsg("Erro ao atualizar status");
    }
    setSaving(false);
  }

  if (!pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ede3f6]">
        Carregando...
      </div>
    );
  }

  const safeHistory = history ?? [];

  return (
    <div className="min-h-screen bg-[#ede3f6] flex flex-col items-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl border border-[#d4af37]/40">
        <button
          className="mb-4 text-[#6d348b] hover:underline font-bold"
          onClick={() => router.push("/admin/pedidos")}
        >
          &larr; Voltar
        </button>
        <h1 className="text-2xl font-bold text-[#6d348b] mb-4 text-center">
          Pedido #{pedido.id.slice(0, 8)}...
        </h1>
        <div className="mb-4">
          <div className="mb-2">
            <b>Cliente:</b> {pedido.customer_name || pedido.customer_email}
          </div>
          <div className="mb-2">
            <b>Data:</b> {new Date(pedido.created_at).toLocaleString()}
          </div>
          <div className="mb-2">
            <b>Valor:</b> R$ {pedido.total_price?.toFixed(2).replace(".", ",")}
          </div>
          <div className="mb-2">
            <b>Status atual:</b>{" "}
            <span className="font-semibold text-[#6d348b]">
              {statusLabels[pedido.status] || pedido.status}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Atualizar status:</label>
          <select
            className="border border-[#d4af37]/40 rounded px-3 py-2 w-full mb-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={saving}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {statusLabels[opt] || opt}
              </option>
            ))}
          </select>
          <button
            className="bg-[#6d348b] text-white rounded py-2 px-4 font-bold hover:bg-[#4b206b] transition w-full mb-2"
            onClick={handleStatusUpdate}
            disabled={saving || status === pedido.status}
          >
            {saving ? "Salvando..." : "Salvar status"}
          </button>
          {/* Ações rápidas */}
          <div className="flex flex-wrap gap-2 mt-2">
            {["processing", "paid", "pending_payment"].includes(
              pedido.status
            ) &&
              pedido.shipping_method === "delivery" && (
                <button
                  className="bg-[#e65a4d] text-white rounded px-2 py-1 text-xs font-bold hover:bg-[#b93c2b] transition flex items-center gap-1"
                  onClick={() => handleQuickAction("shipped")}
                  disabled={saving}
                  title="Sair para entrega"
                >
                  <Truck className="w-4 h-4" /> Sair p/ entrega
                </button>
              )}
            {["processing", "paid", "pending_payment"].includes(
              pedido.status
            ) &&
              pedido.shipping_method === "pickup" && (
                <button
                  className="bg-[#d4af37] text-[#6d348b] rounded px-2 py-1 text-xs font-bold hover:bg-[#bfaecb] transition flex items-center gap-1"
                  onClick={() => handleQuickAction("aguardando_retirada")}
                  disabled={saving}
                  title="Pronto para retirar"
                >
                  <PackageCheck className="w-4 h-4" /> Pronto p/ retirar
                </button>
              )}
            {["shipped", "aguardando_retirada"].includes(pedido.status) && (
              <button
                className="bg-[#6d348b] text-white rounded px-2 py-1 text-xs font-bold hover:bg-[#4b206b] transition flex items-center gap-1"
                onClick={() => handleQuickAction("delivered")}
                disabled={saving}
                title="Finalizar pedido"
              >
                <CheckCircle className="w-4 h-4" /> Finalizar
              </button>
            )}
            {!["delivered", "cancelled", "refunded"].includes(
              pedido.status
            ) && (
              <button
                className="bg-[#bfaecb] text-[#6d348b] rounded px-2 py-1 text-xs font-bold hover:bg-[#ede3f6] transition flex items-center gap-1"
                onClick={() => handleQuickAction("cancelled")}
                disabled={saving}
                title="Cancelar pedido"
              >
                <PackageX className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>
          {msg && <div className="text-center mt-2 text-[#6d348b]">{msg}</div>}
        </div>
        <div>
          <h2 className="font-bold mb-2 text-[#6d348b]">Histórico de Status</h2>
          <ul className="text-sm space-y-1">
            {safeHistory.map((h, i) => (
              <li
                key={i}
                className="flex justify-between border-b last:border-b-0 pb-1"
              >
                <span>{statusLabels[h.status] || h.status}</span>
                <span className="text-muted-foreground">
                  {new Date(h.changed_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
