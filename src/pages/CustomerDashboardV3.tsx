import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, FileText, RefreshCcw, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsAPI, invoicesAPI } from "@/services/apiClient";

type Booking = {
  _id: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
};

type Invoice = {
  _id: string;
  invoiceId: string;
  totalAmount: number;
  status: string;
  date: string;
};

const statusTone: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  "in-progress": "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export default function CustomerDashboardV3() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("10:00");
  const [rescheduleNotes, setRescheduleNotes] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingResponse, invoiceResponse] = await Promise.all([
        bookingsAPI.getMyBookings(),
        invoicesAPI.getMyInvoices(),
      ]);
      setBookings(bookingResponse.data || []);
      setInvoices(invoiceResponse.data || []);
    } catch (error) {
      toast.error("We could not load your dashboard right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(
    () => ({
      totalBookings: bookings.length,
      activeBookings: bookings.filter((booking) => booking.status === "pending" || booking.status === "in-progress").length,
      completedBookings: bookings.filter((booking) => booking.status === "completed").length,
      invoices: invoices.length,
    }),
    [bookings, invoices],
  );

  const handleCancel = async (bookingId: string) => {
    try {
      setActionId(bookingId);
      await bookingsAPI.updateMyBooking(bookingId, { action: "cancel" });
      toast.success("Booking cancelled successfully.");
      await loadData();
    } catch (error) {
      toast.error("Unable to cancel this booking.");
    } finally {
      setActionId(null);
    }
  };

  const handleReschedule = async (bookingId: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please choose a new date and time.");
      return;
    }

    try {
      setActionId(bookingId);
      await bookingsAPI.updateMyBooking(bookingId, {
        action: "reschedule",
        preferredDate: rescheduleDate,
        preferredTime: rescheduleTime,
        notes: rescheduleNotes,
      });
      toast.success("Booking rescheduled successfully.");
      setRescheduleOpen(null);
      setRescheduleDate("");
      setRescheduleTime("10:00");
      setRescheduleNotes("");
      await loadData();
    } catch (error) {
      toast.error("Unable to reschedule this booking.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Customer dashboard</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">Welcome, {user?.name || "Customer"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Track service requests, review invoice history, and manage schedule changes without leaving the portal.
          </p>
        </div>
        <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={loadData}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total bookings", value: stats.totalBookings },
          { label: "Active requests", value: stats.activeBookings },
          { label: "Completed jobs", value: stats.completedBookings },
          { label: "Invoices", value: stats.invoices },
        ].map((item) => (
          <Card key={item.label} className="border-border/60 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Booking history</CardTitle>
              <p className="text-sm text-slate-500">Every request, status, and next action in one view.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/booking">New booking</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-slate-500">
                Loading your bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-slate-500">
                No bookings yet. Create your first service request to get started.
              </div>
            ) : (
              bookings.map((booking) => {
                const editable = booking.status === "pending" || booking.status === "in-progress";

                return (
                  <div key={booking._id} className="rounded-2xl border border-border/70 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">{booking.serviceType}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusTone[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(booking.preferredDate).toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />
                            {booking.preferredTime}
                          </span>
                        </div>
                        {booking.notes ? <p className="text-sm leading-6 text-slate-600">{booking.notes}</p> : null}
                      </div>

                      {editable ? (
                        <div className="flex flex-wrap gap-3">
                          <Dialog
                            open={rescheduleOpen === booking._id}
                            onOpenChange={(open) => {
                              setRescheduleOpen(open ? booking._id : null);
                              if (!open) {
                                setRescheduleDate("");
                                setRescheduleTime("10:00");
                                setRescheduleNotes("");
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline">Reschedule</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reschedule booking</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`date-${booking._id}`}>Preferred date</Label>
                                  <Input
                                    id={`date-${booking._id}`}
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(event) => setRescheduleDate(event.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`time-${booking._id}`}>Preferred time</Label>
                                  <select
                                    id={`time-${booking._id}`}
                                    value={rescheduleTime}
                                    onChange={(event) => setRescheduleTime(event.target.value)}
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  >
                                    <option value="09:00">09:00</option>
                                    <option value="10:00">10:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="12:00">12:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`notes-${booking._id}`}>Notes</Label>
                                  <Input
                                    id={`notes-${booking._id}`}
                                    value={rescheduleNotes}
                                    onChange={(event) => setRescheduleNotes(event.target.value)}
                                    placeholder="Add a note for the updated request"
                                  />
                                </div>
                                <Button className="w-full" onClick={() => handleReschedule(booking._id)} disabled={actionId === booking._id}>
                                  Save changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="destructive"
                            onClick={() => handleCancel(booking._id)}
                            disabled={actionId === booking._id}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <p className="text-sm text-slate-500">Review billing history and open invoice details.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-slate-500">
                Loading invoices...
              </div>
            ) : invoices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-slate-500">
                No invoices have been issued yet.
              </div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice._id} className="rounded-2xl border border-border/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{invoice.invoiceId}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                      {invoice.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-950">Rs. {invoice.totalAmount.toFixed(2)}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/invoice/${invoice._id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
