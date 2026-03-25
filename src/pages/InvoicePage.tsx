import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { invoicesAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('PDF download functionality would be implemented here');
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!invoice) {
    return <div className="container py-8">Invoice not found</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoice</h1>
        <div className="space-x-2">
          <Button onClick={handlePrint} variant="outline">
            Print
          </Button>
          <Button onClick={handleDownload}>
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Renuka Enterprises</CardTitle>
          <CardDescription>
            Nashik's Trusted Service Partner<br />
            Aquaguard & Inverter Services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Invoice Details</h3>
              <p><strong>Invoice ID:</strong> {invoice.invoiceId}</p>
              <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>{invoice.status}</Badge></p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <p><strong>Name:</strong> {invoice.customer.name}</p>
              <p><strong>Email:</strong> {invoice.customer.email}</p>
              <p><strong>Phone:</strong> {invoice.customer.phone}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-2">
              {invoice.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p>₹{item.price} × {item.quantity}</p>
                    <p className="font-medium">₹{item.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-lg font-bold">Total: ₹{invoice.totalAmount}</p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>Thank you for choosing Renuka Enterprises!</p>
            <p>For any queries, contact us at +91 98765 43210</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePage;