import { Navbar } from "@/components/layout/Navbar";

import { AppSidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "sonner"
import { BrowserRouter, Outlet } from "react-router-dom";
import { useEffect } from "react";

const AuthLayout = () => {
  return (
     <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
       
        <SidebarProvider>
    <div className="flex h-screen w-full items-center justify-center h-screen bg-gradient-to-bl from-slate-500 to-gray-900">
     <Outlet />
    </div>
    </SidebarProvider>
      </ThemeProvider>
  );
};


const MainLayout = () => {
   return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
       
        <SidebarProvider>
      <div className="flex h-screen w-full">

        {/* Sidebar */}
        <div className="w-64 border-r ">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col">

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 p-6   overflow-y-auto">
            <Outlet />
          </main>

        </div>
      </div>
    </SidebarProvider>
    </ThemeProvider>
  );
};

const SecureLayout = () => {
  useEffect(() => {

    //  Disable right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    //  Disable copy
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();

    //  Detect tab switch
    const handleVisibility = () => {
      if (document.hidden) {
        alert("Tab switching detected!");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("visibilitychange", handleVisibility);
    };

  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}

export {AuthLayout,MainLayout,SecureLayout}