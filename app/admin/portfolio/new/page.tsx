"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", slug: "", description: "", techUsed: "", resultsSummary: "", clientTestimonial: "", isPublished: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, techUsed: formData.techUsed.split(",").map(t => t.trim()).filter(t => t) }),
      });
      if (!res.ok) throw new Error("Failed to create portfolio item");
      const item = await res.json();
      router.push(`/admin/portfolio/${item.slug}`);
    } catch (error) {
      console.error("Failed to create portfolio item:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <div><h1 className="text-2xl font-bold text-foreground">New Portfolio Project</h1><p className="text-muted-foreground mt-1">Add a new project to your portfolio</p></div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Project"}</Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Project Details</CardTitle><CardDescription>Information about your portfolio project</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="slug">Slug *</Label><Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background" required /></div>
            <div className="space-y-2"><Label htmlFor="techUsed">Tech Stack (comma-separated)</Label><Input id="techUsed" value={formData.techUsed} onChange={(e) => setFormData({ ...formData, techUsed: e.target.value })} placeholder="React, Next.js, TypeScript" /></div>
            <div className="space-y-2"><Label htmlFor="resultsSummary">Results Summary</Label><textarea id="resultsSummary" value={formData.resultsSummary} onChange={(e) => setFormData({ ...formData, resultsSummary: e.target.value })} className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background" /></div>
            <div className="space-y-2"><Label htmlFor="clientTestimonial">Client Testimonial</Label><textarea id="clientTestimonial" value={formData.clientTestimonial} onChange={(e) => setFormData({ ...formData, clientTestimonial: e.target.value })} className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background" /></div>
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
