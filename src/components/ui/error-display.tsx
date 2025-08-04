import { ERROR_MESSAGES } from "@/hooks/useErrorHandler";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "./button";

interface ErrorDisplayProps {
  error: {
    hasError: boolean;
    message: string;
    code?: string;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className = "",
}: ErrorDisplayProps) {
  if (!error.hasError) return null;

  const getErrorMessage = (code?: string) => {
    if (code && ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES]) {
      return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
    }
    return error.message || "Ocorreu um erro inesperado";
  };

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{getErrorMessage(error.code)}</p>
        </div>
        <div className="ml-3 flex-shrink-0 flex">
          {onDismiss && (
            <button
              type="button"
              className="bg-red-50 rounded-md inline-flex text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onDismiss}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      {onRetry && (
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente para erros de carregamento
export function LoadingError({
  error,
  onRetry,
}: {
  error: { hasError: boolean; message: string };
  onRetry?: () => void;
}) {
  if (!error.hasError) return null;

  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erro ao carregar
        </h3>
        <p className="text-sm text-gray-500 mb-4">{error.message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente para erros de formulário
export function FormError({
  error,
  onDismiss,
}: {
  error: { hasError: boolean; message: string };
  onDismiss?: () => void;
}) {
  if (!error.hasError) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex bg-red-50 rounded-md text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onDismiss}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
