import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaDownload, FaEnvelope, FaFilePdf, FaArrowLeft, FaTimesCircle, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { generateInvoicePDF, generateClientReportPDF, downloadPDF } from '../../utils/pdfGenerator';
import PrintPreviewModal from '../PrintPreviewModal';

const SERVICE_TYPES = [
  'Audit',
  'Income Tax',
  'Sales Tax',
  'Corporate Filing',
  'Balance Sheet Generation',
  'Miscellaneous',
];

function ServiceFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    type: '',
    date: '',
    notes: '',
    amount: '',
    status: 'Pending',
  });
  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ type: '', date: '', notes: '', amount: '', status: 'Pending' });
  }, [initialData, open]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl transition-colors" 
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {initialData ? 'Edit Service' : 'Add Service'}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <select 
            name="type" 
            value={form.type} 
            onChange={handleChange} 
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
            required
          >
            <option value="">Select Service Type</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input 
            name="date" 
            type="date" 
            value={form.date?.slice(0,10) || ''} 
            onChange={handleChange} 
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
            required 
          />
          <input 
            name="amount" 
            type="number" 
            value={form.amount} 
            onChange={handleChange} 
            placeholder="Amount" 
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
            required 
          />
          <input 
            name="notes" 
            value={form.notes} 
            onChange={handleChange} 
            placeholder="Notes" 
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
          />
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange} 
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-semibold mt-4"
          >
            {initialData ? 'Update' : 'Add'} Service
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ClientDetails({ clientId: propClientId }) {
  const [client, setClient] = useState(null);
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const token = localStorage.getItem('token');
  // Get clientId from prop or URL
  const clientId = propClientId || window.location.pathname.split('/').pop();

  const fetchClient = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient(res.data);
    } catch (err) {
      toast.error('Failed to fetch client');
    }
  };
  const fetchServices = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/services/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      toast.error('Failed to fetch services');
    }
  };
  useEffect(() => {
    fetchClient();
    fetchServices();
    // eslint-disable-next-line
  }, [clientId]);

  const handleAdd = () => {
    setEditService(null);
    setModalOpen(true);
  };
  const handleEdit = (service) => {
    setEditService(service);
    setModalOpen(true);
  };
  const handleDelete = async (service) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/services/${service._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Service deleted');
      fetchServices();
    } catch (err) {
      toast.error('Delete failed');
    }
  };
  const handleSubmit = async (form) => {
    try {
      if (editService) {
        await axios.put(`http://localhost:5000/api/services/${editService._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Service updated');
      } else {
        await axios.post(`http://localhost:5000/api/services/client/${clientId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Service added');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error('Save failed');
    }
  };

  const handleMarkStatus = async (service, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/services/${service._id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Marked as ${status}`);
      fetchServices();
    } catch (err) {
      toast.error('Status update failed');
    }
  };
  const handleDownloadPDF = async (service) => {
    try {
      // Validate service data
      if (!service || !service.amount) {
        toast.error('Invalid service data for PDF generation');
        return;
      }

      // Calculate totals
      const total = parseFloat(service.amount) || 0;
      const tax = total * 0.1; // 10% tax
      const grandTotal = total + tax;
      
      const invoiceData = {
        client: {
          name: client.name || 'Unknown Client',
          email: client.email || '',
          phone: client.phone || '',
          company: client.company || ''
        },
        services: [{
          description: service.type || service.description || 'Tax Service',
          date: service.date || service.createdAt || new Date(),
          amount: total
        }],
        invoiceNumber: service._id ? service._id.slice(-8).toUpperCase() : 'INV' + Date.now(),
        date: service.date || service.createdAt || new Date(),
        total,
        tax,
        grandTotal
      };
      
      console.log('Generating PDF with data:', invoiceData); // Debug log
      
      const doc = generateInvoicePDF(invoiceData);
      const filename = `invoice-${service._id ? service._id.slice(-8) : Date.now()}.pdf`;
      
      downloadPDF(doc, filename);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('PDF generation failed: ' + err.message);
    }
  };

  const handleDownloadClientReport = async () => {
    try {
      // Validate client data
      if (!client) {
        toast.error('Client data not available');
        return;
      }

      const reportData = {
        clients: [client],
        services: services || [],
        generatedAt: new Date().toISOString()
      };
      
      console.log('Generating client report with data:', reportData); // Debug log
      
      const doc = generateClientReportPDF(reportData);
      const filename = `client-report-${client.name ? client.name.replace(/\s+/g, '-') : 'client'}.pdf`;
      
      downloadPDF(doc, filename);
      toast.success('Client report downloaded successfully');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('PDF generation failed: ' + err.message);
    }
  };

  const handlePrintPreview = (service) => {
    setSelectedService(service);
    setPrintModalOpen(true);
  };
  const handleSendEmail = async (service) => {
    try {
      await axios.post(`http://localhost:5000/api/services/${service._id}/email`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Email sent');
    } catch (err) {
      toast.error('Email failed');
    }
  };

  // Document upload and deletion
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    try {
      await axios.post(`http://localhost:5000/api/clients/${clientId}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded successfully');
      fetchClient();
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const handleDeleteDocument = async (documentName) => {
    if (!window.confirm(`Are you sure you want to delete "${documentName}"?`)) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/clients/${clientId}/documents/${encodeURIComponent(documentName)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Document removed successfully');
      fetchClient();
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  if (!client) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4"
      >
        <Link 
          to="/clients" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
        >
          <FaArrowLeft size={16} />
          Back to Clients
        </Link>
      </motion.div>

      {/* Client Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {client.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {client.company}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              onClick={handleDownloadClientReport}
              title="Download Client Report"
            >
              <FaDownload size={16} />
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Report</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              onClick={handleAdd}
            >
              <span className="text-lg">+</span>
              <span className="hidden sm:inline">Add Service</span>
              <span className="sm:hidden">Service</span>
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              📧
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white truncate">{client.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
              📞
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="font-medium text-gray-900 dark:text-white">{client.phone || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              📍
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
              <p className="font-medium text-gray-900 dark:text-white truncate">{client.address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Services</h2>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white">Type</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white">Notes</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {services.map((service, index) => (
                <motion.tr
                  key={service._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{service.type}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{service.date?.slice(0,10)}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">${service.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      service.status === 'Paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {service.notes || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => handleEdit(service)}
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleDelete(service)}
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1 transition-colors ${
                          service.status === 'Paid' 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        onClick={() => handleMarkStatus(service, service.status === 'Paid' ? 'Pending' : 'Paid')}
                        title={service.status === 'Paid' ? 'Mark as Pending' : 'Mark as Paid'}
                      >
                        {service.status === 'Paid' ? <FaTimes size={14} /> : <FaCheck size={14} />}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                        onClick={() => handleDownloadPDF(service)}
                        title="Download PDF"
                      >
                        <FaDownload size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                        onClick={() => handlePrintPreview(service)}
                        title="Print Preview"
                      >
                        <FaEyeSlash size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => handleSendEmail(service)}
                        title="Send Email"
                      >
                        <FaEnvelope size={14} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFilePdf className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No services found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Add a service to get started</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{service.type}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.date?.slice(0,10)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        service.status === 'Paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {service.status}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">${service.amount}</span>
                    </div>
                  </div>
                  
                  {service.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.notes}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        onClick={() => handleEdit(service)}
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        onClick={() => handleDelete(service)}
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 transition-colors rounded-lg ${
                          service.status === 'Paid' 
                            ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                            : 'text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        onClick={() => handleMarkStatus(service, service.status === 'Paid' ? 'Pending' : 'Paid')}
                        title={service.status === 'Paid' ? 'Mark as Pending' : 'Mark as Paid'}
                      >
                        {service.status === 'Paid' ? <FaTimes size={14} /> : <FaCheck size={14} />}
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        onClick={() => handleDownloadPDF(service)}
                        title="Download PDF"
                      >
                        <FaDownload size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        onClick={() => handlePrintPreview(service)}
                        title="Print Preview"
                      >
                        <FaEyeSlash size={14} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        onClick={() => handleSendEmail(service)}
                        title="Send Email"
                      >
                        <FaEnvelope size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* File Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Documents</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <button
              onClick={() => document.getElementById('fileInput')?.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Upload Document
            </button>
          </div>
          
          {client.documents && client.documents.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">Uploaded Documents:</h3>
              {client.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">{doc}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteDocument(doc)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FaTimesCircle size={16} />
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <ServiceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editService}
      />
      
      <PrintPreviewModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        service={selectedService}
        client={client}
      />
      
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
} 