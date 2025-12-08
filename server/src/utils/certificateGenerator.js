import PDFDocument from 'pdfkit';

/**
 * Generates an EPR Certificate PDF stream
 * @param {Object} donation - The donation object
 * @param {Object} user - The user object
 * @returns {PDFDocument} - The PDF document stream
 */
export function generateCertificate(donation, user) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // -- Design & Layout --

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke();

    // Header / Title
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(30).text('CERTIFICATE OF RECYCLING', { align: 'center' });

    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(12).text('EXTENDED PRODUCER RESPONSIBILITY (EPR)', { align: 'center', color: 'grey' });

    doc.moveDown(2);
    doc.fontSize(14).text('This is to certify that', { align: 'center', color: 'black' });

    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(24).text(user.name, { align: 'center' });

    doc.moveDown(1);
    doc.font('Helvetica').fontSize(14).text('has successfully donated e-waste for responsible recycling.', { align: 'center' });

    // Donation Details Box
    const startY = 300;
    doc.rect(100, startY, 400, 150).fillAndStroke('#f0f9f0', '#2e7d32');

    doc.fillColor('black');

    doc.font('Helvetica-Bold').fontSize(16).text('Deed Details', 100, startY + 20, { align: 'center', width: 400 });

    doc.font('Helvetica').fontSize(12);

    // Left aligned text inside the box
    const leftX = 150;
    const lineSpacing = 25;
    const contentStart = startY + 60;

    doc.text(`Tracking ID: ${donation._id.toString().slice(-8).toUpperCase()}`, leftX, contentStart);
    doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString()}`, leftX, contentStart + lineSpacing);
    doc.text(`Waste Type: ${donation.wasteType}`, leftX, contentStart + lineSpacing * 2);
    doc.text(`Quantity: ${donation.quantityKg} kg`, leftX, contentStart + lineSpacing * 3);


    // Impact
    doc.moveDown(8);
    doc.fontSize(16).text('Environmental Impact', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`By this action, you have helped save approx ${(donation.quantityKg * 1.5).toFixed(2)} kg of CO2 emissions.`, { align: 'center' });

    // Signature / Footer
    const bottomY = 700;
    doc.moveTo(100, bottomY).lineTo(250, bottomY).stroke();
    doc.text('Authorized Signature', 100, bottomY + 10, { width: 150, align: 'center' });

    doc.text('ScrapSaver Initiative', 350, bottomY + 10, { align: 'right' });

    // End
    doc.end();

    return doc;
}
