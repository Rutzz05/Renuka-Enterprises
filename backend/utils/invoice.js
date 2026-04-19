const MONTH_CODES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const roundCurrency = (value) => Number((Number(value) || 0).toFixed(2));

const getFinancialYearRange = (inputDate) => {
  const invoiceDate = inputDate ? new Date(inputDate) : new Date();
  const year = invoiceDate.getMonth() >= 3 ? invoiceDate.getFullYear() : invoiceDate.getFullYear() - 1;

  return {
    start: new Date(year, 3, 1, 0, 0, 0, 0),
    end: new Date(year + 1, 2, 31, 23, 59, 59, 999),
    label: `${year}-${String((year + 1) % 100).padStart(2, "0")}`,
    monthCode: MONTH_CODES[invoiceDate.getMonth()],
  };
};

const buildInvoiceNumber = (serialNumber, invoiceDate) => {
  const safeSerial = String(Number(serialNumber || 0) || "").trim();
  const { label, monthCode } = getFinancialYearRange(invoiceDate);
  return `${safeSerial.padStart(3, "0")}/${monthCode}/${label}`;
};

const numberToWords = (value) => {
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

  const convertBelowThousand = (number) => {
    if (number < 20) {
      return ones[number];
    }

    if (number < 100) {
      return `${tens[Math.floor(number / 10)]}${number % 10 ? ` ${ones[number % 10]}` : ""}`.trim();
    }

    return `${ones[Math.floor(number / 100)]} Hundred${number % 100 ? ` ${convertBelowThousand(number % 100)}` : ""}`.trim();
  };

  const integer = Math.round(Number(value) || 0);

  if (integer === 0) {
    return "Zero Rupees only";
  }

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

const calculateInvoiceTotals = (items) => {
  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || item.rate || 0);
    const amount = roundCurrency(quantity * unitPrice);
    const cgstRate = Number(item.cgstRate || 0);
    const sgstRate = Number(item.sgstRate || 0);
    const cgstAmount = roundCurrency((amount * cgstRate) / 100);
    const sgstAmount = roundCurrency((amount * sgstRate) / 100);
    const total = roundCurrency(amount + cgstAmount + sgstAmount);

    return {
      description: item.description?.trim(),
      hsnCode: item.hsnCode?.trim() || "",
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
  const rawGrandTotal = roundCurrency(totalBeforeTax + totalCgst + totalSgst);
  const roundedGrandTotal = roundCurrency(rawGrandTotal);
  const roundOff = roundCurrency(roundedGrandTotal - rawGrandTotal);

  return {
    items: normalizedItems,
    totalBeforeTax,
    totalCgst,
    totalSgst,
    grandTotal: roundedGrandTotal,
    roundOff,
    amountInWords: numberToWords(roundedGrandTotal),
  };
};

module.exports = {
  getFinancialYearRange,
  buildInvoiceNumber,
  numberToWords,
  calculateInvoiceTotals,
  roundCurrency,
};
