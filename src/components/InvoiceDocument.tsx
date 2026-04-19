type InvoiceItem = {
  description: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type InvoiceCustomerDetails = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type InvoiceDocumentData = {
  invoiceId: string;
  date: string;
  dueDate?: string | null;
  status: string;
  customer?: InvoiceCustomerDetails;
  customerDetails?: InvoiceCustomerDetails;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  notes?: string;
};

const COMPANY = {
  name: "RENUKA ENTERPRISES",
  addressLine1: "06, Megh Society Near Raja Shivaji Kendra Tidake Colony",
  addressLine2: "Nashik, Maharashtra. PIN: 422002",
  phone: "+91 98230 21804",
  gstin: "27AFDPN6213J1ZF",
  state: "Maharashtra",
};

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const numberToWords = (value: number) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertBelowThousand = (num: number): string => {
    if (num < 20) return ones[num];
    if (num < 100) return `${tens[Math.floor(num / 10)]}${num % 10 ? ` ${ones[num % 10]}` : ""}`.trim();
    return `${ones[Math.floor(num / 100)]} Hundred${num % 100 ? ` ${convertBelowThousand(num % 100)}` : ""}`.trim();
  };

  const integer = Math.round(value);
  if (integer === 0) return "Zero";

  const crore = Math.floor(integer / 10000000);
  const lakh = Math.floor((integer % 10000000) / 100000);
  const thousand = Math.floor((integer % 100000) / 1000);
  const remainder = integer % 1000;

  return [
    crore ? `${convertBelowThousand(crore)} Crore` : "",
    lakh ? `${convertBelowThousand(lakh)} Lakh` : "",
    thousand ? `${convertBelowThousand(thousand)} Thousand` : "",
    remainder ? convertBelowThousand(remainder) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
};

export default function InvoiceDocument({ invoice }: { invoice: InvoiceDocumentData }) {
  const customer = invoice.customerDetails || invoice.customer || {};
  const cgstAmount = invoice.tax / 2;
  const sgstAmount = invoice.tax / 2;

  return (
    <div className="invoice-sheet bg-white p-6 text-[12px] text-slate-900">
      <div className="border border-slate-400">
        <div className="grid grid-cols-[110px_1fr_140px] border-b border-slate-400">
          <div className="flex min-h-[74px] items-center justify-center border-r border-slate-400 text-center text-[11px]">
            <div>
              <p className="font-semibold">Company</p>
              <p>Logo</p>
            </div>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-[11px] font-semibold tracking-[0.25em]">GST INVOICE</p>
            <h1 className="mt-2 text-[28px] font-bold tracking-wide">{COMPANY.name}</h1>
            <p className="mt-2 text-[13px]">{COMPANY.addressLine1}</p>
            <p className="text-[13px]">{COMPANY.addressLine2}</p>
            <p className="mt-1 text-[13px]">Tel: {COMPANY.phone}</p>
            <p className="text-[13px]">GST No. {COMPANY.gstin}</p>
          </div>
          <div className="flex min-h-[74px] items-center justify-center border-l border-slate-400 text-center text-[11px]">
            <div>
              <p>Original for</p>
              <p>Recipient</p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-400 bg-sky-100 py-2 text-center text-[30px] font-semibold">
          Tax Invoice
        </div>

        <div className="grid grid-cols-2 border-b border-slate-400 text-[12px]">
          <div className="space-y-1 border-r border-slate-400 px-3 py-3">
            <p>Invoice No: {invoice.invoiceId}</p>
            <p>Invoice date: {formatDate(invoice.date)}</p>
            <p>Reverse Charge (Y/N): N</p>
            <p>State: {COMPANY.state}</p>
          </div>
          <div className="space-y-1 px-3 py-3">
            <p>Transport Mode: By hand</p>
            <p>Vehicle number:</p>
            <p>Date of Supply: {formatDate(invoice.date)}</p>
            <p>Place of Supply: Nashik</p>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-slate-400">
          <div className="border-r border-slate-400">
            <div className="border-b border-slate-400 bg-sky-100 px-3 py-1 text-center font-semibold">Bill to Party</div>
            <div className="space-y-2 px-3 py-3">
              <p>Name: {customer.name || "Customer"}</p>
              <p>Address: {customer.address || "-"}</p>
              <p>Phone: {customer.phone || "-"}</p>
              <p>GSTIN: -</p>
              <p>State: {COMPANY.state.toUpperCase()}</p>
            </div>
          </div>
          <div>
            <div className="border-b border-slate-400 bg-sky-100 px-3 py-1 text-center font-semibold">Ship to Party</div>
            <div className="space-y-2 px-3 py-3">
              <p>Name: {customer.name || "Customer"}</p>
              <p>Address: {customer.address || "Nashik City"}</p>
              <p>Phone: {customer.phone || "-"}</p>
              <p>GSTIN: -</p>
              <p>State: {COMPANY.state}</p>
            </div>
          </div>
        </div>

        <table className="w-full border-b border-slate-400 invoice-table">
          <thead>
            <tr className="bg-sky-100 text-[11px]">
              <th className="border-r border-slate-400 px-2 py-2">S. No.</th>
              <th className="border-r border-slate-400 px-2 py-2 text-left">Product Description</th>
              <th className="border-r border-slate-400 px-2 py-2">HSN Code</th>
              <th className="border-r border-slate-400 px-2 py-2">Qty</th>
              <th className="border-r border-slate-400 px-2 py-2">Rate</th>
              <th className="border-r border-slate-400 px-2 py-2">Amount</th>
              <th className="border-r border-slate-400 px-2 py-2">CGST</th>
              <th className="border-r border-slate-400 px-2 py-2">SGST</th>
              <th className="px-2 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const itemTaxShare = invoice.subtotal > 0 ? (item.total / invoice.subtotal) * invoice.tax : 0;
              const itemCgst = itemTaxShare / 2;
              const itemSgst = itemTaxShare / 2;
              const itemGrandTotal = item.total + itemTaxShare;

              return (
                <tr key={`${item.description}-${index}`} className="align-top">
                  <td className="border-r border-t border-slate-300 px-2 py-2 text-center">{index + 1}</td>
                  <td className="border-r border-t border-slate-300 px-2 py-2">
                    <div className="whitespace-pre-line">{item.description}</div>
                  </td>
                  <td className="border-r border-t border-slate-300 px-2 py-2 text-center">{item.hsnCode || "-"}</td>
                  <td className="border-r border-t border-slate-300 px-2 py-2 text-center">{item.quantity}</td>
                  <td className="border-r border-t border-slate-300 px-2 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border-r border-t border-slate-300 px-2 py-2 text-right">{formatCurrency(item.total)}</td>
                  <td className="border-r border-t border-slate-300 px-2 py-2 text-right">{formatCurrency(itemCgst)}</td>
                  <td className="border-r border-t border-slate-300 px-2 py-2 text-right">{formatCurrency(itemSgst)}</td>
                  <td className="border-t border-slate-300 px-2 py-2 text-right">{formatCurrency(itemGrandTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="grid grid-cols-[1.1fr_0.9fr] border-b border-slate-400">
          <div className="border-r border-slate-400 px-3 py-3">
            <div className="grid gap-2">
              <div className="grid grid-cols-[190px_1fr] gap-3">
                <span>Total Invoice amount in words</span>
                <span className="font-medium">Rs:-{numberToWords(invoice.totalAmount)} Rupees only</span>
              </div>
              <div className="grid grid-cols-[190px_1fr] gap-3">
                <span>Terms &amp; conditions</span>
                <div className="space-y-1">
                  <p>1. Total payment due in 30 days</p>
                  <p>2. Please include the invoice number on your check</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 py-3">
            <div className="grid grid-cols-[1fr_120px] gap-y-2">
              <span>Total Amount before Tax</span>
              <span className="text-right">{formatCurrency(invoice.subtotal)}</span>
              <span>Add: CGST + SGST</span>
              <span className="text-right">{formatCurrency(cgstAmount + sgstAmount)}</span>
              <span>GST on Reverse Charge</span>
              <span className="text-right">0.00</span>
              <span>Round OFF</span>
              <span className="text-right">0.00</span>
              <span className="border-t border-slate-400 pt-2 font-semibold">Total</span>
              <span className="border-t border-slate-400 pt-2 text-right font-semibold">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_220px]">
          <div className="border-r border-slate-400 px-3 py-4">
            <p className="font-semibold">Bank Details</p>
            <p className="mt-2">Bank A/C: --------------</p>
            <p>Bank IFSC: ABHY0065115</p>
            <p className="mt-6 text-[11px]">Thank You For Your Business!</p>
          </div>
          <div className="px-3 py-4">
            <p className="text-right">For</p>
            <p className="mt-3 text-right font-semibold">{COMPANY.name}</p>
            <p className="mt-10 text-right text-[11px]">Common Seal</p>
            <p className="mt-2 text-right text-[11px]">Authorised signatory</p>
            <p className="mt-4 text-right text-[10px]">
              Certified that the particulars given above are true and correct
            </p>
          </div>
        </div>

        {invoice.notes ? (
          <div className="border-t border-slate-400 px-3 py-3 text-[11px]">
            <span className="font-semibold">Notes: </span>
            {invoice.notes}
          </div>
        ) : null}
      </div>
    </div>
  );
}
