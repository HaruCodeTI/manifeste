import Image from "next/image";
import { useEffect, useState } from "react";

const banners = [
  "/banner/new/20250722_1436_Manhã Tranquila_simple_compose_01k0spmd6gft6s8c2cjea8ce3m.png",
  "/banner/new/20250722_1437_Serene Sunlit Elegance_simple_compose_01k0sppekrf3z8y7w25mbmvjrh.png",
  "/banner/new/20250722_1440_Sensual Serenity Outdoors_simple_compose_01k0spxfwbezd8nqf6svgh6x93.png",
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
        aspectRatio: "16/9",
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        margin: "32px auto",
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
          layout="responsive"
          width={1200}
          height={675} // proporção 16:9
          style={{
            borderRadius: 12,
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      </div>
    </div>
  );
}
