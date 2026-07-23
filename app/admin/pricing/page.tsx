"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreVertical, Edit, Trash2, Star, ArrowUp, ArrowDown } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  isPopular: boolean;
  order: number;
  createdAt: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; plan: PricingPlan | null }>({ open: false, plan: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing plans");
      const data = await res.json();
      setPlans(data || []);
    } catch (error) {
      console.error("Failed to fetch pricing plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.plan) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pricing/${deleteDialog.plan.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete pricing plan");
      setPlans(plans.filter(p => p.id !== deleteDialog.plan?.id));
      setDeleteDialog({ open: false, plan: null });
    } catch (error) {
      console.error("Failed to delete pricing plan:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const updatedPlans = [...plans];
    if (direction === "up" && index > 0) {
      [updatedPlans[index], updatedPlans[index - 1]] = [updatedPlans[index - 1], updatedPlans[index]];
    } else if (direction === "down" && index < updatedPlans.length - 1) {
      [updatedPlans[index], updatedPlans[index + 1]] = [updatedPlans[index + 1], updatedPlans[index]];
    }
    setPlans(updatedPlans.map((p, i) => ({ ...p, order: i })));
  };

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Pricing Plans</h1><p className="text-muted-foreground mt-1">Manage your pricing tiers</p></div>
        <Button onClick={() => router.push("/admin/pricing/new")}><Plus className="h-4 w-4 mr-2" />New Plan</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pricing plans yet</TableCell></TableRow>
              ) : (
                plans.map((plan, index) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline">#{plan.order + 1}</Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, "up")} disabled={index === 0}><ArrowUp className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleMove(index, "down")} disabled={index === plans.length - 1}><ArrowDown className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {plan.name}
                      {plan.isPopular && <Badge className="ml-2" variant="default"><Star className="h-3 w-3 mr-1" />Popular</Badge>}
                    </TableCell>
                    <TableCell>${Number(plan.price).toFixed(2)}</TableCell>
                    <TableCell>{plan.billingCycle}</TableCell>
                    <TableCell><div className="flex flex-wrap gap-1">{plan.features.slice(0, 2).map((f, i) => <Badge key={i} variant="outline" className="text-xs">{f}</Badge>)}{plan.features.length > 2 && <Badge variant="outline" className="text-xs">+{plan.features.length - 2}</Badge>}</div></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/pricing/${plan.id}`)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, plan })} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, plan: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Pricing Plan</DialogTitle><DialogDescription>Are you sure you want to delete "{deleteDialog.plan?.name}"?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, plan: null })} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
