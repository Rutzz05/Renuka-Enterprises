import { formatCurrency, numberToWords } from "@/lib/invoice";

type InvoiceItem = {
  description: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
  cgstRate?: number;
  sgstRate?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  total: number;
};

type InvoiceParty = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  state?: string;
};

export type InvoiceDocumentData = {
  invoiceId: string;
  invoiceDate?: string;
  date?: string;
  dateOfSupply?: string;
  status: string;
  state?: string;
  placeOfSupply?: string;
  reverseCharge?: boolean;
  transportMode?: string;
  vehicleNumber?: string;
  customer?: InvoiceParty;
  customerDetails?: InvoiceParty;
  billTo?: InvoiceParty;
  shipTo?: InvoiceParty & { sameAsBillTo?: boolean };
  items: InvoiceItem[];
  totalBeforeTax?: number;
  totalCgst?: number;
  totalSgst?: number;
  roundOff?: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  amountInWords?: string;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
  };
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

export default function InvoiceDocument({ invoice }: { invoice: InvoiceDocumentData }) {
  const billTo = invoice.billTo || invoice.customerDetails || invoice.customer || {};
  const shipTo = invoice.shipTo || billTo;
  const totalBeforeTax = invoice.totalBeforeTax ?? invoice.subtotal;
  const totalCgst = invoice.totalCgst ?? invoice.tax / 2;
  const totalSgst = invoice.totalSgst ?? invoice.tax / 2;
  const invoiceDate = invoice.invoiceDate || invoice.date;
  const amountInWords = invoice.amountInWords || numberToWords(invoice.totalAmount);

  return (
    <div className="invoice-container invoice-sheet bg-white p-2 text-[11px] text-slate-900">
      <div className="border border-slate-400">
        <div className="grid grid-cols-[1fr_110px] border-b border-slate-400">
          <div className="px-2.5 py-1.5 text-center">
            <p className="text-[10px] font-semibold tracking-[0.2em]">GST INVOICE</p>
            <h1 className="mt-0.5 text-[18px] font-bold tracking-wide">{COMPANY.name}</h1>
            <p className="mt-0.5 text-[10px] leading-tight">{COMPANY.addressLine1}</p>
            <p className="text-[10px] leading-tight">{COMPANY.addressLine2}</p>
            <p className="mt-0.5 text-[10px]">Tel: {COMPANY.phone}</p>
            <p className="text-[10px]">GST: {COMPANY.gstin}</p>
          </div>
          <div className="flex items-center justify-center border-l border-slate-400 px-1.5 text-center text-[9px]">
            <div className="leading-tight">
              <p>Original</p>
              <p>for</p>
              <p>Recipient</p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-400 bg-sky-100 py-1 text-center text-[18px] font-semibold leading-tight">
          Tax Invoice
        </div>

        <div className="grid grid-cols-2 border-b border-slate-400 text-[10px] leading-4">
          <div className="space-y-0.25 border-r border-slate-400 px-2 py-1.5">
            <p className="font-semibold">Invoice: {invoice.invoiceId}</p>
            <p>Date: {formatDate(invoiceDate)}</p>
            <p>Reverse: {invoice.reverseCharge ? "Y" : "N"}</p>
            <p>State: {invoice.state || COMPANY.state}</p>
          </div>
          <div className="space-y-0.25 px-2 py-1.5">
            <p>Mode: {invoice.transportMode || "By hand"}</p>
            <p>Vehicle: {invoice.vehicleNumber || "-"}</p>
            <p>Supply: {formatDate(invoice.dateOfSupply || invoiceDate)}</p>
            <p>Place: {invoice.placeOfSupply || "Nashik"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-slate-400 text-[10px]">
          <div className="border-r border-slate-400">
            <div className="border-b border-slate-400 bg-sky-100 px-2 py-0.5 text-center font-semibold">Bill to</div>
            <div className="space-y-0.5 px-2 py-1 leading-tight">
              <p><span className="font-semibold">N:</span> {billTo.name || "Customer"}</p>
              <p><span className="font-semibold">A:</span> {billTo.address || "-"}</p>
              <p><span className="font-semibold">P:</span> {billTo.phone || "-"}</p>
              <p><span className="font-semibold">G:</span> {billTo.gstin || "-"}</p>
              <p><span className="font-semibold">S:</span> {billTo.state || COMPANY.state.toUpperCase()}</p>
            </div>
          </div>
          <div>
            <div className="border-b border-slate-400 bg-sky-100 px-2 py-0.5 text-center font-semibold">Ship to</div>
            <div className="space-y-0.5 px-2 py-1 leading-tight">
              <p><span className="font-semibold">N:</span> {shipTo.name || "Customer"}</p>
              <p><span className="font-semibold">A:</span> {shipTo.address || "-"}</p>
              <p><span className="font-semibold">P:</span> {shipTo.phone || "-"}</p>
              <p><span className="font-semibold">G:</span> {shipTo.gstin || "-"}</p>
              <p><span className="font-semibold">S:</span> {shipTo.state || COMPANY.state}</p>
            </div>
          </div>
        </div>

        <table className="w-full border-b border-slate-400 invoice-table">
          <thead>
            <tr className="bg-sky-100 text-[9px] leading-tight">
              <th className="border-r border-slate-400 px-1 py-1">Sl</th>
              <th className="border-r border-slate-400 px-1 py-1 text-left">Description</th>
              <th className="border-r border-slate-400 px-1 py-1">HSN</th>
              <th className="border-r border-slate-400 px-1 py-1">Qty</th>
              <th className="border-r border-slate-400 px-1 py-1">Rate</th>
              <th className="border-r border-slate-400 px-1 py-1">Amt</th>
              <th className="border-r border-slate-400 px-1 py-1">CGST</th>
              <th className="border-r border-slate-400 px-1 py-1">SGST</th>
              <th className="px-1 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const itemAmount = item.amount ?? item.quantity * item.unitPrice;
              const itemCgst = item.cgstAmount ?? 0;
              const itemSgst = item.sgstAmount ?? 0;
              const itemGrandTotal = item.total;

              return (
                <tr key={`${item.description}-${index}`} className="align-top text-[9px]">
                  <td className="border-r border-t border-slate-300 px-1 py-1 text-center">{index + 1}</td>
                  <td className="border-r border-t border-slate-300 px-1 py-1">
                    <div className="whitespace-pre-line leading-tight">{item.description}</div>
                  </td>
                  <td className="border-r border-t border-slate-300 px-1 py-1 text-center">{item.hsnCode || "-"}</td>
                  <td className="border-r border-t border-slate-300 px-1 py-1 text-center">{item.quantity}</td>
                  <td className="border-r border-t border-slate-300 px-1 py-1 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border-r border-t border-slate-300 px-1 py-1 text-right">{formatCurrency(itemAmount)}</td>
                  <td className="border-r border-t border-slate-300 px-1 py-1 text-right">{formatCurrency(itemCgst)}</td>
                  <td className="border-r border-t border-slate-300 px-1 py-1 text-right">{formatCurrency(itemSgst)}</td>
                  <td className="border-t border-slate-300 px-1 py-1 text-right">{formatCurrency(itemGrandTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="grid grid-cols-[1.1fr_0.9fr] border-b border-slate-400 text-[9px]">
          <div className="border-r border-slate-400 px-2 py-1.5">
            <div className="grid gap-1">
              <div className="grid grid-cols-[130px_1fr] gap-2">
                <span className="font-semibold">Amt (Words):</span>
                <span className="font-medium">Rs:-{amountInWords}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-2">
                <span className="font-semibold">T&C:</span>
                <div className="space-y-0.5 leading-tight">
                  <p>1. Payment due in 30 days</p>
                  <p>2. Include invoice number on payment</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-2 py-1.5">
            <div className="grid grid-cols-[1fr_80px] gap-y-1">
              <span>Before Tax</span>
              <span className="text-right">{formatCurrency(totalBeforeTax)}</span>
              <span>CGST+SGST</span>
              <span className="text-right">{formatCurrency(totalCgst + totalSgst)}</span>
              <span>Rev Charge</span>
              <span className="text-right">0.00</span>
              <span>Round Off</span>
              <span className="text-right">{formatCurrency(invoice.roundOff || 0)}</span>
              <span className="border-t border-slate-400 pt-1 font-semibold">Total</span>
              <span className="border-t border-slate-400 pt-1 text-right font-semibold">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_180px] text-[9px]">
          <div className="border-r border-slate-400 px-2 py-1.5">
            <p className="font-semibold">Bank Details</p>
            <p className="mt-1 leading-tight">A/C: {invoice.bankDetails?.accountNumber || "-----------"}</p>
            <p className="leading-tight">IFSC: {invoice.bankDetails?.ifscCode || "ABHY0065115"}</p>
            <p className="mt-2 text-[9px] font-medium">Thank You!</p>
          </div>
          <div className="px-2 py-1.5 text-right leading-tight">
            <p className="text-[8px]">For</p>
            <p className="mt-1 font-semibold text-[9px]">{COMPANY.name}</p>
            <p className="mt-3 text-[8px]">Seal</p>
            <p className="mt-0.5 text-[8px]">Auth. Sign</p>
            <p className="mt-1 text-[7px] leading-tight">
              Certified that above particulars are true &amp; correct
            </p>
          </div>
        </div>

        {invoice.notes ? (
          <div className="border-t border-slate-400 px-2 py-1.5 text-[9px]">
            <span className="font-semibold">Notes: </span>
            {invoice.notes}
          </div>
        ) : null}
      </div>
    </div>
  );
}
