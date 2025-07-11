import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const orderId = searchParams.get("order");

  if (!email || !orderId) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios" },
      { status: 400 }
    );
  }

  // Buscar pedido
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, customer_email, customer_name, customer_phone, status, shipping_method, shipping_address, tracking_code, payment_method, subtotal, shipping_cost, discount_amount, total_price, created_at, stripe_checkout_session_id"
    )
    .eq("id", orderId)
    .eq("customer_email", email)
    .single();

  if (error || !order) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 }
    );
  }

  // Buscar histórico de status
  const { data: history } = await supabase
    .from("order_status_history")
    .select("status, changed_at, changed_by")
    .eq("order_id", orderId)
    .order("changed_at", { ascending: true });

  // Buscar itens do pedido
  const { data: items } = await supabase
    .from("order_items")
    .select(
      "product_id, quantity, price_at_purchase, products(name, image_urls)"
    )
    .eq("order_id", orderId);

  return NextResponse.json({
    order,
    history: history || [],
    items: items || [],
  });
}
