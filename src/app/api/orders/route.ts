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
      coupon,
      descontoPix = 0, // Novo campo para desconto PIX
    } = body;

    if (!items || !customerInfo?.email || !total) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
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

    // Criar pedido
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
          installments: body.installments || 1,
          payment_fee: body.payment_fee || 0,
          subtotal: items.reduce(
            (sum: number, item: { price: number; quantity: number }) =>
              sum + item.price * item.quantity,
            0
          ),
          total_price: total,
          discount_amount:
            (coupon
              ? items.reduce(
                  (sum: number, item: { price: number; quantity: number }) =>
                    sum + item.price * item.quantity,
                  0
                ) - total
              : 0) + descontoPix, // Incluir desconto PIX no total
          coupon_id: coupon?.id || null,
          status: "processing",
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

    // Após inserir os itens, enviar o e-mail para a empresa
    if (process.env.RESEND_API_KEY) {
      try {
        const { data: orderFull } = await supabase
          .from("orders")
          .select(
            "id, customer_email, customer_name, customer_phone, shipping_method, shipping_address, payment_method, subtotal, shipping_cost, discount_amount, total_price, created_at"
          )
          .eq("id", order.id)
          .single();
        // Buscar itens com join manual igual ao /track
        const { data: items } = await supabase
          .from("order_items")
          .select(
            "product_id, variant_id, quantity, price_at_purchase, product_variants(color, image_urls)"
          )
          .eq("order_id", order.id);
        // Definir tipo para os itens enriquecidos
        const safeItems = items || [];
        type ItemWithProduct = (typeof safeItems)[0] & {
          products?: { name: string } | null;
        };
        let itemsWithNames: ItemWithProduct[] = safeItems;
        if (safeItems.length > 0) {
          const productIds = safeItems
            .map((item) => item.product_id)
            .filter(Boolean);
          const { data: products } = await supabase
            .from("products")
            .select("id, name")
            .in("id", productIds);
          itemsWithNames = safeItems.map((item) => ({
            ...item,
            products: products?.find((p) => p.id === item.product_id) || null,
          }));
        }
        if (!orderFull) {
          throw new Error("Pedido não encontrado para envio de e-mail");
        }
        const produtosHtml =
          itemsWithNames && itemsWithNames.length
            ? `<table style='width:100%;border-collapse:collapse;margin:16px 0;'>
                <thead>
                  <tr>
                    <th style='border:1px solid #eee;padding:8px;text-align:left;'>Produto</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:left;'>Variação</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:center;'>Qtd</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:right;'>Valor unit.</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:right;'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsWithNames
                    .map((item) => {
                      const productName = item.products?.name || "-";
                      // Corrigir acesso à cor da variação
                      let color = "-";
                      if (item.product_variants) {
                        if (Array.isArray(item.product_variants)) {
                          color =
                            (item.product_variants[0] as { color?: string })
                              ?.color || "-";
                        } else if (typeof item.product_variants === "object") {
                          color =
                            (item.product_variants as { color?: string })
                              ?.color || "-";
                        }
                      }
                      return `
                        <tr>
                          <td style='border:1px solid #eee;padding:8px;'>${productName}</td>
                          <td style='border:1px solid #eee;padding:8px;'>${color}</td>
                          <td style='border:1px solid #eee;padding:8px;text-align:center;'>${item.quantity}</td>
                          <td style='border:1px solid #eee;padding:8px;text-align:right;'>R$ ${item.price_at_purchase?.toFixed(2).replace(".", ",")}</td>
                          <td style='border:1px solid #eee;padding:8px;text-align:right;'>R$ ${(item.price_at_purchase * item.quantity).toFixed(2).replace(".", ",")}</td>
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>`
            : "<p>Nenhum produto encontrado.</p>";
        let enderecoHtml = "";
        if (orderFull.shipping_address) {
          const addr = orderFull.shipping_address;
          enderecoHtml = `<p style='margin:0 0 8px 0;'><b>Endereço de entrega:</b><br/>
            ${addr.address || ""}${addr.number ? ", " + addr.number : ""}${addr.complement ? " - " + addr.complement : ""}<br/>
            ${addr.neighborhood || ""}${addr.city ? " - " + addr.city : ""}${addr.state ? " - " + addr.state : ""}<br/>
            CEP: ${addr.cep || ""}
          </p>`;
        }
        const html = `
          <div style='font-family:sans-serif;max-width:600px;margin:0 auto;'>
            <h2 style='color:#6d348b;'>Novo pedido recebido!</h2>
            <p><b>ID do pedido:</b> ${orderFull.id}</p>
            <p><b>Data:</b> ${new Date(orderFull.created_at).toLocaleString("pt-BR")}</p>
            <p><b>Cliente:</b> ${orderFull.customer_name} (${orderFull.customer_email})</p>
            <p><b>Telefone:</b> ${orderFull.customer_phone || "-"}</p>
            ${enderecoHtml}
            <p><b>Método de pagamento:</b> ${orderFull.payment_method}</p>
            <p><b>Método de entrega:</b> ${orderFull.shipping_method}</p>
            <h3 style='color:#b689e0;font-size:1rem;margin:16px 0 8px;'>Produtos</h3>
            ${produtosHtml}
            <div style='margin:16px 0;'>
              <p><b>Subtotal:</b> R$ ${orderFull.subtotal?.toFixed(2).replace(".", ",")}</p>
              <p><b>Frete:</b> R$ ${orderFull.shipping_cost?.toFixed(2).replace(".", ",")}</p>
              <p><b>Desconto:</b> R$ ${orderFull.discount_amount?.toFixed(2).replace(".", ",")}</p>
              <p style='font-size:1.1rem;'><b>Total:</b> <span style='color:#6d348b;'>R$ ${orderFull.total_price?.toFixed(2).replace(".", ",")}</span></p>
            </div>
            <p style='margin-top:24px;'>Acesse o painel admin para mais detalhes.</p>
          </div>
        `;
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Manifeste <contato@manifestecg.com.br>",
          to: "contato@manifestecg.com.br",
          subject: `Novo pedido #${orderFull.id} - Manifeste`,
          html,
        });
      } catch (e) {
        // Não bloquear o fluxo se falhar
        console.error("Erro ao enviar e-mail para empresa:", e);
      }
    }

    // Enviar e-mail de confirmação para o cliente
    if (process.env.RESEND_API_KEY) {
      try {
        // Buscar dados completos do pedido
        const { data: orderFull } = await supabase
          .from("orders")
          .select(
            "id, customer_email, customer_name, customer_phone, shipping_method, shipping_address, payment_method, subtotal, shipping_cost, discount_amount, total_price, created_at, installments"
          )
          .eq("id", order.id)
          .single();

        if (!orderFull) {
          throw new Error("Pedido não encontrado para envio de e-mail");
        }

        // Buscar itens com join manual
        const { data: items } = await supabase
          .from("order_items")
          .select(
            "product_id, variant_id, quantity, price_at_purchase, product_variants(color, image_urls)"
          )
          .eq("order_id", order.id);

        const safeItems = items || [];
        type ItemWithProduct = (typeof safeItems)[0] & {
          products?: { name: string } | null;
        };
        let itemsWithNames: ItemWithProduct[] = safeItems;
        if (safeItems.length > 0) {
          const productIds = safeItems
            .map((item) => item.product_id)
            .filter(Boolean);
          const { data: products } = await supabase
            .from("products")
            .select("id, name")
            .in("id", productIds);
          itemsWithNames = safeItems.map((item) => ({
            ...item,
            products: products?.find((p) => p.id === item.product_id) || null,
          }));
        }

        // Formatar método de pagamento
        const paymentMethodLabels: Record<string, string> = {
          pix: "Pix",
          debit: "Débito",
          card: "Cartão de Crédito (à vista)",
          card_installments: "Cartão de Crédito (parcelado)",
          cash: "Dinheiro",
          boleto: "Boleto",
        };
        const formattedPaymentMethod =
          paymentMethodLabels[orderFull.payment_method] ||
          orderFull.payment_method;
        const installmentsText =
          orderFull.payment_method === "card_installments" &&
          (orderFull.installments ?? 1) > 1
            ? ` em ${orderFull.installments ?? 1}x`
            : "";

        // Formatar método de entrega
        const shippingMethodLabels: Record<string, string> = {
          pickup: "Retirar no local",
          delivery: "Entrega",
        };
        const formattedShippingMethod =
          shippingMethodLabels[orderFull.shipping_method] ||
          orderFull.shipping_method;

        // Montar tabela de produtos
        const produtosHtml =
          itemsWithNames && itemsWithNames.length
            ? `<table style='width:100%;border-collapse:collapse;margin:16px 0;'>
                <thead>
                  <tr>
                    <th style='border:1px solid #eee;padding:8px;text-align:left;'>Produto</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:left;'>Variação</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:center;'>Qtd</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:right;'>Valor unit.</th>
                    <th style='border:1px solid #eee;padding:8px;text-align:right;'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsWithNames
                    .map((item) => {
                      const productName = item.products?.name || "-";
                      let color = "-";
                      if (item.product_variants) {
                        if (Array.isArray(item.product_variants)) {
                          color =
                            (item.product_variants[0] as { color?: string })
                              ?.color || "-";
                        } else if (typeof item.product_variants === "object") {
                          color =
                            (item.product_variants as { color?: string })
                              ?.color || "-";
                        }
                      }
                      return `
                        <tr>
                          <td style='border:1px solid #eee;padding:8px;'>${productName}</td>
                          <td style='border:1px solid #eee;padding:8px;'>${color}</td>
                          <td style='border:1px solid #eee;padding:8px;text-align:center;'>${item.quantity}</td>
                          <td style='border:1px solid #eee;padding:8px;text-align:right;'>R$ ${item.price_at_purchase?.toFixed(2).replace(".", ",")}</td>
                          <td style='border:1px solid #eee;padding:8px;text-align:right;'>R$ ${(item.price_at_purchase * item.quantity).toFixed(2).replace(".", ",")}</td>
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>`
            : "<p>Nenhum produto encontrado.</p>";

        // Montar endereço de entrega
        let enderecoHtml = "";
        if (orderFull.shipping_address) {
          const addr = orderFull.shipping_address;
          enderecoHtml = `<p style='margin:0 0 8px 0;'><b>Endereço de entrega:</b><br/>
            ${addr.address || ""}${addr.number ? ", " + addr.number : ""}${addr.complement ? " - " + addr.complement : ""}<br/>
            ${addr.neighborhood || ""}${addr.city ? " - " + addr.city : ""}${addr.state ? " - " + addr.state : ""}<br/>
            CEP: ${addr.cep || ""}
          </p>`;
        }

        // Montar HTML do e-mail para o cliente
        const html = `
          <div style='font-family:sans-serif;max-width:600px;margin:0 auto;'>
            <h1 style='color:#6d348b;'>Pedido realizado com sucesso!</h1>
            <p>Olá, <b>${orderFull.customer_name || "cliente"}</b>!</p>
            <p>Recebemos seu pedido e ele está sendo processado. Confira os detalhes abaixo:</p>
            <h2 style='color:#b689e0;font-size:1.1rem;margin:24px 0 8px;'>Resumo do Pedido</h2>
            <p><b>Data:</b> ${new Date(orderFull.created_at).toLocaleString("pt-BR")}</p>
            <p><b>Telefone:</b> ${orderFull.customer_phone || "-"}</p>
            <p><b>Método de pagamento:</b> ${formattedPaymentMethod}${installmentsText}</p>
            <p><b>Método de entrega:</b> ${formattedShippingMethod}</p>
            ${enderecoHtml}
            <h3 style='color:#b689e0;font-size:1rem;margin:16px 0 8px;'>Produtos</h3>
            ${produtosHtml}
            <div style='margin:16px 0;'>
              <p><b>Subtotal:</b> R$ ${orderFull.subtotal?.toFixed(2).replace(".", ",")}</p>
              <p><b>Frete:</b> R$ ${orderFull.shipping_cost?.toFixed(2).replace(".", ",")}</p>
              <p><b>Desconto:</b> R$ ${orderFull.discount_amount?.toFixed(2).replace(".", ",")}</p>
              <p style='font-size:1.1rem;'><b>Total:</b> <span style='color:#6d348b;'>R$ ${orderFull.total_price?.toFixed(2).replace(".", ",")}</span></p>
            </div>
            <p style='margin-top:24px;'>Você pode acompanhar o status do pedido pelo site.</p>
            <p style='color:#b689e0;font-size:0.95rem;margin-top:32px;'>Obrigado por comprar com a Manifeste 💜</p>
          </div>
        `;

        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Manifeste <contato@manifestecg.com.br>",
          to: orderFull.customer_email,
          subject: "Confirmação do Pedido - Manifeste",
          html,
        });
      } catch (e) {
        // Não bloquear o fluxo se falhar
        console.error("Erro ao enviar e-mail para cliente:", e);
      }
    }

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

    if (coupon?.id) {
      await supabase
        .from("coupons")
        .update({ times_used: supabase.rpc("increment", { x: 1 }) })
        .eq("id", coupon.id);
    }

    await supabase.from("order_status_history").insert([
      {
        order_id: order.id,
        status: "processing",
        changed_by: customerInfo.email,
      },
    ]);

    return NextResponse.json({ orderId: order.id });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
