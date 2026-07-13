import { useEffect, useState } from "react";
import { FlowPilotLogo } from "@/components/brand/flowpilot-logo";
import { cn } from "@/lib/utils";

type Card = {
  id: string;
  title: string;
  code: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  who: string;
};

const PRIORITY: Record<Card["priority"], string> = {
  URGENT: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  LOW: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const AVATAR = [
  "bg-violet-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
];

const COLUMNS = [
  { key: "todo", label: "To Do", dot: "bg-blue-500" },
  { key: "doing", label: "In Progress", dot: "bg-amber-500" },
  { key: "done", label: "Done", dot: "bg-emerald-500" },
] as const;

const BASE: Record<string, Card[]> = {
  todo: [
    { id: "t1", title: "Design system audit", code: "task-118", priority: "MEDIUM", who: "AS" },
    { id: "t2", title: "Billing edge cases", code: "task-124", priority: "LOW", who: "RD" },
  ],
  doing: [
    { id: "t3", title: "API rollout v2", code: "task-092", priority: "HIGH", who: "KG" },
  ],
  done: [
    { id: "t4", title: "Q2 roadmap review", code: "task-081", priority: "MEDIUM", who: "PV" },
  ],
};

// The card that walks the pipeline on a loop, so the hero shows the board *doing* something.
const TRAVELLER: Card = {
  id: "t0",
  title: "Onboarding flow",
  code: "task-131",
  priority: "URGENT",
  who: "SM",
};

const ORDER = ["todo", "doing", "done"] as const;

const MiniCard = ({ card, landing }: { card: Card; landing?: boolean }) => (
  <div
    className={cn(
      "rounded-lg border bg-background/90 p-2.5 shadow-sm transition-all duration-500 dark:bg-zinc-950/70",
      landing && "border-violet-500/40 shadow-md ring-2 ring-violet-500/20"
    )}
  >
    <p className="truncate text-[11px] font-semibold leading-tight text-foreground">
      {card.title}
    </p>
    <div className="mt-2 flex items-center justify-between gap-2">
      <span
        className={cn(
          "rounded border px-1 py-px text-[8px] font-bold uppercase tracking-wide",
          PRIORITY[card.priority]
        )}
      >
        {card.priority.toLowerCase()}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[8px] text-muted-foreground/70">
          {card.code}
        </span>
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full text-[7px] font-bold text-white",
            AVATAR[card.who.charCodeAt(0) % AVATAR.length]
          )}
        >
          {card.who}
        </span>
      </div>
    </div>
  </div>
);

export function HeroBoardPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setStep((s) => (s + 1) % ORDER.length), 2600);
    return () => clearInterval(timer);
  }, []);

  const travellerColumn = ORDER[step];

  return (
    <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:mx-0 lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-tr from-violet-500/25 via-fuchsia-500/10 to-cyan-500/20 opacity-90 blur-3xl dark:from-violet-500/20 dark:via-fuchsia-500/5 dark:to-cyan-500/15"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[0_25px_60px_-15px_hsl(var(--foreground)/0.18)] ring-1 ring-black/[0.04] backdrop-blur-sm dark:bg-zinc-900/90 dark:ring-white/[0.06] md:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/40 px-4 py-3 md:px-5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <FlowPilotLogo className="h-6 w-6 rounded-md" />
            <span className="truncate text-xs font-semibold text-muted-foreground md:text-[13px]">
              FlowPilot / Product workspace
            </span>
          </div>
          <span className="hidden shrink-0 rounded-md bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-sm sm:inline">
            Board
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 p-3 md:gap-3 md:p-4">
          {COLUMNS.map((col) => {
            const cards = BASE[col.key] ?? [];
            const hasTraveller = travellerColumn === col.key;

            return (
              <div
                key={col.key}
                className={cn(
                  "flex flex-col rounded-xl border bg-muted/40 p-2 transition-colors duration-500",
                  hasTraveller && "border-violet-500/30 bg-violet-500/[0.06]"
                )}
              >
                <div className="mb-2 flex items-center justify-between px-0.5">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", col.dot)} />
                    <span className="truncate text-[10px] font-bold text-foreground">
                      {col.label}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full bg-background px-1.5 text-[9px] font-semibold text-muted-foreground">
                    {cards.length + (hasTraveller ? 1 : 0)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {hasTraveller && <MiniCard card={TRAVELLER} landing />}
                  {cards.map((card) => (
                    <MiniCard key={card.id} card={card} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroBoardPreview;
