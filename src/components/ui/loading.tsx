export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative">
        {/* Círculo externo */}
        <div className="w-12 h-12 border-2 border-neutral-200 rounded-full"></div>
        {/* Círculo interno animado */}
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
      </div>
      <p className="text-neutral-500 text-sm font-medium mt-6 tracking-wide">
        Carregando produtos...
      </p>
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Skeleton da imagem */}
          <div className="w-full aspect-[4/5] bg-[#e0d7f3] mb-4"></div>
          {/* Skeleton do título */}
          <div className="h-4 bg-[#e0d7f3] mb-2"></div>
          {/* Skeleton do preço */}
          <div className="h-3 bg-[#e0d7f3] w-2/3"></div>
        </div>
      ))}
    </div>
  );
}
