"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreVertical, Edit, Trash2, Search, Power, PowerOff } from "lucide-react";

interface CareerListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export default function CareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<CareerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; career: CareerListing | null }>({ open: false, career: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchCareers(); }, []);

  const fetchCareers = async () => {
    try {
      const res = await fetch("/api/careers");
      if (!res.ok) throw new Error("Failed to fetch career listings");
      const data = await res.json();
      setCareers(data || []);
    } catch (error) {
      console.error("Failed to fetch career listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.career) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/careers/${deleteDialog.career.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete career listing");
      setCareers(careers.filter(c => c.id !== deleteDialog.career?.id));
      setDeleteDialog({ open: false, career: null });
    } catch (error) {
      console.error("Failed to delete career listing:", error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredCareers = careers.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.department.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Career Listings</h1><p className="text-muted-foreground mt-1">Manage job openings</p></div>
        <Button onClick={() => router.push("/admin/careers/new")}><Plus className="h-4 w-4 mr-2" />New Listing</Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCareers.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{searchQuery ? "No listings found" : "No career listings yet"}</TableCell></TableRow>
              ) : (
                filteredCareers.map((career) => (
                  <TableRow key={career.id}>
                    <TableCell className="font-medium">{career.title}</TableCell>
                    <TableCell>{career.department}</TableCell>
                    <TableCell>{career.location}</TableCell>
                    <TableCell><Badge variant="outline">{career.type}</Badge></TableCell>
                    <TableCell><Badge variant={career.isActive ? "default" : "secondary"}>{career.isActive ? <Power className="h-3 w-3 mr-1" /> : <PowerOff className="h-3 w-3 mr-1" />}{career.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/careers/${career.id}`)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, career })} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, career: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Career Listing</DialogTitle><DialogDescription>Are you sure you want to delete "{deleteDialog.career?.title}"?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, career: null })} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
