"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  requiredRole?: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Courses", href: "/admin/courses", icon: BookOpen, requiredRole: "ADMIN" },
  { title: "Blog", href: "/admin/blog", icon: FileText, requiredRole: "EDITOR" },
  { title: "Services", href: "/admin/services", icon: Briefcase, requiredRole: "ADMIN" },
  { title: "Portfolio", href: "/admin/portfolio", icon: ImageIcon, requiredRole: "EDITOR" },
  { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, requiredRole: "EDITOR" },
  { title: "FAQ", href: "/admin/faq", icon: MessageSquare, requiredRole: "EDITOR" },
  { title: "Pricing", href: "/admin/pricing", icon: Briefcase, requiredRole: "ADMIN" },
  { title: "Careers", href: "/admin/careers", icon: Briefcase, requiredRole: "ADMIN" },
  { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, requiredRole: "ADMIN" },
  { title: "Newsletter", href: "/admin/newsletter", icon: MessageSquare, requiredRole: "EDITOR" },
  { title: "Media", href: "/admin/media", icon: ImageIcon, requiredRole: "EDITOR" },
  { title: "Users", href: "/admin/users", icon: Users, requiredRole: "SUPER_ADMIN" },
  { title: "Settings", href: "/admin/settings", icon: Settings, requiredRole: "SUPER_ADMIN" },
];

const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  USER: 1,
};

function hasRole(userRole: string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

function filterNavItems(userRole: string | undefined): NavItem[] {
  return navItems.filter(item => {
    if (!item.requiredRole) return true;
    return hasRole(userRole, item.requiredRole);
  });
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = (session.user as any)?.role;
  const filteredNavItems = filterNavItems(userRole);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Admin Console</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {(session.user as any)?.role || "User"}
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-secondary"
              )}
              onClick={() => {
                router.push(item.href);
                setMobileOpen(false);
              }}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.title}
            </Button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => window.open("/", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Site
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center space-x-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <NavContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-foreground">
              {filteredNavItems.find(item => item.href === pathname)?.title || "Dashboard"}
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {session.user?.name || session.user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  <Badge variant="secondary" className="w-fit mt-1">
                    {(session.user as any)?.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
