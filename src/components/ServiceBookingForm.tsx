import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createBooking } from "@/services/bookingService";

type ServiceType = "" | "Aquaguard" | "Inverter";

type BookingData = {
  name: string;
  phone: string;
  serviceType: ServiceType;
  issue: string;
  preferredDate: string;
  timeSlot: string;
  notes?: string;
  submittedAt?: string;
};

const ISSUE_OPTIONS: Record<ServiceType, string[]> = {
  "": ["Please select a service type first"],
  Aquaguard: [
    "No Water",
    "Leaking/Overflow",
    "Low Pressure",
    "Poor Taste/Odor",
    "Not Powering On",
    "Routine Servicing",
  ],
  Inverter: [
    "No Output / No Power",
    "Battery Failure",
    "Not Charging",
    "Overheating",
    "Inverter Replacement",
    "Routine Servicing",
  ],
};

const TIME_SLOTS = [
  "09:00 - 11:00",
  "11:00 - 13:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

export default function ServiceBookingForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { toast } = useToast();

  const steps = ["Contact", "Service", "Schedule", "Review"];
  const [step, setStep] = useState<number>(0);

  const [form, setForm] = useState<BookingData>({
    name: "",
    phone: "",
    serviceType: "",
    issue: "",
    preferredDate: "",
    timeSlot: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  const currentIssues = form.serviceType ? ISSUE_OPTIONS[form.serviceType] : ISSUE_OPTIONS[""];

  const validateStep = (s: number) => {
    const e: Partial<Record<keyof BookingData, string>> = {};
    if (s === 0) {
      if (!form.name || form.name.trim().length < 2) e.name = "Please enter your name.";
      const digits = form.phone.replace(/\D/g, "");
      if (!digits || digits.length < 10) e.phone = "Enter a valid 10-digit phone number.";
    }
    if (s === 1) {
      if (!form.serviceType) e.serviceType = "Choose a service type.";
      if (!form.issue) e.issue = "Select an issue.";
    }
    if (s === 2) {
      if (!form.preferredDate) e.preferredDate = "Pick a preferred date.";
      else {
        const picked = new Date(form.preferredDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (picked < today) e.preferredDate = "Date cannot be in the past.";
      }
      if (!form.timeSlot) e.timeSlot = "Select a preferred time slot.";
    }
    return e;
  };

  const goNext = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const submitAll = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    // validate all steps
    const allErrors = {
      ...validateStep(0),
      ...validateStep(1),
      ...validateStep(2),
    };
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      // move to first error step
      if (allErrors.name || allErrors.phone) setStep(0);
      else if (allErrors.serviceType || allErrors.issue) setStep(1);
      else setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<any> = {
        name: form.name,
        phone: form.phone,
        service: `${form.serviceType} — ${form.issue}`,
        preferredDate: form.preferredDate,
        timeSlot: form.timeSlot,
        notes: form.notes,
        submittedAt: new Date().toISOString(),
      };

      const created = await createBooking(payload);
      setCreatedBooking(created);
      onSubmit?.(created);
      toast({ title: "Booking confirmed", description: "Thank you — we'll contact you to confirm the slot." });
    } catch (err) {
      console.error(err);
      toast({ title: "Booking failed", description: "Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", phone: "", serviceType: "", issue: "", preferredDate: "", timeSlot: "", notes: "" });
    setErrors({});
    setCreatedBooking(null);
    setStep(0);
  };

  // UI helpers
  const progressPct = Math.round((step / (steps.length - 1)) * 100);

  if (createdBooking) {
    return (
      <div className="card-elevated rounded-lg bg-card p-8 text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary text-xl font-bold">
          ✓
        </div>
        <h3 className="text-2xl font-semibold">Booking submitted</h3>
        <p className="text-sm text-muted-foreground mt-2">We received your request — our team will contact you to confirm the appointment.</p>
        <div className="mt-4 text-left text-sm bg-muted/50 rounded-md p-3">
          <p className="font-semibold">Summary</p>
          <p className="mt-2">{createdBooking.service}</p>
          <p className="text-muted-foreground">{createdBooking.name} • {createdBooking.phone}</p>
          <p className="text-muted-foreground">{createdBooking.date} • {createdBooking.timeSlot || form.timeSlot}</p>
        </div>
        <div className="mt-4 flex gap-2 justify-center">
          <Button onClick={resetForm} variant="outline" size="sm">Book another</Button>
          <Button onClick={() => window.location.href = '/contact'} size="sm">View requests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated rounded-lg bg-card p-8 sm:p-10 transition-smooth w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold leading-tight">Book a Service</h2>
          <p className="text-sm text-muted-foreground mt-2">Quick guided booking — fast, simple & mobile-friendly.</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 w-60">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="h-3 bg-primary transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="text-sm font-medium text-muted-foreground">{progressPct}%</div>
        </div>
      </div>

      <form onSubmit={submitAll} className="space-y-6">
        {/* step indicator (mobile) */}
        <div className="flex items-center gap-3 sm:hidden mb-3">
          {steps.map((s, i) => (
            <div key={s} className={`flex-1 h-3 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted/40'} transition-all`}></div>
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div>
              <Input
                className="h-12 text-base"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Input
                className="h-12 text-base"
                placeholder="Phone (10 digits)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="mt-2 text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div>
              <label className="sr-only">Service Type</label>
              <select
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value as ServiceType, issue: "" })}
                aria-invalid={!!errors.serviceType}
              >
                <option value="">Select Service Type</option>
                <option value="Aquaguard">Aquaguard</option>
                <option value="Inverter">Inverter</option>
              </select>
              {errors.serviceType && <p className="mt-2 text-sm text-destructive">{errors.serviceType}</p>}
            </div>

            <div>
              <label className="sr-only">Issue</label>
              <select
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                disabled={!form.serviceType}
                aria-invalid={!!errors.issue}
              >
                <option value="">Select Issue</option>
                {currentIssues.map((it) => (
                  <option key={it} value={it}>{it}</option>
                ))}
              </select>
              {errors.issue && <p className="mt-2 text-sm text-destructive">{errors.issue}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div>
              <Input className="h-12" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} aria-invalid={!!errors.preferredDate} />
              {errors.preferredDate && <p className="mt-2 text-sm text-destructive">{errors.preferredDate}</p>}
            </div>
            <div>
              <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} aria-invalid={!!errors.timeSlot}>
                <option value="">Select Time Slot</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.timeSlot && <p className="mt-2 text-sm text-destructive">{errors.timeSlot}</p>}
            </div>
            <div className="sm:col-span-2">
              <Textarea className="min-h-[96px] text-sm" placeholder="Additional notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="font-semibold text-base">Please review</p>
              <p className="mt-2"><strong>Service:</strong> {form.serviceType} — {form.issue}</p>
              <p className="text-muted-foreground"><strong>Name:</strong> {form.name}</p>
              <p className="text-muted-foreground"><strong>Phone:</strong> {form.phone}</p>
              <p className="text-muted-foreground"><strong>When:</strong> {form.preferredDate || '—'} {form.timeSlot ? `• ${form.timeSlot}` : ''}</p>
              {form.notes && <p className="text-muted-foreground"><strong>Notes:</strong> {form.notes}</p>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mt-4">
          <div className="flex-1 sm:flex-none w-full sm:w-auto">
            {step > 0 && (
              <Button variant="ghost" size="default" onClick={goBack} className="w-full sm:w-auto px-4 py-2">Back</Button>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {step < steps.length - 1 ? (
              <Button onClick={goNext} className="w-full sm:w-auto px-6 py-2" size="lg">Next</Button>
            ) : (
              <Button type="submit" className="w-full sm:w-auto px-6 py-2" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Submitting...</span>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* small preview for debugging / history (kept collapsed on mobile) */}
      <div className="mt-4 text-xs text-muted-foreground hidden sm:block">
        Your details are stored only temporarily for this demo and prepared for backend integration.
      </div>
    </div>
  );
}
