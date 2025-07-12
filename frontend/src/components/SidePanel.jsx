import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaLightbulb, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import ReminderModal from './ReminderModal';
import { generateClientReportPDF, downloadPDF } from '../utils/pdfGenerator';
import axios from 'axios';

const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleScheduleReminder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
      setShowReminderModal(true);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleExportReports = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const clients = response.data;
      const allServices = [];
      
      // Fetch services for each client
      for (const client of clients) {
        const servicesResponse = await axios.get(`http://localhost:5000/api/services/client/${client._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        allServices.push(...servicesResponse.data.map(service => ({ ...service, client })));
      }
      
      // Generate comprehensive report
      const reportData = {
        clients,
        services: allServices,
        generatedAt: new Date().toISOString()
      };
      
      const doc = generateClientReportPDF(reportData);
      downloadPDF(doc, `TaxTrack_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting reports:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const taxTrends = [
    {
      id: 1,
      title: "Q4 Tax Deadlines",
      content: "Important deadlines approaching for quarterly tax filings. Ensure all documentation is prepared.",
      date: "Dec 31, 2024",
      type: "deadline"
    },
    {
      id: 2,
      title: "New Tax Regulations",
      content: "Updated regulations for small business deductions. Review your client portfolios for compliance.",
      date: "Jan 15, 2025",
      type: "update"
    },
    {
      id: 3,
      title: "Digital Payment Trends",
      content: "Digital payment methods are increasing. Consider offering online payment options to clients.",
      date: "Ongoing",
      type: "trend"
    }
  ];

  const tips = [
    "Always keep detailed records of all transactions",
    "Set up automatic reminders for tax deadlines",
    "Use digital tools for better organization",
    "Regularly backup your financial data",
    "Stay updated with latest tax regulations"
  ];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 bg-blue-600 text-white p-2 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
      </motion.button>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-30 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tax Insights
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Tax Trends Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FaChartLine className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Latest Trends
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {taxTrends.map((trend) => (
                    <motion.div
                      key={trend.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: trend.id * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {trend.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {trend.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {trend.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tips Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FaLightbulb className="text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pro Tips
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaCalendarAlt className="text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleScheduleReminder}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Schedule Reminder
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExportReports}
                    disabled={isExporting}
                    className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                  >
                    {isExporting ? 'Exporting...' : 'Export Reports'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showReminderModal && (
        <ReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          onSubmit={async (formData) => {
            try {
              const token = localStorage.getItem('token');
              await axios.post('http://localhost:5000/api/reminders', formData, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setShowReminderModal(false);
            } catch (error) {
              console.error('Error creating reminder:', error);
            }
          }}
          initialData={null}
          clients={clients}
        />
      )}
    </>
  );
};

export default SidePanel; 