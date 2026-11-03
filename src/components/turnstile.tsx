"use client";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: string;
      size: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}
export function SecurityCheck({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (value: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const render = useCallback(() => {
    if (!container.current || !window.turnstile || widget.current !== undefined)
      return;
    try {
      widget.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action: "travel-enquiry",
        theme: "light",
        size: "flexible",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => {
          onToken("");
          setError(true);
        },
      });
    } catch {
      setError(true);
    }
  }, [siteKey, onToken]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      if (widget.current !== undefined) {
        window.turnstile?.remove(widget.current);
        widget.current = undefined;
      }
    };
  }, [render]);
  return (
    <div className="security-check">
      <Script
        id="turnstile-loader"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={render}
        onError={() => setError(true)}
      />
      <div ref={container} />
      {error && (
        <p role="alert">
          The security check could not load. Please use the email option below.
        </p>
      )}
    </div>
  );
}
