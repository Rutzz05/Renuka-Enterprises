import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { invoicesAPI } from "@/services/api";

export default function InvoicePageV2() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await invoicesAPI.getInvoice(id!);
        setInvoice(response.data);
      } catch (error) {
        console.error("Failed to fetch invoice", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-2xl font-bold">Invoice not found</h1>
          <Link to="/dashboard" className="mt-4 inline-block">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8fb_0%,#ffffff_45%,#eef5f1_100%)] print:bg-white">
      <section className="relative overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-95" />
        <div className="relative container py-10 text-white">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">Invoice</p>
              <h1 className="mt-4 text-4xl font-bold">{invoice.invoiceId}</h1>
              <p className="mt-3 text-base text-white/75">
                Issued on {new Date(invoice.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button className="bg-white text-primary hover:bg-white/90" onClick={() => window.print()}>
                <Download className="mr-2 h-4 w-4" />
                Save as PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-8 relative z-10 pb-14 print:mt-0 print:pb-0">
        <Card className="rounded-[32px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)] print:shadow-none">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col gap-8 border-b pb-8 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">Renuka Enterprises</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Service & product invoice</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Trusted Aquaguard and inverter service partner in Nashik. Thank you for choosing our team.
                </p>
              </div>
              <Badge className={invoice.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                {invoice.status}
              </Badge>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Billed to</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{invoice.customer?.name}</p>
                <p className="mt-2 text-sm text-slate-600">{invoice.customer?.email}</p>
                <p className="mt-1 text-sm text-slate-600">{invoice.customer?.phone}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Invoice details</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Invoice ID:</span> {invoice.invoiceId}</p>
                  <p><span className="font-semibold text-slate-900">Type:</span> {invoice.type}</p>
                  <p><span className="font-semibold text-slate-900">Due date:</span> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-IN") : "On receipt"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border">
              <div className="grid grid-cols-12 bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Unit</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {invoice.items.map((item: any, index: number) => (
                <div key={`${item.description}-${index}`} className="grid grid-cols-12 border-t px-5 py-4 text-sm">
                  <div className="col-span-6 font-medium text-slate-900">{item.description}</div>
                  <div className="col-span-2 text-center text-slate-600">{item.quantity}</div>
                  <div className="col-span-2 text-right text-slate-600">Rs. {item.unitPrice.toLocaleString("en-IN")}</div>
                  <div className="col-span-2 text-right font-semibold text-slate-900">Rs. {item.total.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 ml-auto max-w-sm rounded-3xl bg-primary/[0.04] p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">Rs. {invoice.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="font-semibold text-slate-900">Rs. {invoice.tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">Total</span>
                  <span className="text-2xl font-bold text-primary">Rs. {invoice.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8 rounded-3xl border border-dashed p-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Notes</p>
                <p className="mt-2 leading-6">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
