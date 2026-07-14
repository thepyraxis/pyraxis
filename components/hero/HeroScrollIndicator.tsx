export default function HeroScrollIndicator() {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      <span className="flex h-9 w-6 justify-center rounded-full border border-ink-600/50 p-1.5">
        <span className="h-1.5 w-px animate-[scrollDot_1.8s_ease-in-out_infinite] rounded-full bg-purple-400 motion-reduce:animate-none" />
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400">Scroll</span>
    </div>
  );
}
