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
        const sessionId = session.id;
        // Busca pedido existente pela sessão do Stripe
        const { data: existingOrder, error: findError } = await supabase
          .from("orders")
          .select("id, status")
          .eq("stripe_checkout_session_id", sessionId)
          .single();

        if (findError || !existingOrder) {
          console.error(
            "Pedido não encontrado para atualizar status após pagamento.",
            findError
          );
          return NextResponse.json(
            { error: "Pedido não encontrado para atualizar." },
            { status: 404 }
          );
        }

        // Atualiza status para 'paid'
        const { error: updateError } = await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", existingOrder.id);

        if (updateError) {
          throw updateError;
        }

        // Registra no histórico
        await supabase.from("order_status_history").insert([
          {
            order_id: existingOrder.id,
            status: "paid",
            changed_by: "stripe_webhook",
          },
        ]);

        // (Opcional) Envia e-mail de confirmação, se necessário
        if (process.env.RESEND_API_KEY) {
          try {
            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
              from: "Manifeste <noreply@onrender.email>",
              to: session.customer_details?.email || "",
              subject: "Pedido Confirmado - Manifeste",
              html: `
                <h1>Pedido Confirmado!</h1>
                <p>Obrigado por sua compra. Seu pedido foi processado com sucesso.</p>
                <p>Número do pedido: ${existingOrder.id}</p>
                <p>Total: R$ ${session.amount_total! / 100.0}</p>
              `,
            });
          } catch (emailError) {
            console.error("Erro ao enviar e-mail:", emailError);
          }
        }

        console.log(
          "Status do pedido atualizado para 'paid':",
          existingOrder.id
        );
      } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        return NextResponse.json(
          { error: "Erro ao atualizar status do pedido" },
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
