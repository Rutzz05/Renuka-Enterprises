import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateInvoicePDF = async (element: HTMLElement, fileName: string) => {
  try {
    // Capture element as canvas with optimized settings
    const canvas = await html2canvas(element, {
      scale: 2,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
    });

    // Create PDF (A4 portrait)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions: 210mm x 297mm
    const imgWidth = 210; // Full A4 width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image at X=0, Y=0 with full width (no margins, no shifting)
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Handle multi-page if content exceeds one page
    let heightLeft = imgHeight - 297;
    while (heightLeft > 0) {
      const position = -imgHeight + heightLeft;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};
