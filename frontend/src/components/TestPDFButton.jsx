import React from 'react';
import { generateInvoicePDF, downloadPDF } from '../utils/pdfGenerator';

const TestPDFButton = () => {
  const handleGenerate = () => {
    try {
      const invoiceData = {
        client: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          company: 'Acme Corp'
        },
        services: [
          { 
            description: 'Tax Filing Service', 
            date: new Date(), 
            amount: 100 
          }
        ],
        invoiceNumber: 'INV-1001',
        date: new Date(),
        total: 100,
        tax: 10,
        grandTotal: 110
      };

      console.log('Test PDF data:', invoiceData);
      const doc = generateInvoicePDF(invoiceData);
      downloadPDF(doc, 'test_invoice.pdf');
    } catch (error) {
      console.error('Test PDF generation failed:', error);
      alert('PDF generation failed: ' + error.message);
    }
  };

  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">PDF Test Button</h3>
      <button 
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Test PDF
      </button>
    </div>
  );
};

export default TestPDFButton; 