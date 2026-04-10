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
    <div className="flex">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
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