import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Users, PlaneTakeoff, Globe, DollarSign, Lock, Eye, Calendar, MapPin,
  ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../data/mockTripService';
import { mockCities } from '../data/mockCities';
import { mockActivities } from '../data/mockActivities';

// Mock admin data
const mockAdminStats = {
  totalUsers: 2847,
  totalTrips: 1523,
  publicTrips: 428,
  averageBudget: 2850,
  monthlyGrowth: 12.5,
  activeUsers: 892,
};

const mockRecentUsers = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@travel.com', trips: 12, joined: '2024-06-15', status: 'active' },
  { id: 'u2', name: 'Maria Garcia', email: 'maria.g@example.com', trips: 8, joined: '2024-06-12', status: 'active' },
  { id: 'u3', name: 'James Wilson', email: 'j.wilson@email.com', trips: 5, joined: '2024-06-10', status: 'active' },
  { id: 'u4', name: 'Sophie Martin', email: 'sophie.m@demo.com', trips: 3, joined: '2024-06-08', status: 'new' },
  { id: 'u5', name: 'David Chen', email: 'dchen@test.com', trips: 15, joined: '2024-06-01', status: 'active' },
];

const mockRecentTrips = [
  { id: 't1', title: 'European Summer Adventure', user: 'Alex Johnson', status: 'upcoming', budget: 3500, date: '2024-07-01' },
  { id: 't2', title: 'Tokyo Exploration', user: 'Maria Garcia', status: 'planning', budget: 4200, date: '2024-08-15' },
  { id: 't3', title: 'NYC Weekend Getaway', user: 'James Wilson', status: 'completed', budget: 1800, date: '2024-05-20' },
  { id: 't4', title: 'Bali Retreat', user: 'Sophie Martin', status: 'upcoming', budget: 2200, date: '2024-09-10' },
  { id: 't5', title: 'Paris Anniversary', user: 'David Chen', status: 'planning', budget: 4500, date: '2024-10-05' },
];

// Chart data
const monthlyTripsData = [
  { month: 'Jan', trips: 45, users: 120 },
  { month: 'Feb', trips: 52, users: 145 },
  { month: 'Mar', trips: 78, users: 198 },
  { month: 'Apr', trips: 95, users: 234 },
  { month: 'May', trips: 112, users: 287 },
  { month: 'Jun', trips: 134, users: 342 },
  { month: 'Jul', trips: 156, users: 398 },
  { month: 'Aug', trips: 142, users: 356 },
];

const topCitiesData = mockCities.slice(0, 6).map(city => ({
  city: city.name,
  country: city.country,
  trips: Math.floor(Math.random() * 200) + 50,
  popularity: city.popularity,
})).sort((a, b) => b.trips - a.trips);

const categoryData = [
  { category: 'Sightseeing', value: 35, color: '#0F766E' },
  { category: 'Food & Dining', value: 25, color: '#F59E0B' },
  { category: 'Cultural', value: 20, color: '#6366F1' },
  { category: 'Outdoor', value: 12, color: '#10B981' },
  { category: 'Shopping', value: 8, color: '#EC4899' },
];

const budgetDistribution = [
  { range: '$0-1K', trips: 234, percentage: 15 },
  { range: '$1K-2K', trips: 456, percentage: 30 },
  { range: '$2K-3K', trips: 389, percentage: 26 },
  { range: '$3K-4K', trips: 267, percentage: 18 },
  { range: '$4K+', trips: 177, percentage: 11 },
];

const COLORS = ['#0F766E', '#F59E0B', '#6366F1', '#10B981', '#EC4899'];

// Access Denied Component
const AccessDenied = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center card p-12 max-w-md">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-display font-bold text-dark mb-3">Access Denied</h2>
      <p className="text-dark-lighter/60 mb-6">
        This page is restricted to administrators only. Please contact your administrator for access.
      </p>
      <div className="bg-surface-alt rounded-xl p-4 text-left">
        <p className="text-sm text-dark-lighter/60 mb-2">To access this page:</p>
        <p className="text-sm text-dark font-medium">Your email must contain "admin"</p>
        <p className="text-xs text-dark-lighter/50 mt-1">Example: admin@traveloop.com</p>
      </div>
    </div>
  </div>
);

const AdminAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user has admin access
  const isAdmin = user?.email?.toLowerCase().includes('admin');

  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Get real trip data
  const allTrips = tripService.getAll();

  const kpis = [
    {
      label: 'Total Users',
      value: mockAdminStats.totalUsers.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
      desc: 'Registered users'
    },
    {
      label: 'Total Trips',
      value: mockAdminStats.totalTrips.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: PlaneTakeoff,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      desc: 'Created trips'
    },
    {
      label: 'Public Trips',
      value: mockAdminStats.publicTrips.toLocaleString(),
      change: '+15.3%',
      trend: 'up',
      icon: Globe,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      desc: 'Shared publicly'
    },
    {
      label: 'Avg Budget',
      value: `$${mockAdminStats.averageBudget.toLocaleString()}`,
      change: '+5.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      desc: 'Per trip'
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'trips', label: 'Trips', icon: PlaneTakeoff },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </span>
            Admin Analytics
          </h1>
          <p className="text-dark-lighter/60 mt-1">Platform overview and metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700">Live Data</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-lighter/10 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-dark-lighter/60 hover:bg-surface-alt hover:text-dark'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(({ label, value, change, trend, icon: Icon, color, bg, desc }) => (
              <div key={label} className="card p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {change}
                  </div>
                </div>
                <p className="text-2xl font-display font-bold text-dark">{value}</p>
                <p className="text-sm text-dark-lighter/60 mt-1">{label}</p>
                <p className="text-xs text-dark-lighter/40">{desc}</p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-dark">Trips & Users Growth</h3>
                <span className="text-xs text-dark-lighter/60 bg-surface-alt px-2 py-1 rounded">Last 8 months</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTripsData}>
                    <defs>
                      <linearGradient id="tripGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="trips" stroke="#0F766E" strokeWidth={2} fill="url(#tripGradient)" />
                    <Area type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={2} fill="url(#userGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-dark-lighter/60">Trips</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-xs text-dark-lighter/60">Users</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-semibold text-dark mb-4">Budget Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetDistribution} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="range" width={60} />
                    <Tooltip />
                    <Bar dataKey="trips" fill="#6366F1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <h3 className="font-display font-semibold text-dark mb-4">Top Destinations</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCitiesData.slice(0, 5)} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="city" width={80} />
                    <Tooltip />
                    <Bar dataKey="trips" fill="#0F766E" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-semibold text-dark mb-4">Activity Categories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {categoryData.map((item, i) => (
                  <div key={item.category} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-dark-lighter/60">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-semibold text-dark mb-4">Real-time Activity</h3>
              <div className="space-y-4">
                {[
                  { user: 'Alex J.', action: 'created trip', target: 'Paris Adventure', time: '2m ago', type: 'trip' },
                  { user: 'Maria G.', action: 'updated', target: 'Tokyo itinerary', time: '5m ago', type: 'update' },
                  { user: 'John D.', action: 'shared', target: 'Rome trip', time: '12m ago', type: 'share' },
                  { user: 'Emma W.', action: 'added note', target: 'Bali checklist', time: '18m ago', type: 'note' },
                  { user: 'David C.', action: 'booked', target: 'Flight to NYC', time: '25m ago', type: 'book' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-alt transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold">
                      {item.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark">
                        <span className="font-medium">{item.user}</span>{' '}
                        <span className="text-dark-lighter/60">{item.action}</span>{' '}
                        <span className="text-primary truncate">{item.target}</span>
                      </p>
                      <p className="text-xs text-dark-lighter/40">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-dark">Recent Users</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-lighter/40" />
              <input
                type="text"
                placeholder="Search users..."
                className="input-field pl-9 py-2 w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-lighter/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Trips</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentUsers.map(user => (
                  <tr key={user.id} className="border-b border-dark-lighter/5 hover:bg-surface-alt">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white text-sm font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-dark">{user.name}</p>
                          <p className="text-xs text-dark-lighter/60">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-dark-lighter/70">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-dark">{user.trips}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary hover:underline text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-dark">Recent Trips</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-lighter/40" />
              <input
                type="text"
                placeholder="Search trips..."
                className="input-field pl-9 py-2 w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-lighter/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Trip</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Budget</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-dark-lighter/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentTrips.map(trip => (
                  <tr key={trip.id} className="border-b border-dark-lighter/5 hover:bg-surface-alt">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <PlaneTakeoff className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-dark">{trip.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-dark-lighter/70">{trip.user}</td>
                    <td className="py-3 px-4 text-sm text-dark-lighter/70">
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-dark">${trip.budget.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'completed' ? 'bg-green-50 text-green-600' :
                        trip.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary hover:underline text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Destinations Tab */}
      {activeTab === 'destinations' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-display font-semibold text-dark mb-4">Popular Destinations</h3>
            <div className="space-y-4">
              {topCitiesData.map((city, i) => (
                <div key={city.city} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-alt transition-colors">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <img
                    src={mockCities.find(c => c.name === city.city)?.image}
                    alt={city.city}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-dark">{city.city}</h4>
                    <p className="text-sm text-dark-lighter/60">{city.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-dark">{city.trips}</p>
                    <p className="text-xs text-dark-lighter/60">trips</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display font-semibold text-dark mb-4">Activity Popularity</h3>
            <div className="space-y-4">
              {categoryData.map((cat, i) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-dark">{cat.category}</span>
                    <span className="text-sm text-dark-lighter/60">{cat.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.value}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;