import html2pdf from 'html2pdf.js';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceId: string;
  date: string;
  status: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  notes?: string;
}

export const generateInvoicePDF = async (invoice: InvoiceData) => {
  const element = document.createElement('div');
  element.innerHTML = createInvoiceHTML(invoice);

  await html2pdf()
    .set({
      margin: 10,
      filename: `Invoice_${invoice.invoiceId}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    })
    .from(element)
    .save();
};

const createInvoiceHTML = (invoice: InvoiceData): string => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const statusColor = invoice.status === 'paid' ? '#10b981' : '#f59e0b';
  const statusBgColor = invoice.status === 'paid' ? '#d1fae5' : '#fef3c7';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; line-height: 1.6;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px;">
        <div>
          <div style="font-size: 32px; font-weight: bold; color: #0ea5e9; margin-bottom: 5px;">R</div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827;">Renuka Enterprises</h1>
          <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">Aquaguard & Inverter Services</p>
          <p style="margin: 3px 0; color: #6b7280; font-size: 12px;">Nashik, India | Phone: +91 9823021804</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 48px; font-weight: 300; color: #0ea5e9; letter-spacing: 1px;">INVOICE</div>
        </div>
      </div>

      <!-- Invoice Details Row -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; gap: 20px;">
        <!-- Left: Invoice Details -->
        <div style="flex: 1;">
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <p style="margin: 0; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Invoice Details</p>
            <div style="line-height: 1.8; font-size: 13px;">
              <p style="margin: 5px 0;">
                <span style="color: #6b7280;">Invoice ID:</span>
                <strong style="color: #111827;">${invoice.invoiceId}</strong>
              </p>
              <p style="margin: 5px 0;">
                <span style="color: #6b7280;">Date:</span>
                <strong style="color: #111827;">${formatDate(invoice.date)}</strong>
              </p>
              <p style="margin: 5px 0;">
                <span style="color: #6b7280;">Status:</span>
                <span style="background-color: ${statusBgColor}; color: ${statusColor}; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 11px; text-transform: uppercase; display: inline-block;">
                  ${invoice.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Customer Details -->
        <div style="flex: 1;">
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Bill To</p>
            <div style="line-height: 1.8; font-size: 13px;">
              <p style="margin: 5px 0; font-weight: 600; color: #111827;">${invoice.customer?.name || 'Customer'}</p>
              <p style="margin: 5px 0; color: #6b7280;">${invoice.customer?.email || 'No email available'}</p>
              <p style="margin: 5px 0; color: #6b7280;">${invoice.customer?.phone || 'No phone available'}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #111827; color: white;">
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none;">Description</th>
              <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none; width: 80px;">Quantity</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none; width: 100px;">Unit Price</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none; width: 100px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                <td style="padding: 12px; font-size: 13px; color: #111827; font-weight: 500;">${item.description}</td>
                <td style="padding: 12px; text-align: center; font-size: 13px; color: #6b7280;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; font-size: 13px; color: #6b7280;">${formatCurrency(item.unitPrice)}</td>
                <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600; color: #111827;">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px; background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 2px solid #0ea5e9;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bfdbfe;">
            <span style="color: #6b7280; font-size: 13px;">Subtotal</span>
            <span style="color: #111827; font-weight: 600; font-size: 13px;">${formatCurrency(invoice.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bfdbfe;">
            <span style="color: #6b7280; font-size: 13px;">Tax (18%)</span>
            <span style="color: #111827; font-weight: 600; font-size: 13px;">${formatCurrency(invoice.tax)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 14px; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.5px;">Total Amount</span>
            <span style="font-weight: 700; font-size: 18px; color: #0ea5e9;">${formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>

      ${
        invoice.notes
          ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Notes</p>
              <p style="margin: 0; font-size: 12px; color: #78350f; line-height: 1.6;">${invoice.notes}</p>
            </div>
          `
          : ''
      }

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 11px;">
          Thank you for choosing Renuka Enterprises!
        </p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 11px;">
          For queries, contact us at +91 9823021804 or email us
        </p>
        <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 10px; border-top: 1px solid #e5e7eb; padding-top: 10px;">
          This is a computer-generated document. No signature is required.
        </p>
      </div>
    </div>
  `;
};
