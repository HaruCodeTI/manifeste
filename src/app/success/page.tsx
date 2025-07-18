"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  return (
    <div className="min-h-screen bg-[#ede3f6] flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto text-center border border-[#76d437]/40 bg-white shadow-lg font-sans">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="space-y-6">
            {/* Ícone de Sucesso */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#82e04468] rounded-full flex items-center justify-center border border-[#76d437]/40">
                <CheckCircle className="w-8 h-8 text-[#76d437]" />
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-black font-sans">
                Pedido Confirmado!
              </h1>
              <p className="text-base text-black/80 font-sans">
                Obrigado por sua compra. Seu pedido foi processado com sucesso.
              </p>
            </div>

            {/* Informações Adicionais */}
            <div className="space-y-3 text-base text-black/70 font-sans">
              <div className="flex items-center justify-center gap-2">
                <span>Você receberá um e-mail com os detalhes do pedido</span>
              </div>
              <p>
                Enviaremos atualizações sobre o status do seu pedido por e-mail.
              </p>
            </div>

            {/* Botões */}
            <div className="space-y-3 pt-4">
              <Button
                asChild
                className="w-full font-semibold border border-[#ede3f6]/60 text-black bg-white hover:bg-[#ede3f6]  shadow-sm font-sans"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2 text-[#76d437]" />
                  Voltar aos Produtos
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
