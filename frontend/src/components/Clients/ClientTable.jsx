import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaBuilding, 
  FaPhone, 
  FaEnvelope,
  FaUser
} from 'react-icons/fa';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

export default function ClientTable({ clients, onEdit, onDelete, onAdd }) {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, client: null });

  const handleDeleteClick = (client) => {
    setDeleteModal({ isOpen: true, client });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.client) {
      await onDelete(deleteModal.client);
      setDeleteModal({ isOpen: false, client: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, client: null });
  };

  return (
    <div className="w-full">
      {/* Table for desktop */}
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="py-4 px-6 text-left font-semibold">Name</th>
                <th className="py-4 px-6 text-left font-semibold">Company</th>
                <th className="py-4 px-6 text-left font-semibold">Phone</th>
                <th className="py-4 px-6 text-left font-semibold">Email</th>
                <th className="py-4 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <motion.tr 
                  key={client._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <FaBuilding className="text-gray-400" size={14} />
                      {client.company || 'N/A'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <FaPhone className="text-gray-400" size={14} />
                      {client.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <FaEnvelope className="text-gray-400" size={14} />
                      {client.email || 'N/A'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/clients/${client._id}`)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(client)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Edit Client"
                      >
                        <FaEdit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClick(client)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Client"
                      >
                        <FaTrash size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for mobile/tablet */}
      <div className="lg:hidden grid gap-4">
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No clients found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Add your first client to get started</p>
          </div>
        ) : (
          clients.map((client, index) => (
            <motion.div 
              key={client._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 dark:text-blue-400" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{client.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{client.company || 'No company'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaPhone className="text-gray-400" size={14} />
                  <span className="text-sm">{client.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaEnvelope className="text-gray-400" size={14} />
                  <span className="text-sm truncate">{client.email || 'No email'}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/clients/${client._id}`)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="View Details"
                >
                  <FaEye size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(client)}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Edit Client"
                >
                  <FaEdit size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteClick(client)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Client"
                >
                  <FaTrash size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone and will also delete all associated services."
        itemName={deleteModal.client?.name}
      />
    </div>
  );
} 