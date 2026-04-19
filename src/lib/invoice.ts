export type InvoiceAddress = {
  name: string;
  address: string;
  phone: string;
  gstin: string;
  state: string;
};

export type InvoiceLineItem = {
  description: string;
  hsnCode: string;
  quantity: string;
  unitPrice: string;
  cgstRate: string;
  sgstRate: string;
};

export type InvoiceFormValues = {
  customerMode: "existing" | "manual";
  customerId: string;
  bookingId: string;
  invoiceId: string;
  invoiceDate: string;
  dateOfSupply: string;
  state: string;
  placeOfSupply: string;
  reverseCharge: boolean;
  transportMode: string;
  vehicleNumber: string;
  status: "generated" | "paid";
  billTo: InvoiceAddress;
  shipTo: InvoiceAddress & { sameAsBillTo: boolean };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
  };
  notes: string;
  items: InvoiceLineItem[];
};

export type CalculatedInvoiceItem = {
  description: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  total: number;
};

export type CalculatedInvoiceTotals = {
  items: CalculatedInvoiceItem[];
  totalBeforeTax: number;
  totalCgst: number;
  totalSgst: number;
  grandTotal: number;
  amountInWords: string;
};

const roundCurrency = (value: number) => Number((Number(value) || 0).toFixed(2));

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const createEmptyAddress = (): InvoiceAddress => ({
  name: "",
  address: "",
  phone: "",
  gstin: "",
  state: "",
});

export const createEmptyItem = (): InvoiceLineItem => ({
  description: "",
  hsnCode: "",
  quantity: "1",
  unitPrice: "",
  cgstRate: "9",
  sgstRate: "9",
});

export const calculateInvoiceTotals = (items: InvoiceLineItem[]): CalculatedInvoiceTotals => {
  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);
    const amount = roundCurrency(quantity * unitPrice);
    const cgstRate = Number(item.cgstRate || 0);
    const sgstRate = Number(item.sgstRate || 0);
    const cgstAmount = roundCurrency((amount * cgstRate) / 100);
    const sgstAmount = roundCurrency((amount * sgstRate) / 100);
    const total = roundCurrency(amount + cgstAmount + sgstAmount);

    return {
      description: item.description.trim(),
      hsnCode: item.hsnCode.trim(),
      quantity,
      unitPrice,
      amount,
      cgstRate,
      sgstRate,
      cgstAmount,
      sgstAmount,
      total,
    };
  });

  const totalBeforeTax = roundCurrency(normalizedItems.reduce((sum, item) => sum + item.amount, 0));
  const totalCgst = roundCurrency(normalizedItems.reduce((sum, item) => sum + item.cgstAmount, 0));
  const totalSgst = roundCurrency(normalizedItems.reduce((sum, item) => sum + item.sgstAmount, 0));
  const grandTotal = roundCurrency(totalBeforeTax + totalCgst + totalSgst);

  return {
    items: normalizedItems,
    totalBeforeTax,
    totalCgst,
    totalSgst,
    grandTotal,
    amountInWords: numberToWords(grandTotal),
  };
};

export const numberToWords = (value: number) => {
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

  const convertBelowThousand = (number: number): string => {
    if (number < 20) return ones[number];
    if (number < 100) return `${tens[Math.floor(number / 10)]}${number % 10 ? ` ${ones[number % 10]}` : ""}`.trim();
    return `${ones[Math.floor(number / 100)]} Hundred${number % 100 ? ` ${convertBelowThousand(number % 100)}` : ""}`.trim();
  };

  const integer = Math.round(value);
  if (integer === 0) return "Zero Rupees only";

  const crore = Math.floor(integer / 10000000);
  const lakh = Math.floor((integer % 10000000) / 100000);
  const thousand = Math.floor((integer % 100000) / 1000);
  const remainder = integer % 1000;

  const words = [
    crore ? `${convertBelowThousand(crore)} Crore` : "",
    lakh ? `${convertBelowThousand(lakh)} Lakh` : "",
    thousand ? `${convertBelowThousand(thousand)} Thousand` : "",
    remainder ? convertBelowThousand(remainder) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return `${words} Rupees only`;
};

export const validateInvoiceForm = (form: InvoiceFormValues) => {
  const errors: Record<string, string> = {};

  if (!form.invoiceDate) errors.invoiceDate = "Invoice date is required.";
  if (!form.dateOfSupply) errors.dateOfSupply = "Date of supply is required.";
  if (!form.state.trim()) errors.state = "State is required.";
  if (!form.placeOfSupply.trim()) errors.placeOfSupply = "Place of supply is required.";
  if (!form.transportMode.trim()) errors.transportMode = "Transport mode is required.";
  if (!form.billTo.name.trim()) errors.billToName = "Customer name is required.";
  if (!form.billTo.address.trim()) errors.billToAddress = "Billing address is required.";
  if (!form.billTo.phone.trim()) errors.billToPhone = "Billing phone is required.";
  if (!form.billTo.state.trim()) errors.billToState = "Billing state is required.";
  if (!form.shipTo.name.trim()) errors.shipToName = "Shipping name is required.";
  if (!form.shipTo.address.trim()) errors.shipToAddress = "Shipping address is required.";
  if (!form.shipTo.phone.trim()) errors.shipToPhone = "Shipping phone is required.";
  if (!form.shipTo.state.trim()) errors.shipToState = "Shipping state is required.";
  if (!form.bankDetails.accountNumber.trim()) errors.bankAccountNumber = "Bank account number is required.";
  if (!form.bankDetails.ifscCode.trim()) errors.bankIfscCode = "IFSC code is required.";

  form.items.forEach((item, index) => {
    if (!item.description.trim()) errors[`item-${index}-description`] = "Product name is required.";
    if (!item.quantity || Number(item.quantity) <= 0) errors[`item-${index}-quantity`] = "Quantity must be greater than 0.";
    if (!item.unitPrice || Number(item.unitPrice) <= 0) errors[`item-${index}-unitPrice`] = "Rate must be greater than 0.";
    if (item.cgstRate === "" || Number.isNaN(Number(item.cgstRate))) errors[`item-${index}-cgstRate`] = "CGST must be numeric.";
    if (item.sgstRate === "" || Number.isNaN(Number(item.sgstRate))) errors[`item-${index}-sgstRate`] = "SGST must be numeric.";
  });

  return errors;
};
