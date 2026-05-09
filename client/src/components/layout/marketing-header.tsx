import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { AUTH_ROUTES } from "@/routes/common/routePaths";
import { FlowPilotLogo } from "@/components/brand/flowpilot-logo";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const landingLinks = [
  { href: "#features", label: "Features" },
  { href: "#discover", label: "Discover" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQs" },
  { href: "#about", label: "About Us" },
] as const;

export function MarketingHeader() {
  const { pathname } = useLocation();

  const isLanding = pathname === AUTH_ROUTES.LANDING;
  const isSignIn = pathname === AUTH_ROUTES.SIGN_IN;
  const isSignUp = pathname === AUTH_ROUTES.SIGN_UP;
  const isInvite = pathname.startsWith("/invite/");
  const isGoogleOAuth = pathname === AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK;

  if (isLanding) {
    return (
      <div className="sticky top-3 z-50 flex justify-center px-4 pb-1.5 md:top-4">
        <header
          className={cn(
            "flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-black/[0.06] bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-xl",
            "dark:border-white/[0.08] dark:bg-zinc-950/85 dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]",
            "md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 md:px-6"
          )}
        >
          <div className="flex min-w-0 items-center gap-2 md:justify-self-start md:gap-3">
            <ThemeToggle className="h-10 w-10 shrink-0 rounded-xl border border-black/[0.08] bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900 md:h-11 md:w-11" />
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2 hover:opacity-90"
              aria-label="FlowPilot home"
            >
              <FlowPilotLogo className="h-9 w-9 md:h-10 md:w-10" />
              <span className="truncate text-[17px] font-bold tracking-tight text-foreground md:text-xl">
                FlowPilot
              </span>
            </Link>
          </div>
          <nav className="hidden items-center gap-1 text-[15px] font-semibold text-foreground md:flex md:justify-self-center md:gap-1 lg:gap-1.5">
            {landingLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06] lg:px-4"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2 md:justify-self-end md:gap-2.5">
            <Link to={AUTH_ROUTES.SIGN_IN}>
              <Button
                variant="secondary"
                className={cn(
                  "h-10 rounded-full border border-black/[0.08] px-3 text-[14px] font-semibold shadow-sm sm:px-4 sm:text-[15px] md:h-11 md:px-5",
                  "bg-neutral-200/90 text-foreground hover:bg-neutral-300/95",
                  "dark:border-white/12 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                )}
              >
                Sign in
              </Button>
            </Link>
            <Link to={AUTH_ROUTES.SIGN_UP}>
              <Button
                className={cn(
                  "h-10 rounded-full px-6 text-[15px] font-bold shadow-none md:h-11 md:px-7",
                  "bg-foreground text-background hover:bg-foreground/90",
                  "dark:bg-foreground dark:text-background"
                )}
              >
                Sign up
              </Button>
            </Link>
          </div>
        </header>
      </div>
    );
  }

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6">
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight"
      >
        <FlowPilotLogo className="h-8 w-8" />
        FlowPilot
      </Link>
      <div className="hidden flex-1 md:block" aria-hidden />
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        {isSignIn && (
          <Link to="/sign-up">
            <Button variant="outline" size="sm">
              Create account
            </Button>
          </Link>
        )}
        {isSignUp && (
          <Link to="/sign-in">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
        )}
        {(isInvite || isGoogleOAuth) && (
          <Link to="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
