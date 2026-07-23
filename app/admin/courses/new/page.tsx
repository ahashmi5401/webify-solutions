"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
  ChevronDown,
  Video,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function NewCoursePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    // Auto-generate slug from title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData(prev => ({ ...prev, slug }));
  }, [formData.title]);

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

    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        modules: modules.map(m => ({
          title: m.title,
          order: m.order,
          lessons: m.lessons.map(l => ({
            title: l.title,
            content: l.content,
            videoUrl: l.videoUrl || null,
            order: l.order,
            isFreePreview: l.isFreePreview,
          })),
        })),
      };

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) throw new Error("Failed to create course");

      const course = await res.json();
      router.push(`/admin/courses/${course.slug}`);
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Course</h1>
            <p className="text-muted-foreground mt-1">Create a new course with its curriculum</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Course"}
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
                  placeholder="Introduction to Web Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="introduction-to-web-development"
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
                placeholder="A comprehensive introduction to modern web development..."
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
                  placeholder="99.99"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Web Development"
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
                Publish immediately
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Builder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Curriculum</CardTitle>
                <CardDescription>Organize your course content into modules and lessons</CardDescription>
              </div>
              <Button type="button" onClick={handleAddModule} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No modules yet. Click "Add Module" to start building your curriculum.
              </div>
            ) : (
              modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border border-border rounded-lg p-4 space-y-4">
                  {/* Module Header */}
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Module {moduleIndex + 1}</Badge>
                    <Input
                      value={module.title}
                      onChange={(e) => handleUpdateModule(moduleIndex, "title", e.target.value)}
                      placeholder="Module title"
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveModule(moduleIndex, "up")}
                        disabled={moduleIndex === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveModule(moduleIndex, "down")}
                        disabled={moduleIndex === modules.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteModule(moduleIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-2 pl-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="border border-border rounded-md p-3 space-y-3 bg-muted/20">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            Lesson {lessonIndex + 1}
                          </Badge>
                          <Input
                            value={lesson.title}
                            onChange={(e) => handleUpdateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                            placeholder="Lesson title"
                            className="flex-1 text-sm"
                          />
                          <div className="flex items-center space-x-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveLesson(moduleIndex, lessonIndex, "up")}
                              disabled={lessonIndex === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveLesson(moduleIndex, lessonIndex, "down")}
                              disabled={lessonIndex === module.lessons.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLesson(moduleIndex, lessonIndex)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Video URL</Label>
                            <Input
                              value={lesson.videoUrl || ""}
                              onChange={(e) => handleUpdateLesson(moduleIndex, lessonIndex, "videoUrl", e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                              className="text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-4">
                            <input
                              type="checkbox"
                              checked={lesson.isFreePreview}
                              onChange={(e) => handleUpdateLesson(moduleIndex, lessonIndex, "isFreePreview", e.target.checked)}
                              className="h-4 w-4 rounded border border-input"
                            />
                            <Label className="text-xs cursor-pointer">Free preview</Label>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Content</Label>
                          <textarea
                            value={lesson.content}
                            onChange={(e) => handleUpdateLesson(moduleIndex, lessonIndex, "content", e.target.value)}
                            placeholder="Lesson content (markdown supported)..."
                            className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddLesson(moduleIndex)}
                      className="w-full"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Lesson
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
