import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import InvoiceDocument, { InvoiceDocumentData } from "@/components/InvoiceDocument";
import { invoicesAPI } from "@/services/apiClient";
import { generateInvoicePDF } from "@/services/pdfGenerator";

type Invoice = InvoiceDocumentData & {
  _id: string;
};

export default function InvoicePageV3() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement | null>(null);
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
      if (!invoiceRef.current) {
        throw new Error("Invoice content not found");
      }
      const invoiceDate = invoice.invoiceDate || invoice.date || new Date().toISOString();
      await generateInvoicePDF(invoiceRef.current, `${invoice.invoiceId}_${new Date(invoiceDate).toISOString().split("T")[0]}`);
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
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="invoice-toolbar flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Invoice</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-950">{invoice.invoiceId}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Issued on {new Date(invoice.invoiceDate || invoice.date || new Date().toISOString()).toLocaleDateString()}
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

      <div ref={invoiceRef} id="invoice-content" className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm print:border-0 print:p-0 print:shadow-none">
        <InvoiceDocument invoice={invoice} />
      </div>
    </div>
  );
}
