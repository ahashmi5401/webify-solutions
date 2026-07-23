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
import { Plus, MoreVertical, Edit, Trash2, Search, ArrowUp, ArrowDown } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  createdAt: string;
}

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; faq: FAQ | null }>({ open: false, faq: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchFAQs(); }, []);

  const fetchFAQs = async () => {
    try {
      const res = await fetch("/api/faq");
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      const data = await res.json();
      setFaqs(data || []);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.faq) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/faq/${deleteDialog.faq.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete FAQ");
      setFaqs(faqs.filter(f => f.id !== deleteDialog.faq?.id));
      setDeleteDialog({ open: false, faq: null });
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const updatedFaqs = [...faqs];
    if (direction === "up" && index > 0) {
      [updatedFaqs[index], updatedFaqs[index - 1]] = [updatedFaqs[index - 1], updatedFaqs[index]];
    } else if (direction === "down" && index < updatedFaqs.length - 1) {
      [updatedFaqs[index], updatedFaqs[index + 1]] = [updatedFaqs[index + 1], updatedFaqs[index]];
    }
    setFaqs(updatedFaqs.map((f, i) => ({ ...f, order: i })));
  };

  const filteredFAQs = faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">FAQ</h1><p className="text-muted-foreground mt-1">Manage frequently asked questions</p></div>
        <Button onClick={() => router.push("/admin/faq/new")}><Plus className="h-4 w-4 mr-2" />New FAQ</Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search FAQs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFAQs.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{searchQuery ? "No FAQs found" : "No FAQs yet"}</TableCell></TableRow>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline">#{faq.order + 1}</Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, "up")} disabled={index === 0}><ArrowUp className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, "down")} disabled={index === filteredFAQs.length - 1}><ArrowDown className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{faq.question}</TableCell>
                    <TableCell>{faq.category || <Badge variant="outline">General</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/faq/${faq.id}`)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, faq })} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, faq: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete FAQ</DialogTitle><DialogDescription>Are you sure you want to delete this FAQ?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, faq: null })} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
