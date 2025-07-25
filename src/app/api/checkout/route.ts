import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);
    const {
      items,
      customerInfo,
      shippingInfo,
      shippingCost,
      shippingMethod,
      paymentMethod,
      total,
      coupon,
      installments,
      payment_fee,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    // Buscar variantes do carrinho
    type VariantMinimal = {
      id: string;
      product_id: string;
      price: number;
      stock_quantity: number;
    };
    const variantIds = items.map(
      (item: { variant_id: string }) => item.variant_id
    );
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("id, product_id, price, stock_quantity")
      .in("id", variantIds);
    if (variantsError || !variants) {
      return NextResponse.json(
        { error: "Erro ao validar variantes" },
        { status: 500 }
      );
    }
    // Verificar estoque
    const insufficientStock = items.find(
      (item: { variant_id: string; quantity: number }) => {
        const variant = (variants as VariantMinimal[]).find(
          (v) => v.id === item.variant_id
        );
        return !variant || variant.stock_quantity < item.quantity;
      }
    );
    if (insufficientStock) {
      return NextResponse.json(
        { error: `Estoque insuficiente para a variante selecionada.` },
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
          installments: installments || 1,
          payment_fee: payment_fee || 0,
          subtotal: items.reduce(
            (sum: number, item: { price: number; quantity: number }) =>
              sum + item.price * item.quantity,
            0
          ),
          total_price: total, // Usar o total com desconto enviado do frontend
          discount_amount: coupon
            ? items.reduce(
                (sum: number, item: { price: number; quantity: number }) =>
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

    // Salvar itens do pedido com variant_id
    const orderItems = items.map(
      (item: {
        product_id: string;
        variant_id: string;
        quantity: number;
        price: number;
      }) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      })
    );
    await supabase.from("order_items").insert(orderItems);

    // Debitar estoque da variante
    for (const item of items) {
      const variant = (variants as VariantMinimal[]).find(
        (v) => v.id === item.variant_id
      );
      if (!variant) continue;
      const novoEstoque = Math.max(
        0,
        (variant.stock_quantity || 0) - item.quantity
      );
      await supabase
        .from("product_variants")
        .update({ stock_quantity: novoEstoque })
        .eq("id", item.variant_id);
    }

    // Atualizar uso do cupom se aplicável
    if (coupon?.id) {
      await supabase
        .from("coupons")
        .update({ times_used: supabase.rpc("increment", { x: 1 }) })
        .eq("id", coupon.id);
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
