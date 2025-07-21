import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthContainer from './components/Auth/AuthContainer';
import ResetPassword from './components/Auth/ResetPassword';
import ClientManager from './components/Clients/ClientManager';
import ClientDetails from './components/Clients/ClientDetails';
import Layout from './components/Layout';
import SidePanel from './components/SidePanel';
import Reminders from './components/Reminders';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReminderModal from './components/ReminderModal';
import ThemeTest from './components/ThemeTest';


function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes, clientsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/services/recent', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/clients', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setStats(statsRes.data);
        setRecentActivity(activityRes.data.slice(0, 5));
        setClients(clientsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: '👥',
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.paymentsThisMonth || 0}`,
      icon: '💰',
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pending Payments',
      value: stats?.totalPendingPayments || 0,
      icon: '⏳',
      color: 'bg-yellow-500',
      change: '-5%',
      changeType: 'negative'
    },
    {
      title: 'Services This Month',
      value: stats?.servicesThisMonth || 0,
      icon: '📊',
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${card.color} rounded-lg flex items-center justify-center text-lg lg:text-2xl`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Revenue
          </h3>
          <div className="h-48 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jan', revenue: 4000 },
                { month: 'Feb', revenue: 3000 },
                { month: 'Mar', revenue: 2000 },
                { month: 'Apr', revenue: 2780 },
                { month: 'May', revenue: 1890 },
                { month: 'Jun', revenue: 2390 },
                { month: 'Jul', revenue: 3490 }
              ]}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3 lg:space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No recent activity
              </p>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.client?.name || 'Client'} - ${activity.amount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    activity.status === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {activity.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reminders Section */}
      <Reminders clients={clients} />

              {/* Theme Test - Remove in production */}
        <ThemeTest />
        
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/clients"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              👥
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Manage Clients</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add or edit clients</p>
            </div>
          </Link>
          
          <Link
            to="/calendar"
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              📅
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View Calendar</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check deadlines</p>
            </div>
          </Link>
          
          <Link
            to="/stats"
            className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors sm:col-span-2 lg:col-span-1"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              📊
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analytics & insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CalendarPage() {
  const [value, setValue] = useState(new Date());
  const [dueDates, setDueDates] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [clients, setClients] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dueDatesRes, remindersRes, clientsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/services/due-dates/all', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/reminders/upcoming', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/clients', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        setDueDates(dueDatesRes.data);
        setReminders(remindersRes.data);
        setClients(clientsRes.data);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };
    
    if (token) {
      fetchData();
    }
  }, [token]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const found = dueDates.find(d => new Date(d.dueDate).toDateString() === date.toDateString());
      return found ? 'bg-blue-500 text-white rounded-full' : null;
    }
  };

  const handleAddReminder = () => {
    setShowReminderModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Calendar & Reminders
        </h1>
        <button
          onClick={handleAddReminder}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span>
          Schedule Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Calendar</h2>
          <div className="max-w-md mx-auto">
            <Calendar 
              value={value} 
              onChange={setValue} 
              tileClassName={tileClassName}
              className="w-full"
            />
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Reminders</h2>
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No upcoming reminders</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Schedule a reminder to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder, idx) => (
                <div key={reminder._id || idx} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{reminder.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Due: {new Date(reminder.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      reminder.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {reminder.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <ReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          onSubmit={async (formData) => {
            try {
              await axios.post('http://localhost:5000/api/reminders', formData, {
                headers: { Authorization: `Bearer ${token}` }
              });
              // Refresh reminders
              const remindersRes = await axios.get('http://localhost:5000/api/reminders/upcoming', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setReminders(remindersRes.data);
              setShowReminderModal(false);
            } catch (error) {
              console.error('Error creating reminder:', error);
            }
          }}
          initialData={null}
          clients={clients}
        />
      )}
    </div>
  );
}
function StatsPage() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');
  useEffect(() => {
    axios.get('http://localhost:5000/api/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setStats(res.data));
  }, [token]);
  if (!stats) return <div className="p-8">Loading stats...</div>;
  const COLORS = ['#457B9D', '#A8DADC', '#E63946', '#1D3557', '#F1FAEE', '#8884d8'];
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Stats</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-2xl font-bold">{stats.totalClients}</div>
          <div className="text-gray-600">Total Clients</div>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-2xl font-bold">{stats.totalPendingPayments}</div>
          <div className="text-gray-600">Pending Payments</div>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-2xl font-bold">${stats.paymentsThisMonth}</div>
          <div className="text-gray-600">Payments This Month</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Service Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.serviceTypeDist.map(s => ({ name: s._id, value: s.count }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {stats.serviceTypeDist.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Placeholder for future bar chart */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payments Collected (Bar)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'This Month', value: stats.paymentsThisMonth }]}> 
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#457B9D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthContainer />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                  <SidePanel />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <Layout>
                  <ClientManager />
                  <SidePanel />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ClientDetails />
                  <SidePanel />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Layout>
                  <CalendarPage />
                  <SidePanel />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <Layout>
                  <StatsPage />
                  <SidePanel />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
