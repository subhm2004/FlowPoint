import { Loader, LogIn, Sparkles, UserPlus, UsersRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlowPilotLogo } from "@/components/brand/flowpilot-logo";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import useAuth from "@/hooks/api/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitedUserJoinWorkspaceMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const InviteUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const param = useParams();
  const inviteCode = param.inviteCode as string;

  const { data: authData, isPending } = useAuth();
  const user = authData?.user;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
  });

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutate(inviteCode, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ["userWorkspaces"],
        });
        navigate(`/workspace/${data.workspaceId}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5.5rem)] flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80 dark:opacity-40"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-500/20" />
        <div className="absolute -right-1/4 bottom-0 h-[380px] w-[380px] rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/15" />
      </div>

      <div className="flex w-full max-w-lg flex-col gap-8">
        <Card
          className={cn(
            "relative overflow-hidden rounded-3xl border border-black/[0.06] bg-card/90 shadow-2xl backdrop-blur-xl",
            "dark:border-white/[0.08] dark:bg-zinc-950/80 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]"
          )}
        >
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-500"
            aria-hidden
          />
          <CardHeader className="space-y-6 pb-2 pt-10 text-center sm:px-10">
            <div className="mx-auto flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-md dark:border-white/10 dark:bg-zinc-900">
                <FlowPilotLogo className="h-10 w-10 rounded-xl" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                Workspace invite
              </span>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-balance text-2xl font-bold tracking-tight sm:text-[1.65rem]">
                You&apos;re invited to a{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                  FlowPilot
                </span>{" "}
                workspace
              </CardTitle>
              <CardDescription className="mx-auto max-w-sm text-base leading-relaxed text-muted-foreground">
                {user ? (
                  <>
                    Signed in as{" "}
                    <span className="font-medium text-foreground">
                      {user.email}
                    </span>
                    . Accept the invite below to jump in with your team.
                  </>
                ) : (
                  <>
                    Sign in or create an account to accept this invite and
                    start collaborating.
                  </>
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-10 sm:px-10">
            {isPending ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <Loader className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm text-muted-foreground">Checking your account…</p>
              </div>
            ) : (
              <div className="space-y-6">
                {user ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className={cn(
                        "h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-emerald-500/25",
                        "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500",
                        "dark:shadow-emerald-900/40"
                      )}
                    >
                      {isLoading ? (
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <UsersRound className="mr-2 h-5 w-5" />
                      )}
                      Join the workspace
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      You&apos;ll be added as a member with the role chosen by
                      the inviter.
                    </p>
                  </form>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      to={`/sign-in?returnUrl=${returnUrl}`}
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className={cn(
                          "h-12 w-full rounded-xl border-2 text-base font-semibold",
                          "border-black/[0.08] bg-background/80 hover:bg-muted/80",
                          "dark:border-white/15 dark:hover:bg-white/5"
                        )}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </Button>
                    </Link>
                    <Link
                      to={`/sign-up?returnUrl=${returnUrl}`}
                      className="block w-full"
                    >
                      <Button
                        size="lg"
                        className={cn(
                          "h-12 w-full rounded-xl text-base font-semibold shadow-md",
                          "bg-foreground text-background hover:bg-foreground/90",
                          "dark:bg-foreground dark:text-background"
                        )}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Not you? Close this tab or use <span className="font-medium text-foreground">Home</span>{" "}
          in the header.
        </p>
      </div>
    </div>
  );
};

export default InviteUser;
