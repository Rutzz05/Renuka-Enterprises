import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateInvoicePDF = async (element: HTMLElement, fileName: string) => {
  try {
    // Capture element as canvas with optimized settings
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: 210 * 3.78, // Convert to pixels (210mm @ 96dpi)
      windowHeight: 297 * 3.78, // A4 height in pixels
    });

    // Create PDF (A4 portrait)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const a4Width = 210;
    const a4Height = 297;

    // Calculate image dimensions to fit A4 perfectly
    const imgWidth = a4Width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');

    // Add image at position 0,0 with no margins
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Add additional pages if content overflows (ensure single page for invoice)
    if (imgHeight > a4Height) {
      let heightRemaining = imgHeight - a4Height;
      let position = a4Height;

      while (heightRemaining > 0) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(
          (a4Height * canvas.width) / imgWidth,
          (heightRemaining * canvas.width) / imgWidth
        );

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          const sourceY = (position * canvas.height) / imgHeight;
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            pageCanvas.width,
            pageCanvas.height
          );

          pdf.addPage('a4');
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, a4Height);
        }

        heightRemaining -= a4Height;
        position += a4Height;
      }
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};
