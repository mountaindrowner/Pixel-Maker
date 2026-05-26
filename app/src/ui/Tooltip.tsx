import { type ReactNode } from "react";

export function Tip({ tip, children }: { tip: string; children: ReactNode }) {
  return (
    <span title={tip} style={{ display: "inline-flex" }}>
      {children}
    </span>
  );
}
