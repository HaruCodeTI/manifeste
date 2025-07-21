import { CartItem } from "@/hooks/useCart";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customerInfo,
      shippingInfo,
      shippingCost,
      shippingMethod,
      paymentMethod,
      total,
      coupon,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    // Validação de estoque
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    // Buscar os produtos do carrinho
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, stock_quantity, name")
      .in(
        "id",
        items.map((item: CartItem) => item.id)
      );
    if (productsError || !products) {
      return NextResponse.json(
        { error: "Erro ao validar estoque" },
        { status: 500 }
      );
    }
    // Verificar se todos têm estoque suficiente
    const insufficientStock = items.find((item: CartItem) => {
      const product = products.find(
        (p: { id: string; stock_quantity: number }) => p.id === item.id
      );
      return !product || product.stock_quantity < item.quantity;
    });
    if (insufficientStock) {
      const product = products.find(
        (p: { id: string; name: string }) => p.id === insufficientStock.id
      );
      return NextResponse.json(
        {
          error: `Estoque insuficiente para o produto: ${
            product ? product.name : "Produto não encontrado"
          }`,
        },
        { status: 400 }
      );
    }

    // Salvar pedido no Supabase
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
          total_price: total, // Usar o total com desconto enviado do frontend
          discount_amount: coupon
            ? items.reduce(
                (sum: number, item: CartItem) =>
                  sum + item.price * item.quantity,
                0
              ) - total
            : 0,
          coupon_id: coupon?.id || null,
          status: "pending_payment",
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

    const orderItems = items.map((item: CartItem) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));
    await supabase.from("order_items").insert(orderItems);

    // Atualizar uso do cupom se aplicável
    if (coupon?.id) {
      await supabase
        .from("coupons")
        .update({ times_used: supabase.rpc("increment", { x: 1 }) })
        .eq("id", coupon.id);
    }

    // Debitar estoque
    for (const item of items) {
      // Buscar estoque atual
      const { data: prod, error: prodError } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.id)
        .single();
      if (prodError || !prod) {
        return NextResponse.json(
          { error: `Erro ao buscar estoque do produto: ${item.id}` },
          { status: 500 }
        );
      }
      const novoEstoque = Math.max(
        0,
        (prod.stock_quantity || 0) - item.quantity
      );
      const { error: stockError } = await supabase
        .from("products")
        .update({ stock_quantity: novoEstoque })
        .eq("id", item.id);
      if (stockError) {
        return NextResponse.json(
          { error: `Erro ao debitar estoque do produto: ${item.id}` },
          { status: 500 }
        );
      }
    }

    await supabase.from("order_status_history").insert([
      {
        order_id: order.id,
        status: "pending_payment",
        changed_by: customerInfo.email,
      },
    ]);

    return NextResponse.json({ orderId: order.id });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
