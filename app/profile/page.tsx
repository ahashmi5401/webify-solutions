"use client";

import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, LogOut, Shield } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="py-12">
      <Container className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">My Profile</CardTitle>
                <CardDescription>
                  Manage your account settings and information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-md bg-muted/60 border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{session?.user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 rounded-md bg-muted/60 border border-border">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{session?.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-md bg-muted/60 border border-border">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <Badge variant="secondary" className="mt-1">
                      {(session?.user as any)?.role || "USER"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account is currently active. Additional profile management features will be available soon.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
