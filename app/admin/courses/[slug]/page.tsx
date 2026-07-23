"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Save, 
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { ImageUploader } from "@/components/shared/ImageUploader";

interface Module {
  id?: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id?: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  isFreePreview: boolean;
}

export default function EditCoursePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    thumbnailUrl: "",
    category: "",
    level: "BEGINNER",
    isPublished: false,
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      const course = await res.json();
      
      setFormData({
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price.toString(),
        thumbnailUrl: course.thumbnailUrl || "",
        category: course.category,
        level: course.level,
        isPublished: course.isPublished,
      });

      setModules(course.modules || []);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = () => {
    const newModule: Module = {
      title: "",
      order: modules.length,
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const handleUpdateModule = (index: number, field: string, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const handleDeleteModule = (index: number) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules.map((m, i) => ({ ...m, order: i })));
  };

  const handleAddLesson = (moduleIndex: number) => {
    const updatedModules = [...modules];
    const module = updatedModules[moduleIndex];
    const newLesson: Lesson = {
      title: "",
      content: "",
      order: module.lessons.length,
      isFreePreview: false,
    };
    updatedModules[moduleIndex] = {
      ...module,
      lessons: [...module.lessons, newLesson],
    };
    setModules(updatedModules);
  };

  const handleUpdateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons[lessonIndex] = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value,
    };
    setModules(updatedModules);
  };

  const handleDeleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.map(
      (l, i) => ({ ...l, order: i })
    );
    setModules(updatedModules);
  };

  const handleMoveLesson = (moduleIndex: number, lessonIndex: number, direction: "up" | "down") => {
    const updatedModules = [...modules];
    const lessons = [...updatedModules[moduleIndex].lessons];
    
    if (direction === "up" && lessonIndex > 0) {
      [lessons[lessonIndex], lessons[lessonIndex - 1]] = [lessons[lessonIndex - 1], lessons[lessonIndex]];
    } else if (direction === "down" && lessonIndex < lessons.length - 1) {
      [lessons[lessonIndex], lessons[lessonIndex + 1]] = [lessons[lessonIndex + 1], lessons[lessonIndex]];
    }
    
    updatedModules[moduleIndex].lessons = lessons.map((l, i) => ({ ...l, order: i }));
    setModules(updatedModules);
  };

  const handleMoveModule = (index: number, direction: "up" | "down") => {
    const updatedModules = [...modules];
    
    if (direction === "up" && index > 0) {
      [updatedModules[index], updatedModules[index - 1]] = [updatedModules[index - 1], updatedModules[index]];
    } else if (direction === "down" && index < updatedModules.length - 1) {
      [updatedModules[index], updatedModules[index + 1]] = [updatedModules[index + 1], updatedModules[index]];
    }
    
    setModules(updatedModules.map((m, i) => ({ ...m, order: i })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const courseData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        thumbnailUrl: formData.thumbnailUrl || null,
        category: formData.category,
        level: formData.level,
        isPublished: formData.isPublished,
      };

      const res = await fetch(`/api/courses/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData?.error?.message || "Failed to update course";
        throw new Error(errorMessage);
      }

      router.push("/admin/courses");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update course";
      setError(errorMessage);
      console.error("Failed to update course:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Course</h1>
            <p className="text-muted-foreground mt-1">Update course information and curriculum</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General details about your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Course Thumbnail</Label>
              <ImageUploader
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                onRemove={() => setFormData({ ...formData, thumbnailUrl: "" })}
                disabled={saving}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 rounded border border-input"
              />
              <Label htmlFor="isPublished" className="cursor-pointer">
                Published
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Note about curriculum editing */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Curriculum (modules and lessons) editing requires dedicated endpoints. 
              Currently, you can only edit basic course information. 
              To modify the curriculum, please use the API directly or contact the development team.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
