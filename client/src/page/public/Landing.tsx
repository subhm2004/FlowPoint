import { FlowPilotLogo } from "@/components/brand/flowpilot-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Github,
  Globe2,
  Layers3,
  MessageCircleMore,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/theme-toggle";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const testimonialsRowOne: Testimonial[] = [
  {
    quote:
      "FlowPilot cut our stand-up noise in half. Everyone sees the same priorities without chasing updates in chat.",
    name: "Ananya Sharma",
    role: "Engineering Lead, Bharat Tech",
  },
  {
    quote:
      "We onboarded two squads in a day. Workspaces and roles made ownership obvious from week one.",
    name: "Rohan Das",
    role: "Ops Manager, BlueDart Partner",
  },
  {
    quote:
      "Finally one place for projects and tasks. Our agency clients get clarity without extra tooling.",
    name: "Kirito Gupta",
    role: "CEO, Kirito Labs",
  },
  {
    quote:
      "The dashboard gives leadership an honest picture of delivery — no spreadsheet archaeology.",
    name: "Pooja Varma",
    role: "Managing Director, Varma Textiles",
  },
];

const testimonialsRowTwo: Testimonial[] = [
  {
    quote:
      "Permissions are sane. Admins move fast and members stay focused — exactly what we needed.",
    name: "Farhan Siddiqui",
    role: "Marketing Director, Mumbai Digital Hub",
  },
  {
    quote:
      "Task flow is smooth for remote teams. Updates feel instant and nobody misses ownership.",
    name: "Sana Sheikh",
    role: "Sales Manager, Pune Realty Group",
  },
  {
    quote:
      "We replaced three tools with FlowPilot. Less context switching, more shipping.",
    name: "Hassan Ali",
    role: "E-commerce Lead, Delhi Retailers",
  },
  {
    quote:
      "Clean UI, fast setup. Our interns were productive on day one.",
    name: "B. N. Reddy",
    role: "Supply Chain Head, Hyderabad Steel",
  },
];

