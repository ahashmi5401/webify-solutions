"use client";

import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="py-12">
      <Container className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">User Dashboard</CardTitle>
                <CardDescription>
                  Welcome back, {session?.user?.name || session?.user?.email || "User"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your user dashboard is currently being built. You have successfully authenticated and passed route protection checks.
            </p>
            <div className="p-4 rounded-md bg-muted/60 text-xs font-mono border border-border">
              <p>Email: {session?.user?.email}</p>
              <p>Role: {(session?.user as any)?.role || "USER"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
