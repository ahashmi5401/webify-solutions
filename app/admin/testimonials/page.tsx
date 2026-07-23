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
import { Plus, MoreVertical, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  message: string;
  avatarUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; testimonial: Testimonial | null }>({ open: false, testimonial: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials?includeUnpublished=true");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const data = await res.json();
      setTestimonials(data || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.testimonial) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${deleteDialog.testimonial.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete testimonial");
      setTestimonials(testimonials.filter(t => t.id !== deleteDialog.testimonial?.id));
      setDeleteDialog({ open: false, testimonial: null });
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredTestimonials = testimonials.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Testimonials</h1><p className="text-muted-foreground mt-1">Manage client testimonials</p></div>
        <Button onClick={() => router.push("/admin/testimonials/new")}><Plus className="h-4 w-4 mr-2" />New Testimonial</Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search testimonials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestimonials.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{searchQuery ? "No testimonials found" : "No testimonials yet"}</TableCell></TableRow>
              ) : (
                filteredTestimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.role}</TableCell>
                    <TableCell>{t.company || "-"}</TableCell>
                    <TableCell><Badge variant={t.isPublished ? "default" : "secondary"}>{t.isPublished ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}{t.isPublished ? "Published" : "Draft"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/testimonials/${t.id}`)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, testimonial: t })} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, testimonial: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Testimonial</DialogTitle><DialogDescription>Are you sure you want to delete testimonial from "{deleteDialog.testimonial?.name}"?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, testimonial: null })} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
