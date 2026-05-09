import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-provider";
import Asidebar from "@/components/asidebar/asidebar";
import Header from "@/components/header";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";
import { MarketingBackground } from "@/components/layout/marketing-background";

const AppLayout = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <MarketingBackground />
      <AuthProvider>
        <SidebarProvider className="min-h-screen">
          <Asidebar />
          <SidebarInset className="overflow-x-hidden bg-transparent">
            <div className="w-full">
              <Header />
              <div className="px-3 py-3 lg:px-20">
                <Outlet />
              </div>
              <CreateWorkspaceDialog />
              <CreateProjectDialog />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </div>
  );
};

export default AppLayout;
