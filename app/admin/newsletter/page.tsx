"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Mail, Check, X } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/newsletter");
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      const data = await res.json();
      setSubscribers(data.data || []);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Status", "Subscribed At", "Unsubscribed At"];
    const rows = filteredSubscribers.map(s => [
      s.email,
      s.isActive ? "Active" : "Inactive",
      new Date(s.subscribedAt).toLocaleString(),
      s.unsubscribedAt ? new Date(s.unsubscribedAt).toLocaleString() : "",
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(s => {
    if (activeFilter === "active") return s.isActive;
    if (activeFilter === "inactive") return !s.isActive;
    return true;
  });

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Newsletter Subscribers</h1><p className="text-muted-foreground mt-1">Manage your newsletter subscriptions</p></div>
        <Button onClick={exportToCSV} disabled={subscribers.length === 0}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant={activeFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("all")}>All ({subscribers.length})</Button>
        <Button variant={activeFilter === "active" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("active")}>Active ({subscribers.filter(s => s.isActive).length})</Button>
        <Button variant={activeFilter === "inactive" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("inactive")}>Inactive ({subscribers.filter(s => !s.isActive).length})</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed At</TableHead>
                <TableHead>Unsubscribed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{activeFilter === "all" ? "No subscribers yet" : `No ${activeFilter} subscribers`}</TableCell></TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                        {subscriber.isActive ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                        {subscriber.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{subscriber.unsubscribedAt ? new Date(subscriber.unsubscribedAt).toLocaleDateString() : "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
