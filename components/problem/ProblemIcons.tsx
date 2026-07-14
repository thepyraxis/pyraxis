import Image from "next/image";

const SYMPTOMS = [
  { icon: "/icons/missed-leads.webp", title: "Missed Leads", caption: "Inquiries go unanswered." },
  { icon: "/icons/lost-bookings.webp", title: "Lost Bookings", caption: "Potential customers book elsewhere." },
  { icon: "/icons/no-follow-up.webp", title: "No Follow-Up", caption: "Leads go cold without nurture." },
  { icon: "/icons/weak-retention.webp", title: "Weak Retention", caption: "Customers don't come back." },
];

export default function ProblemIcons() {
  return (
    <div
      data-reveal
      className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:gap-x-8"
    >
      {SYMPTOMS.map((item) => (
        <div
          key={item.title}
          className="flex flex-col items-center rounded-xl border border-border/60 bg-card/40 px-4 py-8 text-center"
        >
          <div className="relative flex aspect-square w-full max-w-[160px] items-center justify-center">
            {/*
              A neutral radial shadow lived here for "depth" — removed:
              black-on-near-black (rgba(0,0,0,0.25) over #08080f/#020205)
              contributed ~0 perceptible depth, so it was dead paint work
              with no visible effect. Per MASTER_MOTION_BIBLE, this section
              still earns no light/glow of any kind, so nothing replaces it.
            */}
            <Image
              src={item.icon}
              alt={item.title}
              width={160}
              height={160}
              className="relative aspect-square w-full object-contain"
            />
          </div>
          <h3 className="mt-5 font-display text-lg font-semibold text-ink-100">{item.title}</h3>
          <p className="mt-2 max-w-[160px] font-display text-[15px] leading-relaxed text-ink-300">
            {item.caption}
          </p>
          <span aria-hidden="true" className="mt-4 h-px w-8 bg-purple-500/50" />
        </div>
      ))}
    </div>
  );
}
