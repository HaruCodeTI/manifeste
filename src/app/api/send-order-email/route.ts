import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId obrigatório" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "id, customer_email, customer_name, customer_phone, shipping_method, shipping_address, payment_method, subtotal, shipping_cost, discount_amount, total_price, created_at"
      )
      .eq("id", orderId)
      .single();
    if (error || !order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }
    if (!order.customer_email) {
      return NextResponse.json(
        { error: "Pedido sem e-mail do cliente" },
        { status: 400 }
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(
        "quantity, price_at_purchase, product_variants(color, image_urls), products(name)"
      )
      .eq("order_id", orderId);
    if (itemsError) {
      return NextResponse.json(
        { error: "Erro ao buscar itens do pedido" },
        { status: 500 }
      );
    }

    const produtosHtml =
      items && items.length
        ? `<table style='width:100%;border-collapse:collapse;margin:16px 0;'>
          <thead>
            <tr>
              <th style='border:1px solid #eee;padding:8px;text-align:left;'>Produto</th>
              <th style='border:1px solid #eee;padding:8px;text-align:center;'>Qtd</th>
              <th style='border:1px solid #eee;padding:8px;text-align:right;'>Preço</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map((item) => {
                let productName = "";
                if (item.products) {
                  if (Array.isArray(item.products)) {
                    productName = item.products[0]?.name || "";
                  }
                }
                return `
                    <tr>
                      <td style='border:1px solid #eee;padding:8px;'>${productName}</td>
                      <td style='border:1px solid #eee;padding:8px;text-align:center;'>${item.quantity}</td>
                      <td style='border:1px solid #eee;padding:8px;text-align:right;'>R$ ${item.price_at_purchase?.toFixed(2).replace(".", ",")}</td>
                    </tr>
                  `;
              })
              .join("")}
          </tbody>
        </table>`
        : "<p>Nenhum produto encontrado.</p>";

    let enderecoHtml = "";
    if (order.shipping_address) {
      const addr = order.shipping_address;
      enderecoHtml = `<p style='margin:0 0 8px 0;'><b>Endereço de entrega:</b><br/>
        ${addr.address || ""}${addr.number ? ", " + addr.number : ""}${addr.complement ? " - " + addr.complement : ""}<br/>
        ${addr.neighborhood || ""}${addr.city ? " - " + addr.city : ""}${addr.state ? " - " + addr.state : ""}<br/>
        CEP: ${addr.cep || ""}
      </p>`;
    }

    const html = `
      <div style='font-family:sans-serif;max-width:600px;margin:0 auto;'>
        <h1 style='color:#6d348b;'>Pedido realizado com sucesso!</h1>
        <p>Olá, <b>${order.customer_name || "cliente"}</b>!</p>
        <p>Recebemos seu pedido e ele está sendo processado. Confira os detalhes abaixo:</p>
        <h2 style='color:#b689e0;font-size:1.1rem;margin:24px 0 8px;'>Resumo do Pedido</h2>
        <p><b>Data:</b> ${new Date(order.created_at).toLocaleString("pt-BR")}</p>
        <p><b>Telefone:</b> ${order.customer_phone || "-"}</p>
        <p><b>Método de pagamento:</b> ${order.payment_method}</p>
        <p><b>Método de entrega:</b> ${order.shipping_method}</p>
        ${enderecoHtml}
        <h3 style='color:#b689e0;font-size:1rem;margin:16px 0 8px;'>Produtos</h3>
        ${produtosHtml}
        <div style='margin:16px 0;'>
          <p><b>Subtotal:</b> R$ ${order.subtotal?.toFixed(2).replace(".", ",")}</p>
          <p><b>Frete:</b> R$ ${order.shipping_cost?.toFixed(2).replace(".", ",")}</p>
          <p><b>Desconto:</b> R$ ${order.discount_amount?.toFixed(2).replace(".", ",")}</p>
          <p style='font-size:1.1rem;'><b>Total:</b> <span style='color:#6d348b;'>R$ ${order.total_price?.toFixed(2).replace(".", ",")}</span></p>
        </div>
        <p style='margin-top:24px;'>Você pode acompanhar o status do pedido pelo site.</p>
        <p style='color:#b689e0;font-size:0.95rem;margin-top:32px;'>Obrigado por comprar com a Manifeste 💜</p>
      </div>
    `;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Resend não configurado" },
        { status: 500 }
      );
    }
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Manifeste <noreply@onrender.email>",
        to: order.customer_email,
        subject: "Confirmação do Pedido - Manifeste",
        html,
      });
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Erro ao enviar e-mail" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
