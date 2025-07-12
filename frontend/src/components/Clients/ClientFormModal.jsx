import React, { useState, useEffect } from 'react';

export default function ClientFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({ name: '', address: '', company: '', phone: '', email: '' });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ name: '', address: '', company: '', phone: '', email: '' });
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
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Client' : 'Add Client'}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue" required />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue" />
          <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue" required />
          <button type="submit" className="bg-blue text-white py-2 rounded hover:bg-navy transition-colors font-semibold">{initialData ? 'Update' : 'Add'} Client</button>
        </form>
      </div>
    </div>
  );
} 