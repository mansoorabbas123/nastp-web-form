"use client";
import { useWidth } from "@/hooks/useWidth";
import {
  CircleX,
  House,
  LogOut,
  PanelLeft,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

type MenuItem = {
  name: string;
  icon: LucideIcon;
  path: string;
};

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const width = useWidth();
  const [open, setOpen] = useState(false);
  const menu: MenuItem[] = [
    {
      name: "Dashboard",
      icon: House,
      path: "/admin",
    },
    {
      name: "Students",
      icon: Users,
      path: "/admin/students",
    },
  ];

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <div className="flex h-screen">
        {/* sidebar  */}
        {width !== undefined && width > 600 && !open && <Sidebar menu={menu} />}
        {open && (
          <Sidebar menu={menu} absolute={true} handleClose={handleClose} />
        )}
        {/* Right Side Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-[#F4F6FA] shadow-sm flex items-center px-6">
            {width !== undefined && width < 600 ? (
              <div className="flex gap-4">
                <button onClick={handleOpen}>
                  <PanelLeft />
                </button>
                <h2 className="text-xl font-semibold">Dashboard</h2>
              </div>
            ) : (
              <h2 className="text-xl font-semibold">Dashboard</h2>
            )}
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <div className="bg-white rounded-xl shadow p-6">{children}</div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default AdminLayout;

const Sidebar = ({
  menu,
  absolute,
  handleClose,
}: {
  menu: MenuItem[];
  absolute?: boolean;
  handleClose?: () => void;
}) => {
  return (
    <div
      className={`bg-white h-screen border-r border-[#F4F6FA] shadow-sm max-w-72 flex flex-col ${absolute && "absolute"}`}
    >
      {absolute && (
        <button className="flex justify-end" onClick={handleClose}>
          <CircleX className="mr-3 mt-3" />
        </button>
      )}
      <div className="h-16 flex items-center px-6 border-b border-[#F4F6FA] shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
      </div>
      <nav className="p-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.path}
              key={item.name}
              className="p-2 w-full flex items-center gap-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#F4F6FA] p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        <button className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-50">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};
