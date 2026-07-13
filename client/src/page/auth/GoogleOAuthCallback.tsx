import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { getCurrentUserQueryFn } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-token";
import { toast } from "@/hooks/use-toast";

/** Landing spot for the backend's redirect at the end of the Google OAuth round trip. */
const GoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  // StrictMode mounts effects twice in dev; the token must only be consumed once.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const bail = (description: string) => {
      toast({
        title: "Google sign-in failed",
        description,
        variant: "destructive",
      });
      navigate("/sign-in", { replace: true });
    };

    const error = searchParams.get("error");
    if (error) return bail(error);

    const returnUrl = searchParams.get("returnUrl");

    // The backend put the token in the fragment, not the query string, so it never
    // reached a server log on the way here.
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
    if (!token) return bail("No sign-in token was returned.");

    setAuthToken(token);
    window.history.replaceState(null, "", window.location.pathname);

    (async () => {
      try {
        const { user } = await getCurrentUserQueryFn();
        await queryClient.invalidateQueries({ queryKey: ["authUser"] });

        const isInAppPath =
          returnUrl?.startsWith("/") && !returnUrl.startsWith("//");
        navigate(
          isInAppPath ? returnUrl! : `/workspace/${user.currentWorkspace?._id}`,
          { replace: true }
        );
      } catch {
        bail("Signed in, but your profile could not be loaded.");
      }
    })();
  }, [navigate, queryClient, searchParams]);

  return (
    <div className="flex min-h-[calc(100vh-5.5rem)] flex-col items-center justify-center gap-3">
      <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Finishing Google sign-in…</p>
    </div>
  );
};

export default GoogleOAuthCallback;
