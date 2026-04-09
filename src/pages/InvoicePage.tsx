import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { invoicesAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Printer, Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';

const InvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  const handleDownload = () => alert('PDF download functionality would be implemented here');

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
              <Button onClick={handleDownload} className="bg-white/20 border-white/20 text-white hover:bg-white/30 gap-1.5">
                <Download className="w-4 h-4" /> PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl -mt-5 relative z-10 pb-12 print:mt-0 print:p-0">
        <Card className="border-0 shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
          {/* Paid Ribbon */}
          {isPaid && (
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
          )}
          {!isPaid && (
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          )}

          <CardContent className="p-8 md:p-10">
            {/* Company Header */}
            <div className="text-center mb-8 pb-6 border-b border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-xl">R</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Renuka Enterprises</h2>
              <p className="text-muted-foreground text-sm mt-1">Nashik's Trusted Service Partner</p>
              <p className="text-muted-foreground/60 text-xs">Aquaguard & Inverter Services</p>
            </div>

            {/* Invoice & Customer Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-muted/30 rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Invoice Details</p>
                <div className="space-y-2.5 text-sm">
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
                      className={`gap-1 ${isPaid
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

              <div className="bg-muted/30 rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Customer Details</p>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-semibold">{invoice.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-semibold">{invoice.customer?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-semibold">{invoice.customer?.phone || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Items</p>
              <div className="border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>
                {/* Rows */}
                {invoice.items.map((item: any, index: number) => (
                  <div key={index} className={`grid grid-cols-12 gap-4 px-5 py-4 text-sm ${index % 2 === 0 ? '' : 'bg-muted/20'} ${index < invoice.items.length - 1 ? 'border-b' : ''}`}>
                    <div className="col-span-5 font-medium">{item.name}</div>
                    <div className="col-span-2 text-center text-muted-foreground">{item.quantity}</div>
                    <div className="col-span-2 text-right text-muted-foreground">₹{item.price?.toLocaleString()}</div>
                    <div className="col-span-3 text-right font-semibold">₹{item.total?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="bg-primary/5 rounded-xl px-8 py-5 border border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary">₹{invoice.totalAmount?.toLocaleString()}</p>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Thank you for choosing Renuka Enterprises!</p>
              <p className="text-xs">For any queries, contact us at +91 98765 43210</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePage;