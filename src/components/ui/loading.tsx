export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-[#e1e1e1]" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div className="relative">
        {/* Círculo externo */}
        <div className="w-12 h-12 border-2 border-primary rounded-full"></div>
        {/* Círculo interno animado */}
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-secondary rounded-full animate-spin"></div>
      </div>
      <p className="text-neutral-700 text-sm font-medium mt-6 tracking-wide" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
        Carregando produtos...
      </p>
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 bg-[#e1e1e1]">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Skeleton da imagem */}
          <div className="w-full aspect-[4/5] bg-[#d6c7ee] mb-4 rounded-xl"></div>
          {/* Skeleton do título */}
          <div className="h-4 bg-[#d6c7ee] mb-2 rounded"></div>
          {/* Skeleton do preço */}
          <div className="h-3 bg-[#d6c7ee] w-2/3 rounded"></div>
        </div>
      ))}
    </div>
  );
}
