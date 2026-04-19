import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { invoicesAPI } from '../services/api';
import { generateInvoicePDF } from '../services/pdfGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Printer, Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';

const InvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const invoiceContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await invoicesAPI.getInvoice(id!);
        setInvoice(response.data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvoice();
  }, [id]);

  const handlePrint = () => window.print();
  
  const handleDownload = async () => {
    if (!invoiceContentRef.current || !invoice) return;
    
    try {
      setDownloading(true);
      const element = invoiceContentRef.current;
      await generateInvoicePDF(element, `Invoice_${invoice.invoiceId}`);
    } catch (error: any) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-1">Invoice Not Found</h2>
          <p className="text-muted-foreground text-sm mb-4">The invoice you're looking for doesn't exist.</p>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/[0.03]">
      {/* Hero */}
      <div className="relative overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-95" />
        <div className="relative container py-8 md:py-10">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white/90 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold" style={{ fontSize: '1.5rem', lineHeight: '2rem' }}>Invoice {invoice.invoiceId}</h1>
                <p className="text-white/50 text-sm">View and manage your invoice</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-1.5">
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button onClick={handleDownload} disabled={downloading} className="bg-white/20 border-white/20 text-white hover:bg-white/30 gap-1.5">
                <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'PDF'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl -mt-5 relative z-10 pb-12 print:mt-0 print:p-0 print:max-w-full print:container">
        <Card className="border-0 shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200 print:overflow-visible">
          {/* Paid Ribbon */}
          {isPaid && (
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
          )}
          {!isPaid && (
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          )}

          <CardContent ref={invoiceContentRef} className=\"p-8 md:p-10 print:p-2 print:m-0 print:overflow-hidden\" style={{ height: 'auto' }}>
            {/* Company Header */}
            <div className=\"text-center mb-8 pb-6 border-b border-dashed print:mb-3 print:pb-2 print:text-sm\">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-xl">R</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Renuka Enterprises</h2>
              <p className="text-muted-foreground text-sm mt-1">Nashik's Trusted Service Partner</p>
              <p className="text-muted-foreground/60 text-xs">Aquaguard & Inverter Services</p>
            </div>

            {/* Invoice & Customer Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8 print:gap-3 print:mb-4">
              <div className="bg-muted/30 rounded-xl p-5 print:p-2 print:rounded-sm print:border print:border-gray-300">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 print:mb-1 print:text-[10px]">Invoice Details</p>
                <div className="space-y-2.5 text-sm print:space-y-1 print:text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice ID</span>
                    <span className="font-semibold font-mono">{invoice.invoiceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold">{new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      className={`gap-1 print:text-[10px] print:px-1.5 print:py-0.5 ${isPaid
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                      } border`}
                    >
                      {isPaid && <CheckCircle2 className="w-3 h-3" />}
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-5 print:p-2 print:rounded-sm print:border print:border-gray-300">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 print:mb-1 print:text-[10px]">Customer Details</p>
                <div className="space-y-2.5 text-sm print:space-y-1 print:text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-semibold">{invoice.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-semibold text-[12px]">{invoice.customer?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-semibold">{invoice.customer?.phone || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 print:mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 print:mb-1.5 print:text-[10px]">Items</p>
              <div className="border rounded-xl overflow-hidden print:rounded-sm">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground print:gap-1 print:px-2 print:py-1.5 print:text-[9px]">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>
                {/* Rows */}
                {invoice.items.map((item: any, index: number) => (
                  <div key={index} className={`grid grid-cols-12 gap-4 px-5 py-4 text-sm print:gap-1 print:px-2 print:py-1.5 print:text-[10px] ${index % 2 === 0 ? '' : 'bg-muted/20'} ${index < invoice.items.length - 1 ? 'border-b' : ''}`}>
                    <div className="col-span-5 font-medium">{item.description || item.name}</div>
                    <div className="col-span-2 text-center text-muted-foreground">{item.quantity}</div>
                    <div className="col-span-2 text-right text-muted-foreground">₹{((item.unitPrice || item.price) || 0).toLocaleString()}</div>
                    <div className="col-span-3 text-right font-semibold">₹{(item.total || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-8 print:mb-3">
              <div className="bg-primary/5 rounded-xl px-8 py-5 border border-primary/10 print:rounded-sm print:px-3 print:py-2 print:border-gray-300">
                <p className="text-xs text-muted-foreground mb-1 print:text-[9px]">Total Amount</p>
                <p className="text-3xl font-bold text-primary print:text-lg">₹{invoice.totalAmount?.toLocaleString()}</p>
              </div>
            </div>

            <Separator className="mb-6 print:mb-2" />

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground space-y-1 print:text-xs print:space-y-0.5">
              <p className="font-medium">Thank you for choosing Renuka Enterprises!</p>
              <p className="text-xs print:text-[9px]">For any queries, contact us at +91 9823021804</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePage;
