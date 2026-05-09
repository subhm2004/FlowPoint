import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const GoogleOAuthFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-5.5rem)] flex-col items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md rounded-2xl border bg-card/80 shadow-xl backdrop-blur">
        <CardContent className="space-y-4 pt-10 pb-10 text-center">
          <h1 className="text-xl font-semibold">Authentication failed</h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t sign you in with Google. Please try again.
          </p>
          <Button className="mt-2" onClick={() => navigate("/sign-in")}>
            Back to login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthFailure;
