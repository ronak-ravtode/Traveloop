import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Users, PlaneTakeoff, Globe, DollarSign, Lock, Eye, Calendar, MapPin,
  ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Search, Loader2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

// Mock fallback data
const mockAdminStats = {
  totalUsers: 0,
  totalTrips: 0,
  publicTrips: 0,
  averageBudget: 0,
  monthlyGrowth: 0,
  activeUsers: 0,
};

const monthlyTripsData = [
  { month: 'Jan', trips: 45, users: 120 },
  { month: 'Feb', trips: 52, users: 145 },
  { month: 'Mar', trips: 78, users: 198 },
  { month: 'Apr', trips: 95, users: 234 },
  { month: 'May', trips: 112, users: 287 },
  { month: 'Jun', trips: 134, users: 342 },
];

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(mockAdminStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.log('Using mock admin stats');
        // Use mock data on error
        setStats({
          totalUsers: 2847,
          totalTrips: 1523,
          publicTrips: 428,
          averageBudget: 2850,
          monthlyGrowth: 12.5,
          activeUsers: 892,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#0F766E', '#6366F1', '#F59E0B', '#EF4444'];

  const pieData = [
    { name: 'Planning', value: 35 },
    { name: 'Upcoming', value: 25 },
    { name: 'Completed', value: 30 },
    { name: 'Ongoing', value: 10 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Admin Dashboard</h1>
          <p className="text-dark-lighter/60 mt-1">Platform analytics and insights</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Total Users</p>
              <p className="text-xl font-display font-bold text-dark">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <PlaneTakeoff className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Total Trips</p>
              <p className="text-xl font-display font-bold text-dark">{stats.totalTrips.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Public Trips</p>
              <p className="text-xl font-display font-bold text-dark">{stats.publicTrips.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Avg Budget</p>
              <p className="text-xl font-display font-bold text-dark">${stats.averageBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Active Users</p>
              <p className="text-xl font-display font-bold text-dark">{stats.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-dark-lighter/60">Growth</p>
              <p className="text-xl font-display font-bold text-dark">+{stats.monthlyGrowth}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trips Over Time */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Trips & Users Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTripsData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="trips" stackId="1" stroke="#0F766E" fill="#0F766E" fillOpacity={0.3} />
                <Area type="monotone" dataKey="users" stackId="2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trip Status Distribution */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Trip Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-dark-lighter/60">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-dark mb-4">Monthly Trip Creation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTripsData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="trips" fill="#0F766E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;