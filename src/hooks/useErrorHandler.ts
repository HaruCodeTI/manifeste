import { useCallback, useState } from "react";

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ErrorHandler {
  error: ErrorState;
  setError: (error: Partial<ErrorState>) => void;
  clearError: () => void;
  handleAsync: <T>(asyncFn: () => Promise<T>) => Promise<T | null>;
}

export function useErrorHandler(): ErrorHandler {
  const [error, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: "",
  });

  const setError = useCallback((errorData: Partial<ErrorState>) => {
    setErrorState({
      hasError: true,
      message: errorData.message || "Ocorreu um erro inesperado",
      code: errorData.code,
      details: errorData.details,
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      message: "",
    });
  }, []);

  const handleAsync = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
      try {
        clearError();
        return await asyncFn();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        const errorCode = (err as { code?: string })?.code || "UNKNOWN_ERROR";

        setError({
          message: errorMessage,
          code: errorCode,
          details: err,
        });

        console.error("Error caught by useErrorHandler:", err);
        return null;
      }
    },
    [setError, clearError]
  );

  return {
    error,
    setError,
    clearError,
    handleAsync,
  };
}

// Tipos de erro comuns
export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

// Mensagens de erro amigáveis
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]:
    "Problema de conexão. Verifique sua internet e tente novamente.",
  [ERROR_CODES.AUTHENTICATION_ERROR]: "Sessão expirada. Faça login novamente.",
  [ERROR_CODES.AUTHORIZATION_ERROR]:
    "Você não tem permissão para realizar esta ação.",
  [ERROR_CODES.VALIDATION_ERROR]:
    "Dados inválidos. Verifique as informações e tente novamente.",
  [ERROR_CODES.NOT_FOUND]: "Recurso não encontrado.",
  [ERROR_CODES.SERVER_ERROR]:
    "Erro no servidor. Tente novamente em alguns minutos.",
  [ERROR_CODES.TIMEOUT_ERROR]: "Tempo limite excedido. Tente novamente.",
  [ERROR_CODES.UNKNOWN_ERROR]: "Ocorreu um erro inesperado. Tente novamente.",
} as const;

// Função para mapear erros HTTP para códigos de erro
export function mapHttpErrorToCode(status: number): string {
  switch (status) {
    case 400:
      return ERROR_CODES.VALIDATION_ERROR;
    case 401:
      return ERROR_CODES.AUTHENTICATION_ERROR;
    case 403:
      return ERROR_CODES.AUTHORIZATION_ERROR;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    case 408:
    case 504:
      return ERROR_CODES.TIMEOUT_ERROR;
    case 500:
    case 502:
    case 503:
      return ERROR_CODES.SERVER_ERROR;
    default:
      return ERROR_CODES.UNKNOWN_ERROR;
  }
}
