import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, PlaneTakeoff, DollarSign, MapPin, TrendingUp, Globe, Calendar, Eye } from 'lucide-react';

const AdminAnalytics = () => {
  const monthlyTrips = [
    { month: 'Jan', trips: 12 },
    { month: 'Feb', trips: 19 },
    { month: 'Mar', trips: 25 },
    { month: 'Apr', trips: 32 },
    { month: 'May', trips: 28 },
    { month: 'Jun', trips: 41 },
  ];

  const budgetStats = [
    { name: 'Flights', value: 35 },
    { name: 'Hotels', value: 28 },
    { name: 'Food', value: 18 },
    { name: 'Activities', value: 12 },
    { name: 'Other', value: 7 },
  ];

  const topCities = [
    { city: 'Paris', trips: 245 },
    { city: 'Tokyo', trips: 198 },
    { city: 'New York', trips: 187 },
    { city: 'Barcelona', trips: 156 },
    { city: 'Bali', trips: 142 },
  ];

  const COLORS = ['#0F766E', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

  const kpis = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Trips', value: '1,294', change: '+8%', icon: PlaneTakeoff, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Revenue', value: '$48.2K', change: '+23%', icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Cities Covered', value: '156', change: '+5', icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Admin Analytics</h1>
        <p className="text-dark-lighter/60 mt-1">Overview of Traveloop platform metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-dark">{value}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-green-600 font-medium">{change}</span>
              <span className="text-xs text-dark-lighter/60">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Monthly Trips Created</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrips}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="trips" stroke="#0F766E" strokeWidth={2} dot={{ fill: '#0F766E' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Average Budget by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCities}>
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Top Destinations</h3>
          <div className="space-y-3">
            {topCities.map((c, i) => (
              <div key={c.city} className="flex items-center gap-3">
                <span className="w-6 text-center font-semibold text-dark-lighter/60">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-dark">{c.city}</p>
                  <p className="text-xs text-dark-lighter/60">{c.trips} trips</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Spending Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetStats} cx="50%" cy="50%" outerRadius={60} dataKey="value" label>
                  {budgetStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {budgetStats.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-xs text-dark-lighter/60">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { user: 'Sarah M.', action: 'created trip', item: 'Paris Adventure', time: '2m ago' },
              { user: 'John D.', action: 'added activity', item: 'Louvre Museum', time: '15m ago' },
              { user: 'Emma W.', action: 'shared itinerary', item: 'Tokyo 2024', time: '1h ago' },
              { user: 'Michael K.', action: 'updated budget', item: 'Bali Escape', time: '2h ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white text-xs font-semibold">
                  {item.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark">
                    <span className="font-medium">{item.user}</span> {item.action}{' '}
                    <span className="text-primary">{item.item}</span>
                  </p>
                  <p className="text-xs text-dark-lighter/60">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
