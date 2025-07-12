const Client = require('../models/Client');
const Service = require('../models/Service');

exports.getStats = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const totalPendingPayments = await Service.countDocuments({ status: 'Pending' });
    const paymentsThisMonth = await Service.aggregate([
      {
        $match: {
          status: 'Paid',
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const serviceTypeDist = await Service.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({
      totalClients,
      totalPendingPayments,
      paymentsThisMonth: paymentsThisMonth[0]?.total || 0,
      serviceTypeDist,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 