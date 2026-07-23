"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

export default function EditCareerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", department: "", location: "", type: "FULL_TIME", description: "", isActive: true });

  useEffect(() => { fetchCareer(); }, [id]);

  const fetchCareer = async () => {
    try {
      const res = await fetch(`/api/careers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch career listing");
      const career = await res.json();
      setFormData({ title: career.title, department: career.department, location: career.location, type: career.type, description: career.description, isActive: career.isActive });
    } catch (error) {
      console.error("Failed to fetch career listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update career listing");
      router.push("/admin/careers");
    } catch (error) {
      console.error("Failed to update career listing:", error);
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
          <div><h1 className="text-2xl font-bold text-foreground">Edit Career Listing</h1><p className="text-muted-foreground mt-1">Update job opening details</p></div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Listing Details</CardTitle><CardDescription>Information about the job opening</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label htmlFor="department">Department *</Label><Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="location">Location *</Label><Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required /></div>
              <div className="space-y-2"><Label htmlFor="type">Type *</Label><Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="FULL_TIME">Full Time</SelectItem><SelectItem value="PART_TIME">Part Time</SelectItem><SelectItem value="CONTRACT">Contract</SelectItem><SelectItem value="INTERNSHIP">Internship</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label htmlFor="description">Description *</Label><textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full min-h-[200px] px-3 py-2 text-sm rounded-md border border-input bg-background" required /></div>
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
