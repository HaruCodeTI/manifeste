"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clipboard, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SuccessPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [copied, setCopied] = useState(false);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 px-8">
            <Package className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold mb-2">Pedido realizado!</h1>
            <p className="text-muted-foreground mb-6">
              Não foi possível encontrar o código do pedido.
              <br />
              Volte para a loja e tente novamente.
            </p>
            <Button asChild>
              <Link href="/">Voltar à loja</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8 px-8">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold mb-2">
            Pedido realizado com sucesso!
          </h1>
          <p className="text-muted-foreground mb-6">
            Seu pedido foi registrado. Guarde o código abaixo para acompanhar o
            status.
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-mono bg-muted px-3 py-2 rounded text-primary text-sm select-all">
              {orderId}
            </span>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleCopy}
              title="Copiar código do pedido"
            >
              <Clipboard className="w-4 h-4" />
            </Button>
            {copied && (
              <span className="text-xs text-green-500 ml-2">Copiado!</span>
            )}
          </div>
          <Button asChild className="w-full mb-2">
            <Link href={`/acompanhar`}>Acompanhar pedido</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Voltar à loja</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessPageInner />
    </Suspense>
  );
}
