"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", company: "", message: "", avatarUrl: "", isPublished: false });

  useEffect(() => { fetchTestimonial(); }, [id]);

  const fetchTestimonial = async () => {
    try {
      const res = await fetch(`/api/testimonials/${id}`);
      if (!res.ok) throw new Error("Failed to fetch testimonial");
      const t = await res.json();
      setFormData({ name: t.name, role: t.role, company: t.company || "", message: t.message, avatarUrl: t.avatarUrl || "", isPublished: t.isPublished });
    } catch (error) {
      console.error("Failed to fetch testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update testimonial");
      router.push("/admin/testimonials");
    } catch (error) {
      console.error("Failed to update testimonial:", error);
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
          <div><h1 className="text-2xl font-bold text-foreground">Edit Testimonial</h1><p className="text-muted-foreground mt-1">Update testimonial details</p></div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Testimonial Details</CardTitle><CardDescription>Information about the testimonial</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="role">Role *</Label><Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="message">Message *</Label><textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background" required /></div>
            <div className="space-y-2"><Label htmlFor="avatarUrl">Avatar URL</Label><Input id="avatarUrl" value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} /></div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="h-4 w-4 rounded border border-input" />
              <Label htmlFor="isPublished" className="cursor-pointer">Published</Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
