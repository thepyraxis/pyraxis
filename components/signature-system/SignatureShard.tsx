"use client";

/**
 * SignatureShard — a unit of information in transit (see
 * creative/SIGNATURE_MOTIF.md). Small, solid, no glow of its own — glow
 * belongs to the Node it's arriving at, not the shard itself. Only ever
 * rendered inside an active SignaturePath.
 */
export interface SignatureShardProps {
  orientation?: "horizontal" | "vertical";
}

export default function SignatureShard({ orientation = "horizontal" }: SignatureShardProps) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-purple-300/80 shadow-[0_0_5px_rgba(192,132,252,0.6)]"
      style={{
        animation:
          orientation === "horizontal"
            ? "signature-shard-travel-x 900ms ease-out infinite"
            : "signature-shard-travel-y 900ms ease-out infinite",
      }}
    />
  );
}
