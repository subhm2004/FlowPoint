import { Outlet, useLocation } from "react-router-dom";
import { MarketingBackground } from "@/components/layout/marketing-background";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AUTH_ROUTES } from "@/routes/common/routePaths";

const BaseLayout = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === AUTH_ROUTES.LANDING;

  return (
    <div className="relative min-h-screen bg-background">
      {isLanding ? (
        <div
          className="landing-dot-grid pointer-events-none fixed inset-0 -z-10"
          aria-hidden
        />
      ) : (
        <MarketingBackground />
      )}
      <MarketingHeader />
      <Outlet />
    </div>
  );
};

export default BaseLayout;
