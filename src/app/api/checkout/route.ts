import { CartItem } from "@/hooks/useCart";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

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
    }: {
      items: CartItem[];
      customerInfo: { name: string; email: string; phone: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shippingInfo: any;
      shippingCost: number;
      shippingMethod: string;
      paymentMethod: string;
      total: number;
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
    const insufficientStock = items.find((item) => {
      const product = products.find((p: any) => p.id === item.id);
      return !product || product.stock_quantity < item.quantity;
    });
    if (insufficientStock) {
      const product = products.find((p: any) => p.id === insufficientStock.id);
      return NextResponse.json(
        {
          error: `Estoque insuficiente para o produto: ${
            product ? product.name : "Produto não encontrado"
          }`,
        },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://seu-dominio.com"
        : "http://localhost:3001");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
        total: total.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },
      customer_email: undefined,
    });

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
          status: "pending_payment",
          stripe_checkout_session_id: session.id,
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

    // Debitar estoque
    for (const item of items) {
      const { error: stockError } = await supabase
        .from("products")
        .update({
          stock_quantity: supabase.rpc("decrement_stock", {
            product_id: item.id,
            amount: item.quantity,
          }),
        })
        .eq("id", item.id);
      // Se não houver função RPC, faz update direto:
      // .update({ stock_quantity: (produto.stock_quantity - item.quantity) })
      // .eq("id", item.id);
      if (stockError) {
        // Opcional: desfazer pedido e itens se falhar
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
