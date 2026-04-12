import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, FileText, Loader2, LogOut, ArrowRight, Zap, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsAPI, invoicesAPI } from "@/services/api";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function CustomerDashboardV2() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResponse, invoicesResponse] = await Promise.all([
          bookingsAPI.getMyBookings(),
          invoicesAPI.getMyInvoices(),
        ]);

        setBookings(bookingsResponse.data);
        setInvoices(invoicesResponse.data);
      } catch (error) {
        console.error("Failed to load customer dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/[0.03]">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-3 text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const completedCount = bookings.filter((booking) => booking.status === "completed").length;
  const totalBilled = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

  const statCards = [
    { 
      label: "Total Bookings", 
      value: bookings.length, 
      icon: ClipboardList,
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600"
    },
    { 
      label: "Pending Requests", 
      value: pendingCount, 
      icon: Zap,
      color: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-600"
    },
    { 
      label: "Total Billed", 
      value: `₹${totalBilled.toLocaleString("en-IN")}`, 
      icon: FileText,
      color: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-600"
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8fb_0%,#ffffff_50%,#eff7f3_100%)]">
      {/* Hero Section */}
      <section className="hero relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full -ml-48 -mb-48" />
        
        <div className="relative container py-16 text-primary-foreground z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">Welcome Back</p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl lg:text-6xl leading-tight">
                Hi, {user?.name}! 👋
              </h1>
              <p className="mt-4 max-w-2xl text-base text-primary-foreground/85 md:text-lg">
                Manage your service bookings, track invoices, and schedule maintenance from your personal dashboard.
              </p>
            </div>
            <Button
              onClick={logout}
              className="border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 rounded-xl font-semibold transition-all hover:scale-105"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container -mt-8 relative z-10 pb-16">
        {/* Stats Cards */}
        <div className="grid gap-5 md:grid-cols-3 mb-8">
          {statCards.map((stat, idx) => (
            <Card 
              key={stat.label} 
              className={`rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.color} overflow-hidden animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 bg-white/60 backdrop-blur-sm`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Bookings Section */}
          <Card className="rounded-2xl border-0 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Recent Bookings</CardTitle>
                <p className="mt-1 text-sm text-slate-500">Your latest service requests</p>
              </div>
              <Link to="/booking">
                <Button className="rounded-xl font-semibold transition-all hover:scale-105">
                  + Book Service
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                    <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">No bookings yet</p>
                    <p className="text-xs text-slate-500 mt-1">Schedule your first service visit today!</p>
                  </div>
                ) : (
                  bookings.slice(0, 6).map((booking, idx) => (
                    <div 
                      key={booking._id} 
                      className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50/50 to-white p-4 hover:shadow-md transition-all duration-200 hover:border-primary/30 animate-in fade-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold capitalize text-slate-900">{booking.serviceType}</p>
                          <p className="text-sm text-slate-600 mt-1">{booking.issueType}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            📅 {new Date(booking.preferredDate).toLocaleDateString("en-IN")} • ⏰ {booking.preferredTime}
                          </p>
                        </div>
                        <Badge className={`border font-semibold ${statusStyles[booking.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Account Details */}
            <Card className="rounded-2xl border-0 shadow-lg overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b">
                <CardTitle className="text-lg font-bold text-slate-900">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="pb-4 border-b border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Name</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{user?.name}</p>
                </div>
                <div className="pb-4 border-b border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Email</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 break-all">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Phone</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{user?.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Invoice History */}
            <Card className="rounded-2xl border-0 shadow-lg overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b">
                <CardTitle className="text-lg font-bold text-slate-900">Invoices</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {invoices.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
                      <File className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-600">No invoices yet</p>
                      <p className="text-xs text-slate-500 mt-1">Your invoices will appear here</p>
                    </div>
                  ) : (
                    invoices.slice(0, 5).map((invoice, idx) => (
                      <Link
                        key={invoice._id}
                        to={`/invoice/${invoice._id}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50/50 to-white p-3 transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:from-primary/5 group animate-in fade-in"
                        style={{ animationDelay: `${100 + idx * 50}ms` }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                            {invoice.invoiceId}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(invoice.date).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-sm font-bold text-primary whitespace-nowrap">
                            ₹{invoice.totalAmount?.toLocaleString("en-IN")}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
