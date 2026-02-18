"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Megaphone,
  Settings,
  MessageCircle,
  Link as LinkIcon,
  CreditCard,
  Star,
  Menu,
  X,
  LogOut,
  Users,
  Activity,
} from "lucide-react";
import { Toaster } from "sonner";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/admin/login";
    } else {
      setIsAuthenticated(true);
      // Extract role from token (format: userId:role:timestamp)
      const parts = token.split(":");
      if (parts.length >= 2) {
        setUserRole(parts[1]);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  // All available nav items
  const allNavItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      roles: ["OWNER", "ADMIN"],
    },
    {
      name: "Produtos",
      icon: Package,
      href: "/admin/products",
      roles: ["OWNER", "ADMIN"],
    },
    {
      name: "Pedidos",
      icon: ShoppingBag,
      href: "/admin/pedidos",
      roles: ["OWNER", "ADMIN"],
    },
    {
      name: "Avaliações",
      icon: Star,
      href: "/admin/avaliacoes",
      roles: ["OWNER", "ADMIN"],
    },
    {
      name: "Marketing",
      icon: Megaphone,
      href: "/admin/marketing",
      roles: ["OWNER", "ADMIN"],
    },
    {
      name: "Aparência",
      icon: Settings,
      href: "/admin/aparencia",
      roles: ["OWNER"],
    }, // OWNER only
    {
      name: "Integrações",
      icon: LinkIcon,
      href: "/admin/integracoes",
      roles: ["OWNER"],
    }, // OWNER only
    {
      name: "Pagamento",
      icon: CreditCard,
      href: "/admin/configgate",
      roles: ["OWNER"],
    }, // OWNER only
    {
      name: "Gerenciar Equipe",
      icon: Users,
      href: "/admin/equipe",
      roles: ["OWNER"],
    }, // OWNER only
    {
      name: "Logs do Sistema",
      icon: Activity,
      href: "/admin/logs",
      roles: ["OWNER"],
    }, // OWNER only
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#F3F3F3]">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tighter">Admin Panel</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-all group"
              >
                <item.icon
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-medium text-sm">{item.name}</span>
              </a>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 lg:px-12 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">
                {userRole === "OWNER" ? "Owner Manager" : "Admin Manager"}
              </p>
              <p className="text-[10px] text-gray-400">
                {userRole === "OWNER" ? "Master access" : "Limited access"}
              </p>
            </div>
            <div className="w-10 h-10 bg-black rounded-full" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12">{children}</main>
      </div>
    </div>
  );
}