function TestimonialMarquee({
  items,
  reverse,
}: {
  items: Testimonial[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden py-1">
      <div
        className={cn(
          "flex w-max gap-5 md:gap-6",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {loop.map((t, i) => (
          <article
            key={`${t.name}-${i}`}
            className="flex w-[min(100vw-2.5rem,22rem)] shrink-0 flex-col rounded-2xl border border-border/50 bg-card/95 px-6 py-6 shadow-md ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/15 sm:w-[min(100vw-3rem,26rem)] md:rounded-3xl md:px-7 md:py-7 dark:ring-white/[0.06] dark:hover:ring-primary/25"
          >
            <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-4 border-t border-border/50 pt-5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/25 to-cyan-500/25 text-sm font-bold text-foreground ring-2 ring-background md:h-12 md:w-12"
                aria-hidden
              >
                {initials(t.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold md:text-base">{t.name}</p>
                <p className="truncate text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function HeroProductPreview() {
  const rows = [
    { title: "API rollout v2", meta: "Engineering · Due Fri", status: "In progress", tone: "violet" as const },
    { title: "Q2 roadmap review", meta: "Leadership · Done", status: "Done", tone: "emerald" as const },
    { title: "Design system audit", meta: "Design · Next week", status: "Todo", tone: "amber" as const },
  ];

  const toneStyles = {
    violet: "bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200",
    emerald: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
    amber: "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100",
  };

  return (
    <div className="animate-hero-float relative mx-auto w-full max-w-lg lg:mx-0">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-tr from-violet-500/25 via-fuchsia-500/10 to-cyan-500/20 opacity-90 blur-3xl dark:from-violet-500/20 dark:via-fuchsia-500/5 dark:to-cyan-500/15"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[0_25px_60px_-15px_hsl(var(--foreground)/0.18)] ring-1 ring-black/[0.04] backdrop-blur-sm dark:bg-zinc-900/90 dark:ring-white/[0.06] md:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/40 px-4 py-3.5 md:px-5">
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
        </div>
        <div className="flex gap-0 p-4 md:p-5">
          <div
            className="hidden w-20 shrink-0 flex-col gap-2.5 border-r border-border/50 pr-4 sm:flex md:w-24"
            aria-hidden
          >
            <div className="h-2 w-full rounded-full bg-primary/80" />
            <div className="h-2 w-[80%] rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-[60%] rounded-full bg-muted-foreground/15" />
            <div className="mt-4 h-2 w-full rounded-full bg-muted-foreground/15" />
            <div className="h-2 w-[66%] rounded-full bg-muted-foreground/12" />
          </div>
          <div className="min-w-0 flex-1 space-y-3 sm:pl-5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Active tasks
              </p>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                3 projects
              </span>
            </div>
            {rows.map((row) => (
              <div
                key={row.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/70 px-3 py-3 shadow-sm dark:bg-zinc-950/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{row.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{row.meta}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                    toneStyles[row.tone]
                  )}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const showcaseFeatures = [
  {
    label: "Collaboration",
    labelClass: "text-amber-600 dark:text-amber-400",
    title: "Real-time team alignment.",
    description:
      "Comments, mentions, and task updates stream so everyone stays on the same page without meetings overload.",
    gradient:
      "from-amber-500/30 via-amber-500/[0.06] to-transparent dark:from-amber-500/15 dark:via-transparent",
  },
  {
    label: "Design",
    labelClass: "text-violet-600 dark:text-violet-400",
    title: "Plan without boundaries.",
    description:
      "Workspaces, projects, and epics scale with your team — from one squad to the whole org.",
    gradient:
      "from-violet-500/30 via-violet-500/[0.06] to-transparent dark:from-violet-500/15 dark:via-transparent",
  },
  {
    label: "Execution",
    labelClass: "text-emerald-600 dark:text-emerald-400",
    title: "Ship with clear ownership.",
    description:
      "Assign, prioritize, and track tasks so deadlines are visible and accountability is obvious.",
    gradient:
      "from-emerald-500/30 via-emerald-500/[0.06] to-transparent dark:from-emerald-500/15 dark:via-transparent",
  },
  {
    label: "Insight",
    labelClass: "text-pink-600 dark:text-pink-400",
    title: "One dashboard for delivery health.",
    description:
      "Analytics and status views help leaders see progress without digging through tools.",
    gradient:
      "from-pink-500/30 via-pink-500/[0.06] to-transparent dark:from-pink-500/15 dark:via-transparent",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create your workspace",
    description:
      "Spin up a home for your team in seconds. Name it, set the tone, and you are ready to invite people.",
  },
  {
    step: "02",
    title: "Add projects & tasks",
    description:
      "Break work into projects and actionable tasks. Assign owners, dates, and priorities so nothing slips.",
  },
  {
    step: "03",
    title: "Align and ship",
    description:
      "Everyone sees the same board. Updates stay in context — fewer meetings, faster decisions, clearer delivery.",
  },
] as const;

const faqs = [
  {
    question: "What is FlowPilot?",
    answer:
      "FlowPilot is a workspace-first project and task platform for teams who want clarity, roles, and fast execution in one place.",
  },
  {
    question: "Do I need to sign up to use FlowPilot?",
    answer:
      "Yes. Create an account to get your workspace, invite teammates, and start managing projects and tasks.",
  },
  {
    question: "How does collaboration work?",
    answer:
      "Team members share a workspace, see projects and tasks, and update status in real time with session-based access.",
  },
  {
    question: "Can multiple people work on tasks at the same time?",
    answer:
      "Yes. Multiple members can update tasks, assignments, and project details; permissions control who can change what.",
  },
  {
    question: "Is FlowPilot free to try?",
    answer:
      "You can start with a free account and explore core workspace, project, and task features.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No installation required. FlowPilot runs in your browser on desktop and mobile.",
  },
  {
    question: "Can I invite people to my workspace?",
    answer:
      "Yes. Invite members by email and assign roles so the right people have the right access.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Sessions use secure cookies; store credentials safely and use HTTPS in production for end-to-end protection.",
  },
  {
    question: "Who is FlowPilot best for?",
    answer:
      "Agencies, startups, and product teams that want a simple, powerful alternative to scattered docs and chat threads.",
  },
  {
    question: "Does FlowPilot support Google sign-in?",
    answer:
      "Google OAuth can be enabled when you configure client credentials in your environment.",
  },
];

const Landing = () => {
  const [faqQuery, setFaqQuery] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerEmailSent, setFooterEmailSent] = useState(false);

  const filteredFaqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [faqQuery]);

  return (
    <div className="text-foreground">
      <main className="mx-auto w-full max-w-7xl px-5 pb-10 pt-1 md:px-8 md:pb-20 lg:px-10">
        {/* Hero — split layout + product preview */}
        <section className="relative overflow-hidden px-1 pt-2 md:pt-6 lg:pt-8">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[min(100%,56rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/12 via-fuchsia-500/5 to-transparent blur-3xl dark:from-violet-500/10 dark:via-transparent"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.02fr] lg:items-center lg:gap-14 xl:gap-16">
            <div className="relative px-3 sm:px-6 lg:px-2">
              <div
                className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm dark:bg-zinc-900/80"
                style={{ animationDelay: "0s" }}
              >
                <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden />
                <span>Workspace-first project delivery</span>
              </div>

              <h1
                className="animate-fade-up mt-6 text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.05] lg:text-[3.25rem] xl:text-[3.5rem]"
                style={{ animationDelay: "0.05s" }}
              >
                <span className="block text-balance">
                  Build faster
                  <br />
                  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400">
                    with FlowPilot
                  </span>
                </span>
              </h1>

              <p
                className="animate-fade-up mt-5 max-w-xl text-base font-medium leading-relaxed text-muted-foreground md:mt-6 md:text-lg"
                style={{ animationDelay: "0.1s" }}
              >
                One command center for workspaces, projects, and tasks — so your team always knows what ships
                next, who owns it, and how delivery is trending.
              </p>

              <div
                className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                style={{ animationDelay: "0.15s" }}
              >
                <Link to="/sign-up" className="inline-flex">
                  <Button
                    size="lg"
                    className={cn(
                      "h-12 w-full rounded-2xl border-0 px-8 text-[15px] font-bold sm:w-auto sm:min-w-[10rem] md:h-14 md:px-10 md:text-base",
                      "bg-foreground text-background shadow-md",
                      "transition-all duration-200 hover:bg-foreground/90 hover:shadow-lg active:scale-[0.98]",
                      "group"
                    )}
                  >
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                  <a
                    href="#how-it-works"
                    className="inline-flex w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className={cn(
                        "h-12 w-full rounded-2xl border-border/80 bg-background/80 px-8 text-[15px] font-semibold shadow-sm backdrop-blur-sm md:h-14",
                        "hover:bg-muted/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80"
                      )}
                    >
                      How it works
                    </Button>
                  </a>
                  <a
                    href="https://github.com/subhm2004/FlowPoint"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className={cn(
                        "h-12 w-full rounded-2xl border border-black/12 bg-white px-8 text-[15px] font-semibold gap-2 shadow-sm md:h-14",
                        "transition-all duration-200 hover:bg-neutral-50 hover:shadow-md active:scale-[0.98]",
                        "dark:border-white/12 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      )}
                    >
                      <Github className="h-[1.1rem] w-[1.1rem] md:h-5 md:w-5" />
                      Star on GitHub
                    </Button>
                  </a>
                </div>
              </div>

              <div
                className="animate-fade-up mt-10 grid grid-cols-2 gap-4 border-t border-border/60 pt-8 sm:grid-cols-4 md:mt-11 md:gap-6"
                style={{ animationDelay: "0.2s" }}
              >
                {[
                  { k: "100+", v: "Teams onboarded" },
                  { k: "One", v: "Source of truth" },
                  { k: "Roles", v: "Built-in permissions" },
                  { k: "Zero", v: "Install required" },
                ].map((s) => (
                  <div key={s.v} className="text-left">
                    <p className="text-xl font-extrabold tracking-tight text-foreground md:text-2xl">{s.k}</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative px-2 sm:px-4 lg:px-0">
              <HeroProductPreview />
            </div>
          </div>
        </section>

        {/* Features — theme-aware cards (light / dark) */}
        <section
          id="features"
          className="landing-features-glow relative mt-14 scroll-mt-28 rounded-3xl border border-border/40 py-12 shadow-sm md:mt-16 md:py-16"
        >
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              Platform
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:mt-4 md:text-5xl lg:text-[2.75rem]">
              Everything you need to run delivery
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-medium leading-relaxed text-muted-foreground md:mt-5 md:max-w-3xl md:text-xl">
              Workspaces, roles, projects, and tasks on one calm surface — fewer tools, clearer ownership, faster
              shipping.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {showcaseFeatures.map((f) => (
              <article
                key={f.label}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border p-7 shadow-lg ring-1 ring-black/[0.04] md:p-8",
                  "border-border/70 bg-gradient-to-b from-card via-card to-muted/25",
                  "transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-xl hover:ring-primary/10",
                  "dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-2xl dark:ring-white/[0.06]",
                  "dark:hover:border-white/20 dark:hover:shadow-2xl dark:hover:shadow-violet-500/10 dark:hover:ring-primary/20"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100 dark:opacity-90",
                    f.gradient
                  )}
                />
                <div className="relative">
                  <p className={cn("text-xs font-bold tracking-[0.2em] md:text-[13px]", f.labelClass)}>
                    {f.label.toUpperCase()}
                  </p>
                  <h3 className="mt-4 text-xl font-bold leading-snug text-foreground md:text-[1.35rem]">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                    {f.description}
                  </p>
                  <div className="mt-9 flex items-end justify-between border-t border-border/80 pt-5 dark:border-white/10">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-pink-500 dark:bg-pink-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      live
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Discover */}
        <section id="discover" className="mt-16 scroll-mt-28 text-center md:mt-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Discover
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:mt-4 md:text-5xl lg:text-[2.75rem]">
            Deliver at the speed of clarity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-medium leading-relaxed text-muted-foreground md:mt-5 md:max-w-3xl md:text-xl">
            Replace scattered docs and noisy threads with one workspace your whole team actually checks.
          </p>
          <div className="mt-10 grid gap-5 text-left md:grid-cols-3 md:gap-6">
            <article className="group rounded-3xl border border-border/60 bg-card/90 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg md:p-8">
              <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/15">
                <MessageCircleMore className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold md:text-xl">Collaborate instantly</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Discuss blockers and progress in one shared view — fewer meetings, faster decisions.
              </p>
            </article>
            <article className="group rounded-3xl border border-border/60 bg-card/90 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg md:p-8">
              <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/15">
                <Layers3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold md:text-xl">Structure your work</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                From workspace to project to task — hierarchy that matches how teams actually work.
              </p>
            </article>
            <article className="group rounded-3xl border border-border/60 bg-card/90 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg md:p-8">
              <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/15">
                <Globe2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold md:text-xl">Work from anywhere</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Browser-based, always available — distributed teams stay aligned around the same source of truth.
              </p>
            </article>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="relative mt-16 scroll-mt-28 md:mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-card via-card to-muted/30 px-6 py-12 shadow-lg dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 md:px-12 md:py-16">
            <div
              className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15"
              aria-hidden
            />
            <div className="relative text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                How it works
              </p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:mt-4 md:text-5xl lg:text-[2.75rem]">
                From empty workspace to aligned team
              </h2>
              <p className="mx-auto mt-4 max-w-2xl font-medium text-muted-foreground md:mt-5 md:text-lg">
                Three simple moves — no playbook required.
              </p>
            </div>
            <div className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
              {howItWorks.map((item) => (
                <article
                  key={item.step}
                  className="group relative rounded-2xl border border-border/60 bg-background/70 p-7 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md md:rounded-3xl md:p-8 dark:bg-zinc-950/50"
                >
                  <span className="inline-flex rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 px-3 py-1.5 font-mono text-sm font-bold text-violet-700 dark:text-violet-300">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight md:text-[1.35rem]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
            <div className="relative mt-10 flex justify-center">
              <Link to="/sign-up">
                <Button
                  size="lg"
                  className="rounded-full px-8 font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start your workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mt-16 scroll-mt-28 md:mt-20">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full border border-border/80 bg-muted/40 px-5 py-2 text-sm font-bold uppercase tracking-wider text-muted-foreground shadow-sm backdrop-blur">
              Testimonials
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:mt-6 md:text-5xl">
              What our 100+ users say
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium text-muted-foreground md:mt-4 md:text-lg">
              See what teams say about shipping faster with FlowPilot.
            </p>
          </div>
          <div className="relative mt-10 space-y-5 md:mt-12">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-20"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-20"
              aria-hidden
            />
            <TestimonialMarquee items={testimonialsRowOne} />
            <TestimonialMarquee items={testimonialsRowTwo} reverse />
          </div>
        </section>

        {/* FAQ — light, soft accent (readable in light & dark) */}
        <section
          id="faq"
          className="relative mt-16 scroll-mt-28 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-500/[0.07] via-card/95 to-cyan-500/[0.08] px-6 py-12 shadow-[0_20px_60px_-24px_hsl(var(--foreground)/0.12)] md:mt-20 md:px-12 md:py-16 dark:from-violet-500/10 dark:via-card/90 dark:to-cyan-500/10"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-500/10"
            aria-hidden
          />
          <div className="relative">
            <div className="flex flex-col gap-8 border-b border-border/50 pb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                  FAQs
                </h2>
                <p className="mt-3 text-base font-medium text-muted-foreground md:mt-4 md:text-lg">
                  Get all your questions answered about FlowPilot.
                </p>
              </div>
              <div className="w-full md:max-w-md">
                <Input
                  type="search"
                  placeholder="Search questions..."
                  value={faqQuery}
                  onChange={(e) => setFaqQuery(e.target.value)}
                  className="h-12 rounded-full border-border/80 bg-background/90 pl-5 text-base shadow-sm backdrop-blur placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-violet-500/35 md:h-14 md:pl-6"
                />
              </div>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
              {filteredFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-violet-500/25 hover:shadow-md open:border-violet-500/30 open:bg-card open:shadow-md md:rounded-3xl md:p-6 dark:bg-background/60 dark:hover:border-violet-400/30"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden md:text-[17px]">
                    <span className="flex gap-4">
                      <span className="inline-flex h-8 min-w-[2.25rem] items-center justify-center rounded-lg bg-violet-500/10 font-mono text-sm font-semibold text-violet-700 dark:text-violet-300">
                        {String(faqs.indexOf(faq) + 1).padStart(2, "0")}
                      </span>
                      <span className="pt-0.5 leading-snug">{faq.question}</span>
                    </span>
                    <Plus className="mt-1 h-5 w-5 shrink-0 rounded-md bg-muted/80 p-0.5 text-violet-600 transition-transform group-open:rotate-45 dark:text-violet-400" />
                  </summary>
                  <p className="mt-4 border-t border-border/60 pt-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
            {filteredFaqs.length === 0 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                No questions match your search.
              </p>
            )}
          </div>
        </section>

        {/* About + CTA */}
        <section
          id="about"
          className="mt-16 scroll-mt-28 rounded-3xl border border-border/60 bg-gradient-to-br from-card/90 via-card/70 to-muted/30 px-7 py-12 shadow-[0_20px_50px_-24px_hsl(var(--foreground)/0.15)] backdrop-blur-md md:mt-20 md:px-14 md:py-16"
        >
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center md:gap-12">
            <div className="max-w-2xl">
              <p className="text-base font-semibold text-muted-foreground">About FlowPilot</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Take control of your delivery journey
                <br />
                <span className="text-foreground">Start shipping together — instantly</span>
              </h2>
              <p className="mt-5 text-base font-medium leading-relaxed text-muted-foreground md:mt-6 md:text-lg">
                Spin up a workspace in minutes, invite your team with clear roles, and move from planning to
                execution without tool overload. No heavy setup — just structured work that scales with you.
              </p>
            </div>
            <Link to="/sign-up" className="shrink-0">
              <Button
                size="lg"
                className="rounded-full px-12 py-7 text-lg font-bold shadow-xl shadow-violet-500/20 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl hover:shadow-violet-500/25 active:scale-[0.98] md:px-14"
              >
                Get started now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 md:gap-10 md:px-8 md:py-16 lg:px-10">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-foreground/90">
              Stay Connected
            </h3>
            <p className="mt-3 text-base text-muted-foreground">
              Collaborate on exciting projects with FlowPilot.
            </p>
            <form
              className="relative mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!footerEmail.trim()) return;
                setFooterEmailSent(true);
                setFooterEmail("");
              }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={footerEmail}
                onChange={(e) => {
                  setFooterEmail(e.target.value);
                  setFooterEmailSent(false);
                }}
                className="h-12 rounded-full border-2 border-border/80 bg-background/80 pr-14 text-base shadow-inner transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30 md:h-14"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1.5 h-10 w-10 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 md:right-2 md:top-2 md:h-11 md:w-11"
                aria-label="Subscribe to updates"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </form>
            {footerEmailSent && (
              <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400" role="status">
                Thanks — we will share product updates here.
              </p>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-foreground/90">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3 text-base font-medium">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#discover"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Discover
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-foreground/90">
              Contact
            </h3>
            <p className="mt-3 text-base text-muted-foreground">
              Email:{" "}
              <a
                href="mailto:subhu04012003@gmail.com"
                className="text-foreground underline-offset-4 hover:underline"
              >
                subhu04012003@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-foreground/90">
              Follow
            </h3>
            <div className="mt-4 flex flex-col gap-5">
              <a
                href="https://github.com/subhm2004/FlowPoint"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-background/50 shadow-sm transition-all hover:scale-105 hover:border-foreground/20 hover:bg-muted hover:shadow-md"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <div className="flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-4 py-2.5 shadow-sm">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:px-8">
            <p>© {new Date().getFullYear()} FlowPilot. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-5 text-base text-foreground">
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
              <a href="#" className="hover:underline">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
