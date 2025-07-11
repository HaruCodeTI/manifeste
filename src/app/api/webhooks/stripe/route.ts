import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Erro ao verificar assinatura do webhook:", err);
      return NextResponse.json(
        { error: "Assinatura inválida" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const items = JSON.parse(session.metadata?.items || "[]");
        const total = parseFloat(session.metadata?.total || "0");
        const customerEmail = session.customer_details?.email;
        const shippingAddress = session.customer_details?.address;

        if (!customerEmail || !shippingAddress) {
          throw new Error("Dados do cliente incompletos");
        }

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer_email: customerEmail,
            shipping_address: {
              name: session.customer_details?.name || "",
              address: `${shippingAddress.line1}${shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""}`,
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              zip_code: shippingAddress.postal_code || "",
              country: shippingAddress.country || "BR",
            },
            subtotal: total,
            shipping_cost: 0,
            discount_amount: 0,
            total_price: total,
            status: "paid",
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_checkout_session_id: session.id,
          })
          .select()
          .single();

        if (orderError) {
          throw orderError;
        }

        const orderItems = items.map(
          (item: { id: string; quantity: number; price: number }) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
          })
        );

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) {
          throw itemsError;
        }

        if (process.env.RESEND_API_KEY) {
          try {
            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
              from: "Manifeste <noreply@onrender.email>",
              to: customerEmail,
              subject: "Pedido Confirmado - Manifeste",
              html: `
                <h1>Pedido Confirmado!</h1>
                <p>Obrigado por sua compra. Seu pedido foi processado com sucesso.</p>
                <p>Número do pedido: ${order.id}</p>
                <p>Total: R$ ${total.toFixed(2).replace(".", ",")}</p>
              `,
            });
          } catch (emailError) {
            console.error("Erro ao enviar e-mail:", emailError);
          }
        }

        console.log("Pedido processado com sucesso:", order.id);
      } catch (error) {
        console.error("Erro ao processar pedido:", error);
        return NextResponse.json(
          { error: "Erro ao processar pedido" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
