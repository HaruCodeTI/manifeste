import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const orderId = searchParams.get("order");

  if (!email || !phone) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: email e telefone" },
      { status: 400 }
    );
  }

  if (!orderId) {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        "id, status, payment_method, shipping_method, total_price, created_at, stripe_checkout_session_id"
      )
      .eq("customer_email", email)
      .eq("customer_phone", phone)
      .order("created_at", { ascending: false });

    console.log("orders", orders);

    if (error) {
      return NextResponse.json(
        { error: "Erro ao buscar pedidos" },
        { status: 500 }
      );
    }
    return NextResponse.json({ orders: orders || [] });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, customer_email, customer_name, customer_phone, status, shipping_method, shipping_address, tracking_code, payment_method, subtotal, shipping_cost, discount_amount, total_price, created_at, stripe_checkout_session_id, installments, payment_fee"
    )
    .eq("id", orderId)
    .eq("customer_email", email)
    .eq("customer_phone", phone)
    .single();

  console.log("order", order);

  if (error || !order) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 }
    );
  }

  const { data: history } = await supabase
    .from("order_status_history")
    .select("status, changed_at, changed_by")
    .eq("order_id", orderId)
    .order("changed_at", { ascending: true });

  const { data: items } = await supabase
    .from("order_items")
    .select(
      "product_id, variant_id, quantity, price_at_purchase, product_variants(color, image_urls)"
    )
    .eq("order_id", orderId);

  console.log("items", items);

  // Buscar os nomes dos produtos separadamente
  if (items && items.length > 0) {
    const productIds = items.map((item) => item.product_id).filter(Boolean);
    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    // Mapear os nomes dos produtos aos itens
    const itemsWithNames = items.map((item) => ({
      ...item,
      products: products?.find((p) => p.id === item.product_id) || null,
    }));

    return NextResponse.json({
      order,
      history: history || [],
      items: itemsWithNames || [],
    });
  }

  return NextResponse.json({
    order,
    history: history || [],
    items: items || [],
  });
}
