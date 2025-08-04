import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const banners = [
  {
    image: "/banner/bed.png",
    link: "/produtos?categoria=primeiro-toy",
    alt: "Primeiro Toy - Banner",
  },
  {
    image: "/banner/hands.png",
    link: "/produtos?categoria=sugador",
    alt: "Sugadores - Banner",
  },
  {
    image: "/banner/test.png",
    link: "/produtos?categoria=casais",
    alt: "Para Casais - Banner",
  },
];

export function Banner() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      setIndex((prev) => {
        if (diff > 0) return prev === 0 ? banners.length - 1 : prev - 1;
        return (prev + 1) % banners.length;
      });
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="w-screen max-w-none relative overflow-hidden bg-white p-0 m-0 border-0 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]"
      style={{
        borderRadius: 0,
        marginBottom: 0,
      }}
    >
      <div
        className="absolute inset-0 w-full h-full flex transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner, i) => (
          <div
            key={banner.image}
            className="w-full h-full flex-shrink-0 p-0 m-0 relative"
            style={{ borderRadius: 0 }}
          >
            <a
              href={banner.link}
              tabIndex={0}
              style={{ display: "block", width: "100%", height: "100%" }}
            >
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                quality={100}
                style={{ objectFit: "cover", borderRadius: 0 }}
                className="w-full h-full p-0 m-0 border-0"
                priority={i === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              />
            </a>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-primary" : "bg-gray-300"
            } transition-colors cursor-pointer`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
