export function LoadingSpinner() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 bg-[#e1e1e1]"
      style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
    >
      <div className="relative">
        {/* Círculo externo */}
        <div className="w-12 h-12 border-2 border-primary rounded-full"></div>
        {/* Círculo interno animado */}
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-secondary rounded-full animate-spin"></div>
      </div>
      <p
        className="text-neutral-700 text-sm font-medium mt-6 tracking-wide"
        style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
      >
        Carregando produtos...
      </p>
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-[480px] bg-white rounded-[2.5rem] shadow-xl border border-[#ececec] p-0 overflow-hidden">
            {/* Skeleton da imagem */}
            <div className="w-full h-64 flex items-center justify-center pt-6 pb-2 px-4">
              <div className="w-48 h-48 bg-[#d6c7ee] rounded-2xl"></div>
            </div>
            {/* Skeleton do conteúdo */}
            <div className="px-4 flex flex-col items-center">
              {/* Skeleton do título */}
              <div className="h-6 bg-[#d6c7ee] mb-2 rounded w-3/4"></div>
              {/* Skeleton do preço */}
              <div className="h-8 bg-[#d6c7ee] mb-2 rounded w-1/2"></div>
              {/* Skeleton do texto secundário */}
              <div className="h-4 bg-[#d6c7ee] rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
