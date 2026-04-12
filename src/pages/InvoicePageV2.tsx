import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, Printer, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { invoicesAPI } from "@/services/api";
import { generateInvoicePDF } from "@/services/pdfGenerator";

export default function InvoicePageV2() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

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

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setGeneratingPDF(true);
    try {
      await generateInvoicePDF(invoice);
    } catch (error) {
      console.error("Failed to download PDF", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/[0.03]">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-3 text-slate-600 font-medium">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/[0.03]">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
            <FileText className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Invoice not found</h1>
          <p className="mt-2 text-slate-600">The invoice you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="mt-6 inline-block">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8fb_0%,#ffffff_45%,#eef5f1_100%)] print:bg-white">
      {/* Hero Section */}
      <section className="hero relative overflow-hidden print:hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/10" />
        <div className="relative container py-12 text-primary-foreground z-10">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">Invoice</p>
              <h1 className="mt-4 text-4xl font-bold">{invoice.invoiceId}</h1>
              <p className="mt-3 text-base text-primary-foreground/85">
                Issued on {new Date(invoice.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 gap-2 transition-all hover:scale-105"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 transition-all hover:scale-105 disabled:opacity-50"
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{generatingPDF ? "Generating..." : "Download PDF"}</span>
                <span className="sm:hidden">{generatingPDF ? "..." : "PDF"}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Content */}
      <section className="container -mt-8 relative z-10 pb-14 print:mt-0 print:pb-0">
        <Card className="rounded-[32px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)] print:shadow-none">
          <CardContent className="p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-col gap-8 border-b pb-8 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">Renuka Enterprises</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Service & Product Invoice</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Trusted Aquaguard and inverter service partner in Nashik. Thank you for choosing our team.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={invoice.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200 border" : "bg-amber-50 text-amber-700 border-amber-200 border"}>
                  {invoice.status === "paid" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Customer & Invoice Details */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 border border-slate-200/50 transition-all hover:shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Billed to</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{invoice.customer?.name}</p>
                <p className="mt-2 text-sm text-slate-600">{invoice.customer?.email}</p>
                <p className="mt-1 text-sm text-slate-600">{invoice.customer?.phone}</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 border border-slate-200/50 transition-all hover:shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Invoice details</p>
                <div className="mt-3 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Invoice ID:</span>
                    <span className="font-mono font-semibold text-slate-900">{invoice.invoiceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-semibold text-slate-900 capitalize">{invoice.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Issue Date:</span>
                    <span className="font-semibold text-slate-900">{new Date(invoice.date).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
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
                  <div className="col-span-2 text-right text-slate-600">Rs. {(item.unitPrice || 0).toLocaleString("en-IN")}</div>
                  <div className="col-span-2 text-right font-semibold text-slate-900">Rs. {(item.total || 0).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-8 ml-auto max-w-sm rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 border border-primary/20">
              <div className="flex items-center justify-between text-sm pb-3 border-b border-primary/10">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">Rs. {invoice.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm pb-3 border-b border-primary/10">
                <span className="text-slate-600">Tax (18%)</span>
                <span className="font-semibold text-slate-900">Rs. {invoice.tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">Rs. {invoice.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/50 p-5 text-sm text-slate-600">
                <p className="font-semibold text-amber-900">📝 Notes</p>
                <p className="mt-2 leading-6 text-amber-800">{invoice.notes}</p>
              </div>
            )}

            {/* Thank You */}
            <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-emerald-900">Thank you for your business!</p>
              <p className="mt-1 text-xs text-emerald-700">Contact us at +91 98765 43210 for any queries</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
