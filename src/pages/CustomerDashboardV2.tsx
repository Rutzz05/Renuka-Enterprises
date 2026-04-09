import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, FileText, Loader2, LogOut, ArrowRight } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const totalBilled = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8fb_0%,#ffffff_50%,#eff7f3_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-95" />
        <div className="relative container py-12 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">Customer dashboard</p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">Welcome back, {user?.name}.</h1>
              <p className="mt-3 max-w-2xl text-base text-white/75 md:text-lg">
                Track service requests, review invoice history, and schedule new visits from one place.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </section>

      <section className="container -mt-8 relative z-10 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total bookings", value: bookings.length, icon: ClipboardList },
            { label: "Pending bookings", value: pendingCount, icon: CalendarDays },
            { label: "Total billed", value: `Rs. ${totalBilled.toLocaleString("en-IN")}`, icon: FileText },
          ].map((item) => (
            <Card key={item.label} className="rounded-[24px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-[28px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
              <div>
                <CardTitle className="text-xl">Recent bookings</CardTitle>
                <p className="mt-1 text-sm text-slate-500">Status updates from your latest requests.</p>
              </div>
              <Link to="/booking">
                <Button>Book service</Button>
              </Link>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-slate-500">
                    No bookings yet. Create your first service request to get started.
                  </div>
                ) : (
                  bookings.slice(0, 6).map((booking) => (
                    <div key={booking._id} className="rounded-2xl border bg-slate-50/70 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold capitalize text-slate-900">{booking.serviceType}</p>
                          <p className="mt-1 text-sm text-slate-600">{booking.issueType}</p>
                          <p className="mt-2 text-xs text-slate-500">
                            {new Date(booking.preferredDate).toLocaleDateString("en-IN")} at {booking.preferredTime}
                          </p>
                        </div>
                        <Badge className={`border ${statusStyles[booking.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[28px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
              <CardHeader className="p-6">
                <CardTitle className="text-xl">Account details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6 text-sm">
                <div>
                  <p className="text-slate-500">Name</p>
                  <p className="mt-1 font-semibold text-slate-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="mt-1 font-semibold text-slate-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="mt-1 font-semibold text-slate-900">{user?.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
              <CardHeader className="p-6">
                <CardTitle className="text-xl">Invoice history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6">
                {invoices.length === 0 ? (
                  <p className="rounded-2xl border border-dashed p-5 text-sm text-slate-500">
                    Invoices will appear here once the admin generates them.
                  </p>
                ) : (
                  invoices.slice(0, 5).map((invoice) => (
                    <Link
                      key={invoice._id}
                      to={`/invoice/${invoice._id}`}
                      className="flex items-center justify-between rounded-2xl border bg-slate-50/70 p-4 transition hover:border-primary/30 hover:bg-white"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{invoice.invoiceId}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(invoice.date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-900">
                          Rs. {invoice.totalAmount?.toLocaleString("en-IN")}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
