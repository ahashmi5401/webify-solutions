"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  Mail, 
  ArrowRight,
  Calendar,
  Clock
} from "lucide-react";
import Link from "next/link";

interface KPICard {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color: string;
}

interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  href: string;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [kpis, setKPIs] = useState<KPICard[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentItem[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentItem[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userRole = (session?.user as any)?.role;
      
      // Fetch KPI data
      const [coursesRes, blogRes, inquiriesRes] = await Promise.all([
        fetch("/api/courses?page=1&limit=1"),
        fetch("/api/blog?page=1&limit=1"),
        fetch("/api/inquiries"),
      ]);

      const coursesData = await coursesRes.json();
      const blogData = await blogRes.json();
      const inquiriesData = await inquiriesRes.json();

      const kpiData: KPICard[] = [
        {
          title: "Total Courses",
          value: coursesData.pagination?.total || 0,
          icon: BookOpen,
          href: "/admin/courses",
          color: "text-blue-600",
        },
        {
          title: "Blog Posts",
          value: blogData.pagination?.total || 0,
          icon: FileText,
          href: "/admin/blog",
          color: "text-purple-600",
        },
        {
          title: "Total Inquiries",
          value: inquiriesData.length || 0,
          icon: MessageSquare,
          href: "/admin/inquiries",
          color: "text-orange-600",
        },
      ];

      // Only add enrollments for ADMIN and SUPER_ADMIN
      if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
        const enrollmentsRes = await fetch("/api/enrollments");
        const enrollmentsData = await enrollmentsRes.json();
        
        kpiData.push({
          title: "Total Enrollments",
          value: enrollmentsData.length || 0,
          icon: Users,
          href: "/admin/enrollments",
          color: "text-green-600",
        });

        // Recent enrollments
        const recentEnrollmentsData = enrollmentsData.slice(0, 5).map((e: any) => ({
          id: e.id,
          title: e.user?.name || e.user?.email || "Unknown",
          subtitle: e.course?.title || "Unknown Course",
          date: new Date(e.enrolledAt).toLocaleDateString(),
          href: `/admin/enrollments`,
        }));
        setRecentEnrollments(recentEnrollmentsData);
      }

      setKPIs(kpiData);

      // Recent inquiries
      const recentInquiriesData = inquiriesData.slice(0, 5).map((i: any) => ({
        id: i.id,
        title: i.name,
        subtitle: i.source,
        date: new Date(i.createdAt).toLocaleDateString(),
        href: `/admin/inquiries`,
      }));
      setRecentInquiries(recentInquiriesData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {session?.user?.name || session?.user?.email || "Admin"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.title} href={kpi.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              <Link href="/admin/inquiries">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No inquiries yet</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{inquiry.title}</p>
                      <p className="text-xs text-muted-foreground">{inquiry.subtitle}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant="secondary" className="text-xs">
                        {inquiry.date}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        {(session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "SUPER_ADMIN" ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Enrollments</CardTitle>
                <Link href="/admin/enrollments">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No enrollments yet</p>
              ) : (
                <div className="space-y-3">
                  {recentEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{enrollment.title}</p>
                        <p className="text-xs text-muted-foreground">{enrollment.subtitle}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge variant="secondary" className="text-xs">
                          {enrollment.date}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
