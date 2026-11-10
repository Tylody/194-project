"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { GlobalTheme, Theme } from "@carbon/react";

const QUERY = "(prefers-color-scheme: dark)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Follows the OS color scheme: Carbon "white" theme in light mode, "g100" in dark. */
export default function AppTheme({ children }: { children: ReactNode }) {
  const dark = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const theme = dark ? "g100" : "white";
  return (
    <GlobalTheme theme={theme}>
      <Theme theme={theme} className="min-h-screen">
        {children}
      </Theme>
    </GlobalTheme>
  );
}
