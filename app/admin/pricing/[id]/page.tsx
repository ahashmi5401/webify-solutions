"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";

export default function EditPricingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", billingCycle: "", features: "", isPopular: false, order: 0 });

  useEffect(() => { fetchPlan(); }, [id]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/pricing/${id}`);
      if (!res.ok) throw new Error("Failed to fetch pricing plan");
      const plan = await res.json();
      setFormData({ name: plan.name, price: plan.price.toString(), billingCycle: plan.billingCycle, features: plan.features.join("\n"), isPopular: plan.isPopular, order: plan.order });
    } catch (error) {
      console.error("Failed to fetch pricing plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price) || 0, features: formData.features.split("\n").map(f => f.trim()).filter(f => f) }),
      });
      if (!res.ok) throw new Error("Failed to update pricing plan");
      router.push("/admin/pricing");
    } catch (error) {
      console.error("Failed to update pricing plan:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="space-y-6"><div className="h-8 w-32 bg-muted animate-pulse rounded" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <div><h1 className="text-2xl font-bold text-foreground">Edit Pricing Plan</h1><p className="text-muted-foreground mt-1">Update pricing details</p></div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Plan Details</CardTitle><CardDescription>Pricing information and features</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="price">Price ($) *</Label><Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="billingCycle">Billing Cycle *</Label><Input id="billingCycle" value={formData.billingCycle} onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="features">Features (one per line)</Label><textarea id="features" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background" required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="order">Order</Label><Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center space-x-2 pt-4">
                <input type="checkbox" id="isPopular" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })} className="h-4 w-4 rounded border border-input" />
                <Label htmlFor="isPopular" className="cursor-pointer">Mark as Popular</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
