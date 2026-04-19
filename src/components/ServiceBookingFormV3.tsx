import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookingsAPI } from "@/services/apiClient";
import { toast } from "@/components/ui/sonner";

type ServiceType = "" | "aquaguard" | "inverter";

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  issueType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

const ISSUE_OPTIONS: Record<ServiceType, string[]> = {
  "": ["Select a service type first"],
  aquaguard: ["Installation", "Routine servicing", "Filter replacement", "No water flow", "Leakage or overflow", "Poor taste or odor"],
  inverter: ["New installation", "Battery replacement", "Low backup time", "No power output", "Charging issue", "Routine servicing"],
};

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

const initialFormState: BookingFormData = {
  name: "",
  email: "",
  phone: "",
  serviceType: "",
  issueType: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
};

type Props = {
  onSuccess?: (booking: any) => void;
  initialValues?: Partial<BookingFormData>;
  source?: "contact" | "dashboard";
  title?: string;
  subtitle?: string;
};

export default function ServiceBookingFormV3({
  onSuccess,
  initialValues,
  source = "contact",
  title = "Book a Service",
  subtitle = "Tell us what you need and we will schedule the right technician.",
}: Props) {
  const [form, setForm] = useState<BookingFormData>({ ...initialFormState, ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);
  const issueOptions = useMemo(() => ISSUE_OPTIONS[form.serviceType], [form.serviceType]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Please enter the customer's name.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Please enter a valid phone number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (!form.serviceType) nextErrors.serviceType = "Please choose a service type.";
    if (!form.issueType.trim()) nextErrors.issueType = "Please select an issue.";
    if (!form.preferredDate) nextErrors.preferredDate = "Please choose a preferred date.";
    if (!form.preferredTime) nextErrors.preferredTime = "Please choose a preferred time.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field: keyof BookingFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await bookingsAPI.createBooking({ ...form, source });
      setCreatedBooking(response.data);
      toast.success("Booking submitted successfully.");
      onSuccess?.(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to create the booking right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdBooking) {
    return (
      <div className="rounded-[28px] border border-emerald-200 bg-white p-8 shadow-[0_24px_70px_-30px_rgba(16,185,129,0.45)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-semibold text-emerald-600">Done</div>
        <h3 className="mt-5 text-2xl font-bold">Booking confirmed</h3>
        <p className="mt-2 text-sm text-muted-foreground">We have saved the request and will call the customer to confirm the visit.</p>
        <div className="mt-6 grid gap-3 rounded-2xl bg-muted/40 p-5 text-sm">
          <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Customer</span><span className="font-semibold">{createdBooking.name}</span></div>
          <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Service</span><span className="font-semibold capitalize">{createdBooking.serviceType}</span></div>
          <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Issue</span><span className="font-semibold">{createdBooking.issueType}</span></div>
          <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Preferred slot</span><span className="font-semibold">{new Date(createdBooking.preferredDate).toLocaleDateString("en-IN")} - {createdBooking.preferredTime}</span></div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => { setCreatedBooking(null); setForm({ ...initialFormState, ...initialValues }); }}>
            Create another booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-border/60 bg-white p-6 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.4)] sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">Service request</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>
      </div>

      <form onSubmit={submitForm} className="space-y-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Customer name</label>
            <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Enter full name" />
            {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
            <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="10-digit mobile number" />
            {errors.phone && <p className="mt-2 text-sm text-destructive">{errors.phone}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
            <Input value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Optional email for confirmations" />
            {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Service type</label>
            <select value={form.serviceType} onChange={(e) => { updateField("serviceType", e.target.value); updateField("issueType", ""); }} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select service</option>
              <option value="aquaguard">Aquaguard</option>
              <option value="inverter">Inverter</option>
            </select>
            {errors.serviceType && <p className="mt-2 text-sm text-destructive">{errors.serviceType}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Issue / requirement</label>
            <select value={form.issueType} onChange={(e) => updateField("issueType", e.target.value)} disabled={!form.serviceType} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select issue</option>
              {issueOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.issueType && <p className="mt-2 text-sm text-destructive">{errors.issueType}</p>}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Preferred date</label>
            <Input type="date" value={form.preferredDate} onChange={(e) => updateField("preferredDate", e.target.value)} />
            {errors.preferredDate && <p className="mt-2 text-sm text-destructive">{errors.preferredDate}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Preferred time</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TIME_SLOTS.map((slot) => (
                <button key={slot} type="button" onClick={() => updateField("preferredTime", slot)} className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${form.preferredTime === slot ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background text-slate-600 hover:border-primary/50 hover:bg-primary/5"}`}>
                  {slot}
                </button>
              ))}
            </div>
            {errors.preferredTime && <p className="mt-2 text-sm text-destructive">{errors.preferredTime}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Additional notes</label>
          <Textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Share location details, urgency, or any issue description." rows={4} />
        </div>

        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Preview</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p><span className="font-semibold text-slate-900">Customer:</span> {form.name || "Not added yet"}</p>
            <p><span className="font-semibold text-slate-900">Contact:</span> {form.phone || "Not added yet"}</p>
            <p><span className="font-semibold text-slate-900">Service:</span> {form.serviceType || "Select service"}</p>
            <p><span className="font-semibold text-slate-900">Issue:</span> {form.issueType || "Select issue"}</p>
            <p><span className="font-semibold text-slate-900">Date:</span> {form.preferredDate || "Choose date"}</p>
            <p><span className="font-semibold text-slate-900">Time:</span> {form.preferredTime || "Choose time"}</p>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Saving booking..." : "Confirm booking"}
        </Button>
      </form>
    </div>
  );
}
