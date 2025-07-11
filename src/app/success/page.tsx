"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, Package } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto text-center border-border/50 bg-card/50">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="space-y-6">
            {/* Ícone de Sucesso */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-sans text-foreground">
                Pedido Confirmado!
              </h1>
              <p className="text-muted-foreground text-sm">
                Obrigado por sua compra. Seu pedido foi processado com sucesso.
              </p>
            </div>

            {/* Informações Adicionais */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                <span>Você receberá um e-mail com os detalhes do pedido</span>
              </div>
              <p>
                Enviaremos atualizações sobre o status do seu pedido por e-mail.
              </p>
            </div>

            {/* Botões */}
            <div className="space-y-3 pt-4">
              <Button asChild className="w-full font-semibold">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
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
