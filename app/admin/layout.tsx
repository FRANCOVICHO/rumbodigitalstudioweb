"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard, FolderOpen, Briefcase, CreditCard,
  HelpCircle, Mail, Palette, LogOut, Menu,
  Home, MessageSquare, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "Hero", icon: Home },
  { href: "/admin/projects", label: "Portfolio", icon: FolderOpen },
  { href: "/admin/services", label: "Servicios", icon: Briefcase },
  { href: "/admin/plans", label: "Planes", icon: CreditCard },
  { href: "/admin/testimonials", label: "Testimonios", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/messages", label: "Mensajes", icon: MessageSquare },
  { href: "/admin/contact", label: "Contacto", icon: Mail },
  { href: "/admin/appearance", label: "Apariencia", icon: Palette },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show layout on login page
  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-zinc-950 border-r border-white/10 w-64">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
          Rumbo Admin
        </h1>
        <p className="text-xs text-foreground-subtle mt-1">Panel de administración</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/admin";
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "text-foreground-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground-muted hover:text-white hover:bg-white/5 transition-all"
        >
          <Home className="w-4 h-4" />
          Ver sitio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/10">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold bg-gradient-primary bg-clip-text text-transparent">Rumbo Admin</h1>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 text-foreground-muted">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
