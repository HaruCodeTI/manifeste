"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toast } from "@/components/ui/toast";
import { CheckCircle, Clipboard, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SuccessPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [copied, setCopied] = useState(false);
  const [comChannel, setComChannel] = useState<string>("");
  const whatsNumber = "5567999587200";
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [toastMsg, setToastMsg] = useState("");

  function gerarMensagemPedido() {
    let msg = `Olá! Acabei de fazer um pedido no site.\n`;
    msg += `Meu código de pedido é: ${orderId}`;
    return msg;
  }

  async function handleSendEmail() {
    setEmailStatus("sending");
    setToastMsg("");
    try {
      const res = await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error("Erro ao enviar e-mail");
      setEmailStatus("success");
      setToastMsg("E-mail enviado com sucesso!");
    } catch {
      setEmailStatus("error");
      setToastMsg("Erro ao enviar e-mail. Tente novamente.");
    }
  }

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

          <div className="mb-6">
            <Label className="text-black font-medium font-sans mb-2 block">
              Como deseja receber os dados do pedido?
            </Label>
            <RadioGroup
              value={comChannel}
              onChange={(e) =>
                setComChannel((e.target as HTMLInputElement).value)
              }
              className="flex flex-col gap-2 items-start justify-center mx-auto max-w-xs"
            >
              <label className="flex items-center gap-2 cursor-pointer w-full p-2 rounded-lg border border-[#b689e0]/30 hover:bg-[#f4eae6] transition">
                <RadioGroupItem
                  value="none"
                  checked={comChannel === "none"}
                  onChange={() => setComChannel("none")}
                  className="border border-muted rounded-full"
                />
                <span className="text-foreground">
                  Não quero receber, vou acompanhar pelo site
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer w-full p-2 rounded-lg border border-[#b689e0]/30 hover:bg-[#f4eae6] transition">
                <RadioGroupItem
                  value="email"
                  checked={comChannel === "email"}
                  onChange={() => setComChannel("email")}
                  className="border border-muted rounded-full"
                />
                <span className="text-foreground">Receber por e-mail</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer w-full p-2 rounded-lg border border-[#b689e0]/30 hover:bg-[#f4eae6] transition">
                <RadioGroupItem
                  value="whatsapp"
                  checked={comChannel === "whatsapp"}
                  onChange={() => setComChannel("whatsapp")}
                  className="border border-muted rounded-full"
                />
                <span className="text-foreground">Receber por WhatsApp</span>
              </label>
            </RadioGroup>
            {comChannel === "whatsapp" && (
              <a
                href={`https://wa.me/${whatsNumber}?text=${encodeURIComponent(gerarMensagemPedido())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block w-full"
              >
                <Button className="w-full mt-2 bg-[#25D366] text-white font-bold">
                  Enviar pedido por WhatsApp
                </Button>
              </a>
            )}
            {comChannel === "email" && (
              <Button
                className="w-full mt-2 bg-[#b689e0] text-white font-bold"
                onClick={handleSendEmail}
                disabled={emailStatus === "sending"}
              >
                {emailStatus === "sending"
                  ? "Enviando..."
                  : "Enviar pedido por e-mail"}
              </Button>
            )}
            {comChannel === "none" && (
              <div className="text-sm text-muted-foreground mt-2">
                Você pode acompanhar seu pedido pela tela{" "}
                <b>Acompanhar Pedido</b> no site.
              </div>
            )}
          </div>
          <Toast
            message={toastMsg}
            isVisible={!!toastMsg}
            onClose={() => setToastMsg("")}
          />

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
