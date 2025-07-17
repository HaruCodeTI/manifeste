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
      coupon,
    }: {
      items: CartItem[];
      customerInfo: { name: string; email: string; phone: string };
      shippingInfo: Record<string, unknown>;
      shippingCost: number;
      shippingMethod: string;
      paymentMethod: string;
      total: number;
      coupon?: { id: string; code: string };
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

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://seu-dominio.com"
        : "http://localhost:3001");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: (() => {
        if (!coupon) {
          // Sem cupom: usar preços originais
          return items.map((item: CartItem) => ({
            price_data: {
              currency: "brl",
              product_data: {
                name: item.name,
                images: item.image ? [item.image] : undefined,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          }));
        } else {
          // Com cupom: ajustar preços proporcionalmente
          const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const discount = subtotal - total;
          const discountRatio = discount / subtotal;

          return items.map((item: CartItem) => {
            const itemTotal = item.price * item.quantity;
            const itemDiscount = itemTotal * discountRatio;
            const adjustedPrice = (itemTotal - itemDiscount) / item.quantity;

            return {
              price_data: {
                currency: "brl",
                product_data: {
                  name: `${item.name}${coupon ? ` (${coupon.code})` : ""}`,
                  images: item.image ? [item.image] : undefined,
                },
                unit_amount: Math.round(adjustedPrice * 100),
              },
              quantity: item.quantity,
            };
          });
        }
      })(),
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
        coupon: coupon ? JSON.stringify(coupon) : "",
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
          total_price: total, // Usar o total com desconto enviado do frontend
          discount_amount: coupon
            ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) -
              total
            : 0,
          coupon_id: coupon?.id || null,
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
