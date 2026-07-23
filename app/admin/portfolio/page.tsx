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

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  techUsed: string[];
  isPublished: boolean;
  createdAt: string;
}

export default function PortfolioPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: PortfolioItem | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/portfolio?includeUnpublished=true");
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      const data = await res.json();
      setItems(data || []);
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.item) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/portfolio/${deleteDialog.item.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete portfolio item");
      setItems(items.filter(i => i.id !== deleteDialog.item?.id));
      setDeleteDialog({ open: false, item: null });
    } catch (error) {
      console.error("Failed to delete portfolio item:", error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Portfolio</h1><p className="text-muted-foreground mt-1">Manage your portfolio projects</p></div>
        <Button onClick={() => router.push("/admin/portfolio/new")}><Plus className="h-4 w-4 mr-2" />New Project</Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{searchQuery ? "No projects found" : "No portfolio items yet"}</TableCell></TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell><div className="flex flex-wrap gap-1">{item.techUsed.slice(0, 3).map((t, i) => <Badge key={i} variant="outline" className="text-xs">{t}</Badge>)}{item.techUsed.length > 3 && <Badge variant="outline" className="text-xs">+{item.techUsed.length - 3}</Badge>}</div></TableCell>
                    <TableCell><Badge variant={item.isPublished ? "default" : "secondary"}>{item.isPublished ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}{item.isPublished ? "Published" : "Draft"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/portfolio/${item.slug}`)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, item })} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, item: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Project</DialogTitle><DialogDescription>Are you sure you want to delete "{deleteDialog.item?.title}"?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null })} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
