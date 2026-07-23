"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUploader } from "@/components/shared/ImageUploader";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", slug: "", description: "", priceRange: "", icon: "", imageUrl: "", isActive: true });

  useEffect(() => { fetchService(); }, [slug]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch service");
      const service = await res.json();
      setFormData({ title: service.title, slug: service.slug, description: service.description, priceRange: service.priceRange || "", icon: service.icon || "", imageUrl: service.imageUrl || "", isActive: service.isActive });
    } catch (error) {
      console.error("Failed to fetch service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/services/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update service");
      router.push("/admin/services");
    } catch (error) {
      console.error("Failed to update service:", error);
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
          <div><h1 className="text-2xl font-bold text-foreground">Edit Service</h1><p className="text-muted-foreground mt-1">Update service details</p></div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Changes"}</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Service Details</CardTitle><CardDescription>Basic information about your service</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="slug">Slug *</Label><Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background" required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="priceRange">Price Range</Label><Input id="priceRange" value={formData.priceRange} onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="icon">Icon (lucide icon name)</Label><Input id="icon" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Service Image</Label>
              <ImageUploader
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                disabled={saving}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 rounded border border-input" />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
