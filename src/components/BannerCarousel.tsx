import Image from "next/image";
import { useEffect, useState } from "react";

const banners = [
  "/banner/new/20250722_1129_Soft Serenity Scene_simple_compose_01k0sbzcsnfa6se4f2nq0v9f5m.png",
  "/banner/new/20250722_1147_Serene Outdoor Elegance_simple_compose_01k0sczks0f8da0epgspyb0knv.png",
  "/banner/new/20250722_1202_Momento Sereno e Introspectivo_simple_compose_01k0sdvpf6e7gv24f9bn2d92jz.png",
  "/banner/new/20250722_1202_Serenidade ao Ar Livre_simple_compose_01k0sdvcasfd0tn3g46w8v3a70.png",
];

export default function BannerCarousel() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % banners.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1200,
        aspectRatio: "16/7",
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        margin: "32px auto",
        maxHeight: 420,
        height: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
          opacity: fade ? 1 : 0,
        }}
      >
        <Image
          src={banners[idx]}
          alt="Banner principal"
          fill
          style={{ objectFit: "cover", background: "#fff" }}
          priority
          sizes="100vw"
        />
      </div>
    </div>
  );
}
