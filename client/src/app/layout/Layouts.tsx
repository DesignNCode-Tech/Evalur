import { Outlet } from 'react-router-dom';

// Used for Login / Register pages
export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 w-full flex items-center justify-center">
      <Outlet /> 
    </div>
  );
};

// Used for Dashboard, Profile, etc.
export const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Placeholder Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-4 font-bold text-xl">Evalur.ai</div>
      </aside>
      
      <div className="flex-1 flex flex-col">
        {/* Placeholder Navbar */}
        <header className="h-16 bg-white border-b flex items-center px-6">
          <span>Navbar</span>
        </header>
        
        {/* The specific page (Dashboard/Settings) will render here */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Used for Assesment Area
export const SecureLayout = () => {
  return (
    <div className="min-h-screen bg-black-800 w-full">
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};