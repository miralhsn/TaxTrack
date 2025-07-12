import jsPDF from 'jspdf';

// Check if autotable is available
let autoTable;
try {
  autoTable = require('jspdf-autotable');
  // If autotable is available, add it to jsPDF
  if (autoTable && typeof autoTable.default === 'function') {
    autoTable.default(jsPDF);
  }
} catch (error) {
  console.warn('jspdf-autotable not available, tables will be simplified');
}

// Fallback table function if autotable is not available
const createSimpleTable = (doc, head, body, startY) => {
  const lineHeight = 10;
  const margin = 20;
  let currentY = startY;
  
  // Draw header
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(37, 99, 235);
  head.forEach((text, index) => {
    doc.text(text, margin + (index * 50), currentY);
  });
  
  currentY += lineHeight;
  
  // Draw body
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  body.forEach(row => {
    row.forEach((text, index) => {
      doc.text(text, margin + (index * 50), currentY);
    });
    currentY += lineHeight;
  });
  
  return currentY;
};

export const generateInvoicePDF = (invoiceData) => {
  try {
    const { client, services, invoiceNumber, date, total, tax, grandTotal } = invoiceData;
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Invoice #${invoiceNumber}`,
      subject: `Invoice for ${client.name}`,
      author: 'TaxTrack',
      creator: 'TaxTrack Billing System'
    });

    // Add header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text('TaxTrack', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text('Professional Tax & Billing Services', 20, 40);
    
    // Add invoice details
    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39); // Gray-900
    doc.text('INVOICE', 20, 60);
    
    // Invoice info
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 75);
    doc.text(`Date: ${new Date(date || Date.now()).toLocaleDateString()}`, 20, 82);
    doc.text(`Due Date: ${new Date(new Date(date || Date.now()).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 89);
    
    // Client info
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('Bill To:', 20, 110);
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(client.name, 20, 120);
    if (client.company) {
      doc.text(client.company, 20, 127);
    }
    if (client.email) {
      doc.text(client.email, 20, 134);
    }
    if (client.phone) {
      doc.text(client.phone, 20, 141);
    }
    
    // Services table
    const tableY = 160;
    
    // Prepare table data
    const tableData = services.map(service => ({
      description: service.description || service.type || 'Tax Service',
      date: new Date(service.date || Date.now()).toLocaleDateString(),
      amount: `$${parseFloat(service.amount || 0).toFixed(2)}`
    }));
    
    // Add table
    let finalY;
    if (doc.autoTable) {
      doc.autoTable({
        head: [['Description', 'Date', 'Amount']],
        body: tableData.map(row => [row.description, row.date, row.amount]),
        startY: tableY,
        styles: {
          fontSize: 10,
          cellPadding: 5,
          headStyles: {
            fillColor: [37, 99, 235], // Blue-600
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251] // Gray-50
          }
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40, halign: 'right' }
        }
      });
      
      // Get the Y position after the table
      finalY = doc.lastAutoTable.finalY + 10;
    } else {
      // Fallback to simple table
      finalY = createSimpleTable(
        doc,
        ['Description', 'Date', 'Amount'],
        tableData.map(row => [row.description, row.date, row.amount]),
        tableY
      ) + 10;
    }
    
    // Add totals
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('Subtotal:', 140, finalY);
    doc.text(`$${parseFloat(total || 0).toFixed(2)}`, 180, finalY);
    
    doc.text('Tax:', 140, finalY + 10);
    doc.text(`$${parseFloat(tax || 0).toFixed(2)}`, 180, finalY + 10);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 140, finalY + 25);
    doc.text(`$${parseFloat(grandTotal || 0).toFixed(2)}`, 180, finalY + 25);
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Thank you for your business!', 20, 270);
    doc.text('TaxTrack - Professional Tax & Billing Services', 20, 275);
    
    return doc;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw new Error('Failed to generate invoice PDF');
  }
};

export const generateClientReportPDF = (reportData) => {
  try {
    const { clients, services, generatedAt } = reportData;
    
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'TaxTrack Client Report',
      subject: 'Comprehensive Client and Service Report',
      author: 'TaxTrack',
      creator: 'TaxTrack Billing System'
    });

    // Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text('TaxTrack', 20, 30);
    
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39);
    doc.text('Comprehensive Client Report', 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated: ${new Date(generatedAt || Date.now()).toLocaleDateString()}`, 20, 60);
    
    // Summary
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text('Summary', 20, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(`Total Clients: ${clients?.length || 0}`, 20, 95);
    doc.text(`Total Services: ${services?.length || 0}`, 20, 102);
    
    const totalRevenue = services?.reduce((sum, service) => sum + parseFloat(service.amount || 0), 0) || 0;
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 20, 109);
    
    // Clients table
    if (clients && clients.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.text('Client List', 20, 130);
      
      const clientTableData = clients.map(client => [
        client.name || 'N/A',
        client.company || 'N/A',
        client.email || 'N/A',
        client.phone || 'N/A'
      ]);
      
      if (doc.autoTable) {
        doc.autoTable({
          head: [['Name', 'Company', 'Email', 'Phone']],
          body: clientTableData,
          startY: 140,
          styles: {
            fontSize: 9,
            headStyles: {
              fillColor: [37, 99, 235],
              textColor: 255,
              fontStyle: 'bold'
            }
          }
        });
      } else {
        createSimpleTable(
          doc,
          ['Name', 'Company', 'Email', 'Phone'],
          clientTableData,
          140
        );
      }
    }
    
    // Services table
    if (services && services.length > 0) {
      const servicesY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 140) + 20;
      
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.text('Service History', 20, servicesY);
      
      const serviceTableData = services.map(service => [
        service.client?.name || 'Unknown Client',
        service.description || service.type || 'Tax Service',
        new Date(service.date || Date.now()).toLocaleDateString(),
        service.status || 'Pending',
        `$${parseFloat(service.amount || 0).toFixed(2)}`
      ]);
      
      if (doc.autoTable) {
        doc.autoTable({
          head: [['Client', 'Service', 'Date', 'Status', 'Amount']],
          body: serviceTableData,
          startY: servicesY + 10,
          styles: {
            fontSize: 8,
            headStyles: {
              fillColor: [37, 99, 235],
              textColor: 255,
              fontStyle: 'bold'
            }
          }
        });
      } else {
        createSimpleTable(
          doc,
          ['Client', 'Service', 'Date', 'Status', 'Amount'],
          serviceTableData,
          servicesY + 10
        );
      }
    }
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('TaxTrack - Professional Tax & Billing Services', 20, 270);
    
    return doc;
  } catch (error) {
    console.error('Error generating client report PDF:', error);
    throw new Error('Failed to generate client report PDF');
  }
};

