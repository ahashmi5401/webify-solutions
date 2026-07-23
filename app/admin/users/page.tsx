"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Shield, ShieldAlert, User, Search } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  userType: string;
  createdAt: string;
}

const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  USER: 1,
};

const roleIcons: Record<string, React.ElementType> = {
  SUPER_ADMIN: ShieldAlert,
  ADMIN: Shield,
  EDITOR: User,
  USER: User,
};

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleDialog, setRoleDialog] = useState<{ open: boolean; user: User | null; newRole: string }>({ open: false, user: null, newRole: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const userRole = (session?.user as any)?.role;
    if (userRole !== "SUPER_ADMIN") {
      router.push("/admin");
      return;
    }
    fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!roleDialog.user || !roleDialog.newRole) return;
    
    const currentUserRole = (session?.user as any)?.role;
    const targetUserRole = ROLE_HIERARCHY[roleDialog.newRole];
    const userRoleLevel = ROLE_HIERARCHY[currentUserRole];

    if (targetUserRole >= userRoleLevel) {
      alert("You cannot assign a role equal to or higher than your own.");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/${roleDialog.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleDialog.newRole }),
      });
      if (!res.ok) throw new Error("Failed to update user role");
      
      setUsers(users.map(u => u.id === roleDialog.user?.id ? { ...u, role: roleDialog.newRole } : u));
      setRoleDialog({ open: false, user: null, newRole: "" });
    } catch (error) {
      console.error("Failed to update user role:", error);
    } finally {
      setUpdating(false);
    }
  };

  const canChangeRole = (targetUserId: string, targetRole: string) => {
    const currentUserRole = (session?.user as any)?.role;
    const currentUserRoleLevel = ROLE_HIERARCHY[currentUserRole];
    const targetRoleLevel = ROLE_HIERARCHY[targetRole];
    
    if (targetUserId === (session?.user as any)?.id) return false;
    return targetRoleLevel < currentUserRoleLevel;
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Users</h1><p className="text-muted-foreground mt-1">Manage user accounts and roles (SUPER_ADMIN only)</p></div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{searchQuery ? "No users found" : "No users yet"}</TableCell></TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const RoleIcon = roleIcons[user.role] || User;
                  const isCurrentUser = user.id === session?.user?.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "SUPER_ADMIN" ? "default" : user.role === "ADMIN" ? "secondary" : "outline"}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell><Badge variant="outline">{user.userType}</Badge></TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {isCurrentUser ? (
                          <Badge variant="outline">You</Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRoleDialog({ open: true, user, newRole: user.role })}
                            disabled={user.role === "SUPER_ADMIN" || user.role === "ADMIN"}
                          >
                            Change Role
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={roleDialog.open} onOpenChange={(open) => setRoleDialog({ open, user: null, newRole: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change role for "{roleDialog.user?.name || roleDialog.user?.email}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">New Role</p>
              <Select value={roleDialog.newRole} onValueChange={(value: string) => setRoleDialog({ ...roleDialog, newRole: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              You cannot assign a role equal to or higher than your own ({(session?.user as any)?.role}).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialog({ open: false, user: null, newRole: "" })} disabled={updating}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={updating || !roleDialog.newRole}>
              {updating ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
