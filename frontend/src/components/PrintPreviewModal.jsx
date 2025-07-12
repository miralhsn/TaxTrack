import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPrint, FaDownload } from 'react-icons/fa';
import { generateInvoicePDF, generateReceiptPDF, downloadPDF, printPDF } from '../utils/pdfGenerator';

const PrintPreviewModal = ({ isOpen, onClose, service, client }) => {
  if (!isOpen || !service || !client) return null;

  const handlePrint = () => {
    try {
      // Create proper invoice data structure
      const invoiceData = {
        client,
        services: [service],
        invoiceNumber: service._id.slice(-8).toUpperCase(),
        date: service.date || service.createdAt,
        total: service.amount,
        tax: service.amount * 0.1, // 10% tax
        grandTotal: service.amount * 1.1
      };

      const doc = service.status === 'Paid' 
        ? generateReceiptPDF(service, client)
        : generateInvoicePDF(invoiceData);
      
      printPDF(doc);
      onClose();
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const handleDownload = () => {
    try {
      // Create proper invoice data structure
      const invoiceData = {
        client,
        services: [service],
        invoiceNumber: service._id.slice(-8).toUpperCase(),
        date: service.date || service.createdAt,
        total: service.amount,
        tax: service.amount * 0.1, // 10% tax
        grandTotal: service.amount * 1.1
      };

      const doc = service.status === 'Paid' 
        ? generateReceiptPDF(service, client)
        : generateInvoicePDF(invoiceData);
      
      const filename = service.status === 'Paid' 
        ? `receipt-${service._id.slice(-8)}.pdf`
        : `invoice-${service._id.slice(-8)}.pdf`;
      
      downloadPDF(doc, filename);
      onClose();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Print Preview - {service.status === 'Paid' ? 'Receipt' : 'Invoice'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    BillingApp
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Professional Billing & Tax Management
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    123 Business Street, City, State 12345
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {service.status === 'Paid' ? 'Paid By:' : 'Bill To:'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{client.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{client.company || 'N/A'}</p>
                    <p className="text-gray-600 dark:text-gray-400">{client.email}</p>
                    {client.phone && (
                      <p className="text-gray-600 dark:text-gray-400">{client.phone}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Document Details
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {service.status === 'Paid' ? 'Receipt' : 'Invoice'} #{service._id.slice(-8)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Date: {new Date(service.date).toLocaleDateString()}
                    </p>
                    {service.status === 'Paid' && (
                      <p className="text-gray-600 dark:text-gray-400">
                        Payment Date: {new Date().toLocaleDateString()}
                      </p>
                    )}
                    {service.dueDate && service.status !== 'Paid' && (
                      <p className="text-gray-600 dark:text-gray-400">
                        Due Date: {new Date(service.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {service.type}
                          {service.notes && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              {service.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                          ${service.amount}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                          ${service.amount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-6 text-center">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    service.status === 'Paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {service.status === 'Paid' ? 'PAYMENT CONFIRMED' : 'PENDING PAYMENT'}
                  </span>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Thank you for choosing BillingApp for your professional needs.</p>
                  <p className="mt-1">This is a computer-generated document.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDownload size={16} />
                Download PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPrint size={16} />
                Print
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrintPreviewModal; 