"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const sessionId = searchParams.get("session_id");
  const [comChannel, setComChannel] = useState<string>("");
  const whatsNumber = "5567999587200";
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [toastMsg, setToastMsg] = useState("");
  const [finalOrderId, setFinalOrderId] = useState<string | null>(orderId);

  useEffect(() => {
    if (sessionId && !finalOrderId) {
      const fetchOrderId = async () => {
        try {
          const res = await fetch(
            `/api/orders/get-by-session?session_id=${sessionId}`
          );
          if (res.ok) {
            const data = await res.json();
            setFinalOrderId(data.orderId);
          }
        } catch (error) {
          console.error("Erro ao buscar orderId:", error);
        }
      };
      fetchOrderId();
    }
  }, [sessionId, orderId]);

  function gerarMensagemPedido() {
    let msg = `Olá! Acabei de fazer um pedido no site.\n`;
    msg += `Gostaria de acompanhar o status do meu pedido.`;
    return msg;
  }

  async function handleSendEmail() {
    setEmailStatus("sending");
    setToastMsg("");
    try {
      const res = await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: finalOrderId }),
      });
      if (!res.ok) throw new Error("Erro ao enviar e-mail");
      setEmailStatus("success");
      setToastMsg("E-mail enviado com sucesso!");
    } catch {
      setEmailStatus("error");
      setToastMsg("Erro ao enviar e-mail. Tente novamente.");
    }
  }

  if (!finalOrderId) {
    return (
      <div className="min-h-screen bg-[#ede3f6] font-[Poppins,Arial,sans-serif]">
        <Header
          onCartClick={() => {}}
          onTrackOrderClick={() => {}}
          categories={[]}
          selectedCategory={""}
          onCategoryChange={() => {}}
        />
        <main className="flex items-center justify-center flex-1 px-4 py-12">
          <Card className="w-full max-w-md text-center bg-white border-none rounded-2xl shadow-md">
            <CardContent className="pt-8 pb-8 px-8">
              <Package className="w-16 h-16 mx-auto mb-4 text-[#b689e0]" />
              <h1 className="text-2xl font-bold mb-4 text-black font-[Poppins]">
                Pedido realizado!
              </h1>
              <p className="text-gray-600 mb-6 font-[Poppins]">
                Não foi possível encontrar o código do pedido.
                <br />
                Volte para a loja e tente novamente.
              </p>
              <Button
                asChild
                className="bg-[#fe53b3] hover:bg-[#b689e0] text-white font-[Poppins]"
              >
                <Link href="/">Voltar à loja</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ede3f6] font-[Poppins,Arial,sans-serif]">
      <Header
        onCartClick={() => {}}
        onTrackOrderClick={() => {}}
        categories={[]}
        selectedCategory={""}
        onCategoryChange={() => {}}
      />
      <main className="flex items-center justify-center flex-1 px-4 py-12">
        <Card className="w-full max-w-lg text-center bg-white border-none rounded-2xl shadow-md">
          <CardContent className="pt-8 pb-8 px-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#00b85b]" />
            <h1 className="text-2xl font-bold mb-4 text-black font-[Poppins]">
              Pedido realizado com sucesso!
            </h1>
            <p className="text-gray-600 mb-8 font-[Poppins]">
              Seu pedido foi registrado e está sendo processado. Você receberá
              atualizações sobre o status da entrega.
            </p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-black font-[Poppins]">
                Como deseja receber os dados do pedido?
              </h3>
              <RadioGroup
                value={comChannel}
                onValueChange={setComChannel}
                className="flex flex-col gap-3"
              >
                <label className="flex items-center gap-3 cursor-pointer w-full p-4 rounded-lg border border-[#e1e1e1] hover:bg-[#f5f5f5] transition-colors">
                  <RadioGroupItem value="none" className="border-[#b689e0]" />
                  <span className="text-black font-[Poppins] text-left">
                    Não quero receber, vou acompanhar pelo site
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer w-full p-4 rounded-lg border border-[#e1e1e1] hover:bg-[#f5f5f5] transition-colors">
                  <RadioGroupItem value="email" className="border-[#b689e0]" />
                  <span className="text-black font-[Poppins] text-left">
                    Receber por e-mail
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer w-full p-4 rounded-lg border border-[#e1e1e1] hover:bg-[#f5f5f5] transition-colors">
                  <RadioGroupItem
                    value="whatsapp"
                    className="border-[#b689e0]"
                  />
                  <span className="text-black font-[Poppins] text-left">
                    Receber por WhatsApp
                  </span>
                </label>
              </RadioGroup>

              {comChannel === "whatsapp" && (
                <a
                  href={`https://wa.me/${whatsNumber}?text=${encodeURIComponent(gerarMensagemPedido())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block w-full"
                >
                  <Button className="w-full mt-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold font-[Poppins]">
                    Enviar pedido por WhatsApp
                  </Button>
                </a>
              )}

              {comChannel === "email" && (
                <Button
                  className="w-full mt-4 bg-[#b689e0] hover:bg-[#fe53b3] text-white font-bold font-[Poppins]"
                  onClick={handleSendEmail}
                  disabled={emailStatus === "sending"}
                >
                  {emailStatus === "sending"
                    ? "Enviando..."
                    : "Enviar pedido por e-mail"}
                </Button>
              )}

              {comChannel === "none" && (
                <div className="text-sm text-gray-600 mt-4 font-[Poppins]">
                  Você pode acompanhar seu pedido pela tela{" "}
                  <b>Acompanhar Pedido</b> no site.
                </div>
              )}
            </div>

            {toastMsg && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm font-[Poppins] ${
                  emailStatus === "success"
                    ? "bg-[#f0f8f0] text-[#00b85b]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {toastMsg}
              </div>
            )}

            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-[#fe53b3] hover:bg-[#b689e0] text-white font-bold font-[Poppins]"
              >
                <Link href="/acompanhar">Acompanhar pedido</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full font-bold font-[Poppins] border-[#b689e0] text-[#b689e0] hover:bg-[#b689e0] hover:text-white"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar à loja
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
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
