import html2pdf from 'html2pdf.js';

export const generateInvoicePDF = async (element: HTMLElement, fileName: string) => {
  await html2pdf()
    .set({
      margin: [8, 8, 8, 8],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    })
    .from(element)
    .save();
};
