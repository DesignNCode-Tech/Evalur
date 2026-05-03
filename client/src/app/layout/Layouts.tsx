import { Navbar } from "@/components/layout/Navbar";

import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
     <Outlet />
    </div>
  );
};


const MainLayout = () => {
   return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
    <SidebarProvider>
      <div className="flex h-screen w-full">

        {/* Sidebar */}
        <div className="w-64 border-r bg-white">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col">

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <Outlet />
          </main>

        </div>
      </div>
    </SidebarProvider>
    </ThemeProvider>
  );
};

const SecureLayout = () => {
  return (
    <div className="h-screen bg-black text-white flex items-center justify-center">
      <Outlet />
    </div>
  );

};

export {AuthLayout,MainLayout,SecureLayout}