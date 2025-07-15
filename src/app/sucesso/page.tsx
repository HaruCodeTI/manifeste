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
            <h1 className="text-2xl font-bold font-serif mb-2 text-foreground">
              Pedido realizado!
            </h1>
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
    <div className="min-h-screen flex items-center justify-center bg-[#ede3f6] px-4">
      <Card
        className="w-full max-w-md text-center bg-white border border-[#d4af37]/60 rounded-2xl shadow-md"
        style={{ boxShadow: "0 2px 8px 0 #d4af3720" }}
      >
        <CardContent className="pt-8 pb-8 px-8">
          <CheckCircle
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#d4af37" }}
          />
          <h1
            className="text-2xl font-bold font-serif mb-2 text-[#1a1a1a]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Pedido realizado com sucesso!
          </h1>
          <p
            className="text-[#1a1a1a] font-sans mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Seu pedido foi registrado. Guarde o código abaixo para acompanhar o
            status.
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span
              className="font-mono bg-white border border-[#d4af37]/60 px-3 py-2 rounded text-[#6d348b] text-sm select-all"
              style={{ fontFamily: "Poppins Mono, monospace" }}
            >
              {orderId}
            </span>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleCopy}
              title="Copiar código do pedido"
            >
              <Clipboard className="w-4 h-4" style={{ color: "#d4af37" }} />
            </Button>
            {copied && (
              <span className="text-xs text-[#6d348b] ml-2">Copiado!</span>
            )}
          </div>
          <Button
            asChild
            className="w-full mb-2 bg-[#6d348b] text-white font-bold rounded-[0.75rem] shadow-md hover:bg-[#4b206b] font-sans"
            style={{
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 2px 8px 0 #d4af3720",
            }}
          >
            <Link href={`/acompanhar`}>Acompanhar pedido</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full font-bold rounded-[0.75rem] font-sans"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
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
