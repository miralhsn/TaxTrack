const Client = require('../models/Client');

exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    client.documents.push(req.file.filename);
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id, documentName } = req.params;
    const client = await Client.findById(id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Find the document in the client's documents array
    const documentIndex = client.documents.findIndex(doc => doc === documentName);
    
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Remove the document from the array
    client.documents.splice(documentIndex, 1);
    await client.save();
    
    // Note: In a production environment, you might want to also delete the actual file
    // from the filesystem here using fs.unlink()
    
    res.json({ message: 'Document deleted successfully', client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 