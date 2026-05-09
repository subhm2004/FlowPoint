import { MarketingBackground } from "@/components/layout/marketing-background";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <MarketingBackground />
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border bg-card/80 p-8 text-center shadow-xl backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or was moved.
          </p>
          <Link to="/">
            <Button className="mt-6">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
