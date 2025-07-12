import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ClientTable from './ClientTable';
import ClientFormModal from './ClientFormModal';

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const token = localStorage.getItem('token');

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      toast.error('Failed to fetch clients');
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, []);

  const handleAdd = () => {
    setEditClient(null);
    setModalOpen(true);
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (client) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/clients/${client._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Client deleted');
      fetchClients();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleSubmit = async (form) => {
    try {
      if (editClient) {
        await axios.put(`http://localhost:5000/api/clients/${editClient._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Client updated');
      } else {
        await axios.post('http://localhost:5000/api/clients', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Client added');
      }
      setModalOpen(false);
      fetchClients();
    } catch (err) {
      toast.error('Save failed');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Clients
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Client
          </button>
        </div>
      </div>
      <ClientTable clients={clients} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
      <ClientFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editClient} />
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
} 