import { CartItem } from "@/hooks/useCart";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingInfo,
      customerInfo,
      shippingCost,
      shippingMethod,
      paymentMethod,
      total,
    } = body;

    if (!items || !customerInfo?.email || !total) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // Cria pedido
    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_email: customerInfo.email,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          shipping_address: shippingInfo,
          shipping_cost: shippingCost,
          shipping_method: shippingMethod,
          payment_method: paymentMethod,
          subtotal: items.reduce(
            (sum: number, item: CartItem) => sum + item.price * item.quantity,
            0
          ),
          total_price: total,
          status:
            paymentMethod === "card" ? "pending_payment" : "pending_payment",
        },
      ])
      .select("id")
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Erro ao criar pedido" },
        { status: 500 }
      );
    }

    // Cria itens do pedido
    const orderItems = items.map((item: CartItem) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));
    await supabase.from("order_items").insert(orderItems);

    // Cria histórico inicial
    await supabase.from("order_status_history").insert([
      {
        order_id: order.id,
        status:
          paymentMethod === "card" ? "pending_payment" : "pending_payment",
        changed_by: customerInfo.email,
      },
    ]);

    return NextResponse.json({ orderId: order.id });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
