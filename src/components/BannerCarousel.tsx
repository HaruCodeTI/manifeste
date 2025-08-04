import Image from "next/image";

export default function BannerCarousel() {
  return (
    <div className="w-full">
      <div className="hidden lg:block w-full relative">
        <div
          className="w-full relative"
          style={{
            aspectRatio: "4/1",
            border: "1px solid rgba(182, 137, 224, 0.2)",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "8px 0",
          }}
        >
          <Image
            src="/banner-lg.png"
            alt="Banner principal - Desktop"
            fill
            quality={90}
            style={{
              objectFit: "cover",
              objectPosition: "center center",
            }}
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Banner para telas médias e mobile (abaixo de lg) */}
      <div className="lg:hidden w-full">
        <div
          className="w-full relative"
          style={{
            aspectRatio: "12/11",
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          <Image
            src="/banner-sm.png"
            alt="Banner principal - Mobile"
            fill
            quality={90}
            style={{
              borderRadius: 0,
              objectFit: "cover",
              objectPosition: "center center",
            }}
            sizes="(max-width: 1023px) 100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
