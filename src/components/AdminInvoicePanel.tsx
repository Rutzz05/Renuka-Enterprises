import { useEffect, useMemo, useState } from "react";
import { Info, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateInvoiceTotals,
  createEmptyAddress,
  createEmptyItem,
  formatCurrency,
  InvoiceFormValues,
  validateInvoiceForm,
} from "@/lib/invoice";
import { invoicesAPI } from "@/services/apiClient";

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type Booking = {
  _id: string;
  issueType?: string;
  preferredDate?: string;
  customer?: {
    _id?: string;
  };
};

type Props = {
  customers: Customer[];
  bookings: Booking[];
  onCreated: () => Promise<void> | void;
};

const helperClass = "mt-1 text-xs leading-5 text-slate-500";
const fieldClass = "space-y-2";

const initialInvoiceForm = (): InvoiceFormValues => {
  const today = new Date().toISOString().split("T")[0];

  return {
    customerMode: "existing",
    customerId: "",
    bookingId: "",
    invoiceId: "",
    invoiceDate: today,
    dateOfSupply: today,
    state: "Maharashtra",
    placeOfSupply: "Nashik",
    reverseCharge: false,
    transportMode: "By hand",
    vehicleNumber: "",
    status: "generated",
    billTo: createEmptyAddress(),
    shipTo: { ...createEmptyAddress(), sameAsBillTo: true },
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
    },
    notes: "",
    items: [createEmptyItem()],
  };
};

