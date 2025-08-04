import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;
    if (!code) {
      return NextResponse.json(
        { error: "Código do cupom não informado" },
        { status: 400 }
      );
    }
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .single();
    if (error || !coupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      );
    }
    // Validade
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });
    }
    // Limite de uso
    if (
      coupon.usage_limit !== null &&
      coupon.times_used >= coupon.usage_limit
    ) {
      return NextResponse.json(
        { error: "Limite de uso do cupom atingido" },
        { status: 400 }
      );
    }
    // Status (opcional: se tiver campo ativo/desativado)
    // if (coupon.status && coupon.status !== 'active') {
    //   return NextResponse.json({ error: "Cupom inativo" }, { status: 400 });
    // }
    return NextResponse.json({ coupon });
  } catch {
    return NextResponse.json(
      { error: "Erro ao validar cupom" },
      { status: 500 }
    );
  }
}