export const generateReceiptPDF = (service, client) => {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Receipt #${service._id.slice(-8)}`,
    subject: `Receipt for ${client.name}`,
    author: 'TaxTrack',
    creator: 'TaxTrack Billing System'
  });

  // Add header
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text('TaxTrack', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray-500
  doc.text('Professional Tax & Billing Services', 20, 40);
  
  // Add receipt details
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.text('RECEIPT', 20, 60);
  
  // Receipt info
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Receipt #: ${service._id.slice(-8)}`, 20, 75);
  doc.text(`Date: ${new Date(service.date).toLocaleDateString()}`, 20, 82);
  doc.text(`Payment Date: ${new Date().toLocaleDateString()}`, 20, 89);
  
  // Client info
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text('Paid By:', 20, 110);
  
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text(client.name, 20, 120);
  if (client.company) {
    doc.text(client.company, 20, 127);
  }
  if (client.email) {
    doc.text(client.email, 20, 134);
  }
  if (client.phone) {
    doc.text(client.phone, 20, 141);
  }
  
  // Service details
  const tableY = 160;
  
  // Add table
      let finalY;
    if (doc.autoTable) {
      doc.autoTable({
        head: [['Description', 'Date', 'Amount']],
        body: [[
          service.type || 'Tax Service',
          new Date(service.date).toLocaleDateString(),
          `$${service.amount.toFixed(2)}`
        ]],
        startY: tableY,
        styles: {
          fontSize: 10,
          cellPadding: 5,
          headStyles: {
            fillColor: [34, 197, 94], // Green-500 for receipt
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251] // Gray-50
          }
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40, halign: 'right' }
        }
      });
      
      // Get the Y position after the table
      finalY = doc.lastAutoTable.finalY + 10;
    } else {
      // Fallback to simple table
      finalY = createSimpleTable(
        doc,
        ['Description', 'Date', 'Amount'],
        [[
          service.type || 'Tax Service',
          new Date(service.date).toLocaleDateString(),
          `$${service.amount.toFixed(2)}`
        ]],
        tableY
      ) + 10;
    }
  
  // Add total
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Total Paid:', 140, finalY + 25);
  doc.text(`$${service.amount.toFixed(2)}`, 180, finalY + 25);
  
  // Add payment confirmation
  doc.setFontSize(12);
  doc.setTextColor(34, 197, 94); // Green-500
  doc.text('PAYMENT CONFIRMED', 20, finalY + 45);
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Thank you for your payment!', 20, 270);
  doc.text('TaxTrack - Professional Tax & Billing Services', 20, 275);
  
  return doc;
};

export const downloadPDF = (doc, filename) => {
  doc.save(filename);
};

export const printPDF = (doc) => {
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl);
  printWindow.onload = () => {
    printWindow.print();
  };
}; 