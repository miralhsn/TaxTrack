import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaPlus, FaCheck, FaTrash, FaEdit, FaExclamationTriangle, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReminderModal from './ReminderModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Reminders = ({ clients }) => {
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [overdueReminders, setOverdueReminders] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, overdue: 0, upcoming: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editReminder, setEditReminder] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reminder: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  const token = localStorage.getItem('token');

  const fetchReminders = useCallback(async () => {
    try {
      const [upcomingRes, overdueRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/reminders/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/reminders/overdue', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/reminders/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setUpcomingReminders(upcomingRes.data);
      setOverdueReminders(overdueRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to fetch reminders');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleAddReminder = () => {
    setEditReminder(null);
    setModalOpen(true);
  };

  const handleEditReminder = (reminder) => {
    setEditReminder(reminder);
    setModalOpen(true);
  };

  const handleDeleteReminder = (reminder) => {
    setDeleteModal({ isOpen: true, reminder });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.reminder) return;

    try {
      await axios.delete(`http://localhost:5000/api/reminders/${deleteModal.reminder._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Reminder deleted successfully');
      fetchReminders();
    } catch (err) {
      toast.error('Failed to delete reminder');
    } finally {
      setDeleteModal({ isOpen: false, reminder: null });
    }
  };

  const handleMarkCompleted = async (reminder) => {
    try {
      await axios.patch(`http://localhost:5000/api/reminders/${reminder._id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Reminder marked as completed');
      fetchReminders();
    } catch (err) {
      toast.error('Failed to update reminder');
    }
  };

  const handleSubmitReminder = async (formData) => {
    try {
      if (editReminder) {
        await axios.put(`http://localhost:5000/api/reminders/${editReminder._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Reminder updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/reminders', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Reminder created successfully');
      }
      fetchReminders();
    } catch (err) {
      throw err;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status, date) => {
    if (status === 'completed') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (status === 'overdue' || new Date(date) < new Date()) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (date) => {
    const now = new Date();
    const reminderDate = new Date(date);
    const diff = reminderDate - now;
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Due soon';
  };

  const currentReminders = activeTab === 'upcoming' ? upcomingReminders : overdueReminders;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <FaBell className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reminders</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.pending} pending, {stats.overdue} overdue
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddReminder}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <FaPlus size={14} />
            Add Reminder
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Overdue</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.upcoming}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Upcoming</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Upcoming ({upcomingReminders.length})
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'overdue'
              ? 'text-red-600 border-b-2 border-red-600 dark:text-red-400 dark:border-red-400'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Overdue ({overdueReminders.length})
        </button>
      </div>

      {/* Reminders List */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {currentReminders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBell className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No {activeTab} reminders
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {activeTab === 'upcoming' ? 'Add a reminder to get started' : 'All overdue reminders have been resolved'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {currentReminders.map((reminder, index) => (
                <motion.div
                  key={reminder._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {reminder.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority === 'high' && <FaExclamationTriangle size={10} className="mr-1" />}
                          {reminder.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status, reminder.date)}`}>
                          {reminder.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {reminder.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaCalendar size={12} />
                          {formatDate(reminder.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaBell size={12} />
                          {getTimeUntil(reminder.date)}
                        </div>
                        {reminder.clientId && (
                          <div className="text-blue-600 dark:text-blue-400">
                            {reminder.clientId.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      {reminder.status !== 'completed' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMarkCompleted(reminder)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Mark as completed"
                        >
                          <FaCheck size={14} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditReminder(reminder)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit reminder"
                      >
                        <FaEdit size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteReminder(reminder)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete reminder"
                      >
                        <FaTrash size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <ReminderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitReminder}
        initialData={editReminder}
        clients={clients}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reminder: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder? This action cannot be undone."
        itemName={deleteModal.reminder?.title}
      />
    </div>
  );
};

export default Reminders; 