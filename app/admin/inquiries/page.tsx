"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  source: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  IN_PROGRESS: AlertCircle,
  RESOLVED: CheckCircle,
  CLOSED: XCircle,
};

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (sourceFilter) params.append("source", sourceFilter);
      if (statusFilter) params.append("status", statusFilter);
      
      const res = await fetch(`/api/inquiries?${params}`);
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      const data = await res.json();
      setInquiries(data || []);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update inquiry status");
      
      setInquiries(inquiries.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update inquiry status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const filteredInquiries = inquiries.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><Card><CardContent className="p-6"><div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Inquiries</h1><p className="text-muted-foreground mt-1">Manage contact and inquiry messages</p></div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inquiries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={sourceFilter} onValueChange={(value) => { setSourceFilter(value); fetchInquiries(); }}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent><SelectItem value="">All Sources</SelectItem><SelectItem value="COURSE">Course</SelectItem><SelectItem value="SERVICE">Service</SelectItem><SelectItem value="CONTACT">Contact</SelectItem><SelectItem value="CAREER">Career</SelectItem></SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); fetchInquiries(); }}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="">All Status</SelectItem><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="IN_PROGRESS">In Progress</SelectItem><SelectItem value="RESOLVED">Resolved</SelectItem><SelectItem value="CLOSED">Closed</SelectItem></SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{searchQuery || sourceFilter || statusFilter ? "No inquiries found" : "No inquiries yet"}</TableCell></TableRow>
              ) : (
                filteredInquiries.map((inquiry) => {
                  const StatusIcon = statusIcons[inquiry.status] || Clock;
                  return (
                    <TableRow key={inquiry.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedInquiry(inquiry)}>
                      <TableCell className="font-medium">{inquiry.name}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell><Badge variant="outline">{inquiry.source}</Badge></TableCell>
                      <TableCell><Badge className={statusColors[inquiry.status]}><StatusIcon className="h-3 w-3 mr-1" />{inquiry.status}</Badge></TableCell>
                      <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <SheetContent className="w-[500px] sm:w-[600px]">
          {selectedInquiry && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle>Inquiry Details</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedInquiry.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <Badge variant="outline">{selectedInquiry.source}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {selectedInquiry.user && (
                  <div>
                    <p className="text-sm text-muted-foreground">Linked User</p>
                    <p className="font-medium">{selectedInquiry.user.name} ({selectedInquiry.user.email})</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <div className="p-4 bg-muted rounded-lg text-sm">{selectedInquiry.message}</div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Select value={selectedInquiry.status} onValueChange={(value: string) => handleStatusUpdate(selectedInquiry.id, value)} disabled={updating}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
