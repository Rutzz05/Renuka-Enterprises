import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { invoicesAPI } from "@/services/apiClient";
import { generateInvoicePDF } from "@/services/pdfGenerator";

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type Invoice = {
  _id: string;
  invoiceId: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: string;
  date: string;
};

export default function InvoicePageV3() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!id) {
        toast.error("Invoice not found.");
        navigate("/dashboard");
        return;
      }

      try {
        setLoading(true);
        const response = await invoicesAPI.getInvoice(id);
        setInvoice(response.data);
      } catch (error) {
        toast.error("Unable to load invoice details.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!invoice) {
      return;
    }

    try {
      setDownloading(true);
      await generateInvoicePDF(invoice);
      toast.success("Invoice PDF downloaded.");
    } catch (error) {
      toast.error("Unable to download PDF right now.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-dashed border-border px-4 py-16 text-center text-sm text-slate-500">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Invoice</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-950">{invoice.invoiceId}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Issued on {new Date(invoice.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Preparing PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <Card id="invoice-content" className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-slate-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Renuka Enterprises</p>
              <CardTitle className="mt-2 text-2xl">Billing statement</CardTitle>
            </div>
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-900">{invoice.customer?.name || "Customer"}</p>
              <p>{invoice.customer?.email || "No email available"}</p>
              <p>{invoice.customer?.phone || "No phone available"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="overflow-hidden rounded-2xl border border-border/70">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Rate</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={`${item.description}-${index}`} className="border-t border-border/60">
                    <td className="px-4 py-3 text-slate-700">{item.description}</td>
                    <td className="px-4 py-3 text-slate-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-700">Rs. {item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      Rs. {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto max-w-sm space-y-3 rounded-2xl border border-border/70 bg-slate-50 p-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>Rs. {invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Tax</span>
              <span>Rs. {invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-slate-950">
              <span>Total</span>
              <span>Rs. {invoice.totalAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              Status: {invoice.status}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
