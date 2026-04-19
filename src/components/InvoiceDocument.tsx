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
  phone?: string;
  address?: string;
  gstin?: string;
  state?: string;
};

export type InvoiceDocumentData = {
  invoiceId: string;
  invoiceDate?: string;
  dateOfSupply?: string;
  state?: string;
  placeOfSupply?: string;
  reverseCharge?: boolean;
  transportMode?: string;
  vehicleNumber?: string;
  billTo?: InvoiceParty;
  shipTo?: InvoiceParty;
  items: InvoiceItem[];
  totalBeforeTax: number;
  totalCgst: number;
  totalSgst: number;
  roundOff?: number;
  totalAmount: number;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
  };
};

const COMPANY = {
  name: "RENUKA ENTERPRISES",
  address1: "06, Megh Society Near Raja Shivaji Kendra Tidake Colony",
  address2: "Nashik, Maharashtra - 422002",
  phone: "+91 9823021804",
  gstin: "27AFDPN6213J1ZF",
  state: "Maharashtra",
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN");
};

export default function InvoiceDocument({
  invoice,
}: {
  invoice: InvoiceDocumentData;
}) {
  const bill = invoice.billTo || {};
  const ship = invoice.shipTo || bill;

  const amountInWords = numberToWords(invoice.totalAmount);

  return (
    <div className="invoice-container bg-white text-[11px] text-black">
      <div className="border border-black">

        {/* HEADER */}
        <div className="text-center border-b border-black py-2">
          <p className="text-[10px] font-semibold tracking-widest">
            GST INVOICE
          </p>
          <h1 className="text-[22px] font-bold">{COMPANY.name}</h1>
          <p>{COMPANY.address1}</p>
          <p>{COMPANY.address2}</p>
          <p>Phone: {COMPANY.phone}</p>
          <p>GSTIN: {COMPANY.gstin}</p>
        </div>

        {/* TITLE */}
        <div className="border-b border-black text-center py-1 font-semibold text-[16px] bg-gray-100">
          Tax Invoice
        </div>

        {/* TOP DETAILS */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="p-2 border-r border-black">
            <p>Invoice No: {invoice.invoiceId}</p>
            <p>Invoice Date: {formatDate(invoice.invoiceDate)}</p>
            <p>Reverse Charge: {invoice.reverseCharge ? "Yes" : "No"}</p>
            <p>State: {invoice.state || COMPANY.state}</p>
          </div>

          <div className="p-2">
            <p>Transport Mode: {invoice.transportMode || "By hand"}</p>
            <p>Vehicle Number: {invoice.vehicleNumber || "-"}</p>
            <p>Date of Supply: {formatDate(invoice.dateOfSupply)}</p>
            <p>Place of Supply: {invoice.placeOfSupply || "Nashik"}</p>
          </div>
        </div>

        {/* BILL TO / SHIP TO */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black">
            <div className="bg-gray-100 text-center font-semibold border-b border-black">
              Bill To Party
            </div>
            <div className="p-2">
              <p>Name: {bill.name}</p>
              <p>Address: {bill.address}</p>
              <p>Phone: {bill.phone}</p>
              <p>GSTIN: {bill.gstin || "-"}</p>
              <p>State: {bill.state || COMPANY.state}</p>
            </div>
          </div>

          <div>
            <div className="bg-gray-100 text-center font-semibold border-b border-black">
              Ship To Party
            </div>
            <div className="p-2">
              <p>Name: {ship.name}</p>
              <p>Address: {ship.address}</p>
              <p>Phone: {ship.phone}</p>
              <p>GSTIN: {ship.gstin || "-"}</p>
              <p>State: {ship.state || COMPANY.state}</p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full border-b border-black text-[10px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-1">S.No</th>
              <th className="border px-1 text-left">Product Description</th>
              <th className="border px-1">HSN</th>
              <th className="border px-1">Qty</th>
              <th className="border px-1">Rate</th>
              <th className="border px-1">Amount</th>
              <th className="border px-1">CGST</th>
              <th className="border px-1">SGST</th>
              <th className="border px-1">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => {
              const amount = item.amount ?? item.quantity * item.unitPrice;

              return (
                <tr key={i}>
                  <td className="border px-1 text-center">{i + 1}</td>
                  <td className="border px-1">{item.description}</td>
                  <td className="border px-1 text-center">
                    {item.hsnCode || "-"}
                  </td>
                  <td className="border px-1 text-center">
                    {item.quantity}
                  </td>
                  <td className="border px-1 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="border px-1 text-right">
                    {formatCurrency(amount)}
                  </td>
                  <td className="border px-1 text-right">
                    {formatCurrency(item.cgstAmount || 0)}
                  </td>
                  <td className="border px-1 text-right">
                    {formatCurrency(item.sgstAmount || 0)}
                  </td>
                  <td className="border px-1 text-right">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTAL SECTION */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="p-2 border-r border-black">
            <p>
              Total Invoice amount in words:
              <br />
              <strong>Rs. {amountInWords}</strong>
            </p>

            <p className="mt-2">Terms & Conditions:</p>
            <p>1. Payment due in 30 days</p>
            <p>2. Mention invoice number while payment</p>
          </div>

          <div className="p-2">
            <div className="flex justify-between">
              <span>Total Before Tax</span>
              <span>{formatCurrency(invoice.totalBeforeTax)}</span>
            </div>

            <div className="flex justify-between">
              <span>CGST</span>
              <span>{formatCurrency(invoice.totalCgst)}</span>
            </div>

            <div className="flex justify-between">
              <span>SGST</span>
              <span>{formatCurrency(invoice.totalSgst)}</span>
            </div>

            <div className="flex justify-between">
              <span>Round Off</span>
              <span>{formatCurrency(invoice.roundOff || 0)}</span>
            </div>

            <div className="flex justify-between font-bold border-t mt-1 pt-1">
              <span>Total</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* BANK + SIGN */}
        <div className="grid grid-cols-2">
          <div className="p-2 border-r border-black">
            <p className="font-semibold">Bank Details</p>
            <p>Bank A/C: {invoice.bankDetails?.accountNumber || "-----"}</p>
            <p>IFSC: {invoice.bankDetails?.ifscCode || "-----"}</p>

            <p className="mt-2">Thank You For Your Business!</p>
          </div>

          <div className="p-2 text-right">
            <p>For {COMPANY.name}</p>
            <br />
            <p>Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  ); }