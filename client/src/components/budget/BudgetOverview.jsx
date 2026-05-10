import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const COLORS = ['#0F766E', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const BudgetOverview = ({ budget }) => {
  const { total, spent, categories } = budget;
  const remaining = total - spent;
  const percentSpent = (spent / total) * 100;

  const pieData = Object.entries(categories).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const barData = Object.entries(categories).map(([name, value]) => ({
    category: name.charAt(0).toUpperCase() + name.slice(1),
    amount: value,
    budget: total * 0.15,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-xs text-dark-lighter/60">Total Budget</span>
          </div>
          <p className="text-2xl font-display font-bold text-dark">${total.toLocaleString()}</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs text-dark-lighter/60">Spent</span>
          </div>
          <p className="text-2xl font-display font-bold text-accent">${spent.toLocaleString()}</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span className="text-xs text-dark-lighter/60">Remaining</span>
          </div>
          <p className="text-2xl font-display font-bold text-green-600">${remaining.toLocaleString()}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="h-2 bg-surface-alt rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentSpent > 90 ? 'bg-red-500' : percentSpent > 70 ? 'bg-amber-500' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>
        <p className="text-center text-sm text-dark-lighter/60">{percentSpent.toFixed(0)}% of budget spent</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-dark mb-4">Category Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#0F766E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
