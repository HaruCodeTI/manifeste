type GtagFn = (event: string, ...params: unknown[]) => void;

export function gtagEvent(event: string, params: Record<string, unknown>) {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { gtag?: GtagFn }).gtag
  ) {
    (window as unknown as { gtag: GtagFn }).gtag("event", event, params);
  }
}