function FieldHelp({ children }: { children: React.ReactNode }) {
  return (
    <p className={helperClass}>
      <Info className="mr-1 inline h-3.5 w-3.5 align-text-top" />
      {children}
    </p>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-destructive">{children}</p>;
}

export default function AdminInvoicePanel({ customers, bookings, onCreated }: Props) {
  const [form, setForm] = useState<InvoiceFormValues>(initialInvoiceForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingNumber, setLoadingNumber] = useState(false);

  const totals = useMemo(() => calculateInvoiceTotals(form.items), [form.items]);

  const bookingOptions = useMemo(
    () => bookings.filter((booking) => booking.customer?._id === form.customerId),
    [bookings, form.customerId],
  );

  const fetchNextInvoiceNumber = async (invoiceDate: string) => {
    try {
      setLoadingNumber(true);
      const response = await invoicesAPI.getNextInvoiceNumber(invoiceDate);
      setForm((current) => ({ ...current, invoiceId: response.data.invoiceId }));
    } catch (_error) {
      toast.error("Unable to generate the next invoice number right now.");
    } finally {
      setLoadingNumber(false);
    }
  };

  useEffect(() => {
    fetchNextInvoiceNumber(form.invoiceDate);
  }, [form.invoiceDate]);

  useEffect(() => {
    if (!form.shipTo.sameAsBillTo) return;
    setForm((current) => ({
      ...current,
      shipTo: {
        ...current.shipTo,
        ...current.billTo,
        sameAsBillTo: true,
      },
    }));
  }, [form.billTo, form.shipTo.sameAsBillTo]);

  const updateField = <K extends keyof InvoiceFormValues>(field: K, value: InvoiceFormValues[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [String(field)]: "" }));
  };

  const updateBillTo = (field: keyof InvoiceFormValues["billTo"], value: string) => {
    const nextBillTo = { ...form.billTo, [field]: value };
    setForm((current) => ({
      ...current,
      billTo: nextBillTo,
      shipTo: current.shipTo.sameAsBillTo
        ? { ...current.shipTo, ...nextBillTo }
        : current.shipTo,
    }));
  };

  const updateShipTo = (field: keyof InvoiceFormValues["shipTo"], value: string | boolean) => {
    setForm((current) => ({
      ...current,
      shipTo: {
        ...current.shipTo,
        [field]: value,
      },
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceFormValues["items"][number], value: string) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleCustomerSelection = (customerId: string) => {
    const selectedCustomer = customers.find((customer) => customer.id === customerId);

    setForm((current) => ({
      ...current,
      customerId,
      bookingId: "",
      billTo: {
        ...current.billTo,
        name: selectedCustomer?.name || "",
        phone: selectedCustomer?.phone || "",
      },
      shipTo: current.shipTo.sameAsBillTo
        ? {
            ...current.shipTo,
            name: selectedCustomer?.name || "",
            phone: selectedCustomer?.phone || "",
          }
        : current.shipTo,
    }));
  };

  const resetForm = () => {
    const next = initialInvoiceForm();
    setForm(next);
    setErrors({});
    fetchNextInvoiceNumber(next.invoiceDate);
  };

  const submitInvoice = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateInvoiceForm(form);
    if (form.customerMode === "existing" && !form.customerId) {
      validationErrors.customerId = "Please select an existing customer.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please review the highlighted invoice fields.");
      return;
    }

    try {
      setSubmitting(true);
      await invoicesAPI.createInvoice({
        customerId: form.customerMode === "existing" ? form.customerId : null,
        bookingId: form.customerMode === "existing" ? form.bookingId || null : null,
        type: "product",
        invoiceDate: form.invoiceDate,
        dateOfSupply: form.dateOfSupply,
        state: form.state,
        placeOfSupply: form.placeOfSupply,
        reverseCharge: form.reverseCharge,
        transportMode: form.transportMode,
        vehicleNumber: form.vehicleNumber,
        status: form.status,
        billTo: form.billTo,
        shipTo: form.shipTo.sameAsBillTo ? { ...form.billTo, sameAsBillTo: true } : form.shipTo,
        bankDetails: form.bankDetails,
        notes: form.notes,
        items: totals.items,
      });

      toast.success("Invoice created successfully.");
      await onCreated();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to create invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-[28px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl">Create GST invoice</CardTitle>
        <p className="text-sm text-slate-500">
          Fill each section carefully. Every field is labelled so your team can generate invoices with confidence.
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={submitInvoice} className="space-y-8">
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Basic details</h3>
              <p className="text-sm text-slate-500">Invoice identifiers and GST supply information.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className={fieldClass}>
                <Label htmlFor="invoice-id">Invoice Number</Label>
                <Input id="invoice-id" value={loadingNumber ? "Generating..." : form.invoiceId} readOnly />
                <FieldHelp>Automatically generated based on financial year.</FieldHelp>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Input id="invoice-date" type="date" value={form.invoiceDate} onChange={(e) => updateField("invoiceDate", e.target.value)} />
                <FieldHelp>Date when invoice is created.</FieldHelp>
                <FieldError>{errors.invoiceDate}</FieldError>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="date-of-supply">Date of Supply</Label>
                <Input id="date-of-supply" type="date" value={form.dateOfSupply} onChange={(e) => updateField("dateOfSupply", e.target.value)} />
                <FieldHelp>Actual date of product or service delivery.</FieldHelp>
                <FieldError>{errors.dateOfSupply}</FieldError>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="invoice-state">State</Label>
                <Input id="invoice-state" placeholder="Enter business state" value={form.state} onChange={(e) => updateField("state", e.target.value)} />
                <FieldHelp>State where business is registered.</FieldHelp>
                <FieldError>{errors.state}</FieldError>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="place-of-supply">Place of Supply</Label>
                <Input id="place-of-supply" placeholder="Enter supply location" value={form.placeOfSupply} onChange={(e) => updateField("placeOfSupply", e.target.value)} />
                <FieldHelp>Location where goods or services are delivered.</FieldHelp>
                <FieldError>{errors.placeOfSupply}</FieldError>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="reverse-charge">Reverse Charge</Label>
                <select
                  id="reverse-charge"
                  value={form.reverseCharge ? "yes" : "no"}
                  onChange={(e) => updateField("reverseCharge", e.target.value === "yes")}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                <FieldHelp>Applicable only if reverse GST is used.</FieldHelp>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="transport-mode">Transport Mode</Label>
                <Input id="transport-mode" placeholder="By hand / Road / Courier" value={form.transportMode} onChange={(e) => updateField("transportMode", e.target.value)} />
                <FieldHelp>Choose how the goods are delivered.</FieldHelp>
                <FieldError>{errors.transportMode}</FieldError>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="vehicle-number">Vehicle Number</Label>
                <Input id="vehicle-number" placeholder="Enter vehicle number if available" value={form.vehicleNumber} onChange={(e) => updateField("vehicleNumber", e.target.value)} />
                <FieldHelp>Optional field for logistics tracking.</FieldHelp>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Customer source</h3>
              <p className="text-sm text-slate-500">Choose whether to use an existing customer or enter details manually.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                className={`rounded-2xl border px-4 py-4 text-left ${form.customerMode === "existing" ? "border-primary bg-primary/5" : "border-border bg-white"}`}
                onClick={() => updateField("customerMode", "existing")}
              >
                <p className="font-semibold text-slate-900">Use existing customer</p>
                <p className={helperClass}>Choose a registered customer from your system and link the invoice correctly.</p>
              </button>
              <button
                type="button"
                className={`rounded-2xl border px-4 py-4 text-left ${form.customerMode === "manual" ? "border-primary bg-primary/5" : "border-border bg-white"}`}
                onClick={() => updateField("customerMode", "manual")}
              >
                <p className="font-semibold text-slate-900">Enter customer manually</p>
                <p className={helperClass}>Use this when the customer is not registered in the portal yet.</p>
              </button>
            </div>
            {form.customerMode === "existing" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className={fieldClass}>
                  <Label htmlFor="customer-id">Existing Customer</Label>
                  <select
                    id="customer-id"
                    value={form.customerId}
                    onChange={(e) => handleCustomerSelection(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                  <FieldHelp>Select the registered customer for this invoice.</FieldHelp>
                  <FieldError>{errors.customerId}</FieldError>
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="booking-id">Linked Booking</Label>
                  <select
                    id="booking-id"
                    value={form.bookingId}
                    onChange={(e) => updateField("bookingId", e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Link booking (optional)</option>
                    {bookingOptions.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        {booking.issueType || "Booking"} - {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString("en-IN") : "No date"}
                      </option>
                    ))}
                  </select>
                  <FieldHelp>Optional link to the related booking for future reference.</FieldHelp>
                </div>
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Card className="border border-border/70 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Bill To</CardTitle>
                <p className="text-sm text-slate-500">Enter customer billing details. GSTIN is required for registered businesses.</p>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className={fieldClass}>
                  <Label htmlFor="bill-name">Name</Label>
                  <Input id="bill-name" placeholder="Enter customer full name" value={form.billTo.name} onChange={(e) => updateBillTo("name", e.target.value)} />
                  <FieldHelp>Customer or company name for billing.</FieldHelp>
                  <FieldError>{errors.billToName}</FieldError>
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="bill-address">Address</Label>
                  <Textarea id="bill-address" placeholder="Enter complete billing address" value={form.billTo.address} onChange={(e) => updateBillTo("address", e.target.value)} />
                  <FieldHelp>Complete billing address shown on the invoice.</FieldHelp>
                  <FieldError>{errors.billToAddress}</FieldError>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className={fieldClass}>
                    <Label htmlFor="bill-phone">Phone</Label>
                    <Input id="bill-phone" placeholder="Enter customer phone number" value={form.billTo.phone} onChange={(e) => updateBillTo("phone", e.target.value)} />
                    <FieldHelp>Phone number for invoice follow-up.</FieldHelp>
                    <FieldError>{errors.billToPhone}</FieldError>
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="bill-gstin">GSTIN</Label>
                    <Input id="bill-gstin" placeholder="Enter GSTIN if available" value={form.billTo.gstin} onChange={(e) => updateBillTo("gstin", e.target.value.toUpperCase())} />
                    <FieldHelp>Enter GSTIN for registered businesses.</FieldHelp>
                  </div>
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="bill-state">State</Label>
                  <Input id="bill-state" placeholder="Enter billing state" value={form.billTo.state} onChange={(e) => updateBillTo("state", e.target.value)} />
                  <FieldHelp>State used for GST billing rules.</FieldHelp>
                  <FieldError>{errors.billToState}</FieldError>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/70 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Ship To</CardTitle>
                    <p className="text-sm text-slate-500">Delivery details can match billing or be entered separately.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="same-as-bill"
                      checked={form.shipTo.sameAsBillTo}
                      onCheckedChange={(checked) => updateShipTo("sameAsBillTo", checked === true)}
                    />
                    <Label htmlFor="same-as-bill">Same as Bill To</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className={fieldClass}>
                  <Label htmlFor="ship-name">Name</Label>
                  <Input id="ship-name" placeholder="Enter shipping name" value={form.shipTo.name} disabled={form.shipTo.sameAsBillTo} onChange={(e) => updateShipTo("name", e.target.value)} />
                  <FieldHelp>Receiver name at the delivery location.</FieldHelp>
                  <FieldError>{errors.shipToName}</FieldError>
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="ship-address">Address</Label>
                  <Textarea id="ship-address" placeholder="Enter shipping address" value={form.shipTo.address} disabled={form.shipTo.sameAsBillTo} onChange={(e) => updateShipTo("address", e.target.value)} />
                  <FieldHelp>Delivery address where goods or service are supplied.</FieldHelp>
                  <FieldError>{errors.shipToAddress}</FieldError>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className={fieldClass}>
                    <Label htmlFor="ship-phone">Phone</Label>
                    <Input id="ship-phone" placeholder="Enter shipping contact number" value={form.shipTo.phone} disabled={form.shipTo.sameAsBillTo} onChange={(e) => updateShipTo("phone", e.target.value)} />
                    <FieldHelp>Contact number at the delivery site.</FieldHelp>
                    <FieldError>{errors.shipToPhone}</FieldError>
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="ship-gstin">GSTIN</Label>
                    <Input id="ship-gstin" placeholder="Enter GSTIN if different" value={form.shipTo.gstin} disabled={form.shipTo.sameAsBillTo} onChange={(e) => updateShipTo("gstin", e.target.value.toUpperCase())} />
                    <FieldHelp>Enter GSTIN only if the shipping party is GST-registered.</FieldHelp>
                  </div>
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="ship-state">State</Label>
                  <Input id="ship-state" placeholder="Enter shipping state" value={form.shipTo.state} disabled={form.shipTo.sameAsBillTo} onChange={(e) => updateShipTo("state", e.target.value)} />
                  <FieldHelp>State used to confirm intra-state or inter-state supply.</FieldHelp>
                  <FieldError>{errors.shipToState}</FieldError>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Product table</h3>
              <p className="text-sm text-slate-500">Add product rows with GST rates. Amounts and tax totals are calculated automatically.</p>
            </div>
            <div className="space-y-4">
              {form.items.map((item, index) => {
                const itemTotals = totals.items[index];
                return (
                  <Card key={index} className="border border-border/70 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className="text-base">Item {index + 1}</CardTitle>
                      {form.items.length > 1 ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => updateField("items", form.items.filter((_, itemIndex) => itemIndex !== index))}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      ) : null}
                    </CardHeader>
                    <CardContent className="grid gap-4 xl:grid-cols-3">
                      <div className={fieldClass}>
                        <Label htmlFor={`product-name-${index}`}>Product Name</Label>
                        <Input id={`product-name-${index}`} placeholder="e.g., Aquaguard RO System" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
                        <FieldHelp>Enter the product or service name exactly as it should appear on the invoice.</FieldHelp>
                        <FieldError>{errors[`item-${index}-description`]}</FieldError>
                      </div>
                      <div className={fieldClass}>
                        <Label htmlFor={`hsn-${index}`}>HSN Code</Label>
                        <Input id={`hsn-${index}`} placeholder="e.g., 85044010" value={item.hsnCode} onChange={(e) => updateItem(index, "hsnCode", e.target.value)} />
                        <FieldHelp>Enter the HSN code used for GST classification.</FieldHelp>
                      </div>
                      <div className={fieldClass}>
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input id={`quantity-${index}`} type="number" placeholder="Enter quantity" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} />
                        <FieldHelp>Enter the total quantity being billed.</FieldHelp>
                        <FieldError>{errors[`item-${index}-quantity`]}</FieldError>
                      </div>
                      <div className={fieldClass}>
                        <Label htmlFor={`rate-${index}`}>Rate</Label>
                        <Input id={`rate-${index}`} type="number" placeholder="Price per unit" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", e.target.value)} />
                        <FieldHelp>Enter the price per unit before GST.</FieldHelp>
                        <FieldError>{errors[`item-${index}-unitPrice`]}</FieldError>
                      </div>
                      <div className={fieldClass}>
                        <Label htmlFor={`cgst-${index}`}>CGST (%)</Label>
                        <Input id={`cgst-${index}`} type="number" placeholder="Enter CGST rate (e.g., 9)" value={item.cgstRate} onChange={(e) => updateItem(index, "cgstRate", e.target.value)} />
                        <FieldHelp>Enter percentage as per GST slab.</FieldHelp>
                        <FieldError>{errors[`item-${index}-cgstRate`]}</FieldError>
                      </div>
                      <div className={fieldClass}>
                        <Label htmlFor={`sgst-${index}`}>SGST (%)</Label>
                        <Input id={`sgst-${index}`} type="number" placeholder="Enter SGST rate (e.g., 9)" value={item.sgstRate} onChange={(e) => updateItem(index, "sgstRate", e.target.value)} />
                        <FieldHelp>Enter percentage as per GST slab.</FieldHelp>
                        <FieldError>{errors[`item-${index}-sgstRate`]}</FieldError>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Amount (Auto)</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(itemTotals?.amount || 0)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">CGST Amount (Auto)</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(itemTotals?.cgstAmount || 0)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">SGST Amount (Auto)</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(itemTotals?.sgstAmount || 0)}</p>
                      </div>
                      <div className="rounded-2xl bg-primary/5 p-4 xl:col-span-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-primary/70">Total (Auto)</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(itemTotals?.total || 0)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Button type="button" variant="outline" onClick={() => updateField("items", [...form.items, createEmptyItem()])}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product Row
            </Button>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border border-border/70 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Bank details and notes</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className={fieldClass}>
                    <Label htmlFor="bank-account-number">Bank Account Number</Label>
                    <Input id="bank-account-number" placeholder="Enter account number" value={form.bankDetails.accountNumber} onChange={(e) => setForm((current) => ({ ...current, bankDetails: { ...current.bankDetails, accountNumber: e.target.value } }))} />
                    <FieldHelp>Enter the bank account number to receive payment.</FieldHelp>
                    <FieldError>{errors.bankAccountNumber}</FieldError>
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="bank-ifsc">IFSC Code</Label>
                    <Input id="bank-ifsc" placeholder="e.g., SBIN0001234" value={form.bankDetails.ifscCode} onChange={(e) => setForm((current) => ({ ...current, bankDetails: { ...current.bankDetails, ifscCode: e.target.value.toUpperCase() } }))} />
                    <FieldHelp>Enter the IFSC code for the receiving bank branch.</FieldHelp>
                    <FieldError>{errors.bankIfscCode}</FieldError>
                  </div>
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="invoice-status">Invoice Status</Label>
                  <select
                    id="invoice-status"
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value as "generated" | "paid")}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="generated">Generated</option>
                    <option value="paid">Paid</option>
                  </select>
                  <FieldHelp>Choose current payment status for the invoice.</FieldHelp>
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="invoice-notes">Notes</Label>
                  <Textarea id="invoice-notes" placeholder="Enter any payment note or delivery remark" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
                  <FieldHelp>Optional note shown at the bottom of the invoice.</FieldHelp>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/70 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Invoice total</CardTitle>
                <p className="text-sm text-slate-500">Updated automatically whenever quantity, rate, or GST rates change.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total Before Tax</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totals.totalBeforeTax)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total CGST</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totals.totalCgst)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total SGST</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totals.totalSgst)}</span>
                </div>
                <div className="rounded-2xl bg-primary/5 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Grand Total</span>
                    <span className="text-2xl font-bold text-slate-950">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-border px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Amount in words</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{totals.amountInWords}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating invoice..." : "Create Invoice"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
