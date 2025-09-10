import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Calendar
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "accent";
}

const MetricCard = ({ title, value, trend, icon, color = "primary" }: MetricCardProps) => {
  const colorClasses = {
    primary: "bg-gradient-to-br from-primary/20 to-primary-dark/20 border-primary/30",
    success: "bg-gradient-to-br from-success/20 to-success/30 border-success/30",
    warning: "bg-gradient-to-br from-warning/20 to-warning/30 border-warning/30",
    accent: "bg-gradient-to-br from-accent/20 to-accent/30 border-accent/30",
  };

  return (
    <Card className={`p-6 ${colorClasses[color]} backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{trend}</p>
        </div>
        <div className="text-primary w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            POS Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Sales"
          value="$1,247"
          trend="+12.5% from yesterday"
          icon={<DollarSign className="w-6 h-6" />}
          color="success"
        />
        <MetricCard
          title="Total Transactions"
          value="24"
          trend="+8 from yesterday"
          icon={<ShoppingCart className="w-6 h-6" />}
          color="primary"
        />
        <MetricCard
          title="Low Stock Items"
          value="3"
          trend="Requires attention"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="warning"
        />
        <MetricCard
          title="Revenue Growth"
          value="+23%"
          trend="This month vs last"
          icon={<TrendingUp className="w-6 h-6" />}
          color="accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary-dark/10 border-primary/20 hover:scale-105 transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Start Sale</h3>
              <p className="text-muted-foreground text-sm">Begin a new transaction</p>
            </div>
            <Button className="w-full">
              Open POS
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20 hover:scale-105 transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Manage Inventory</h3>
              <p className="text-muted-foreground text-sm">Add or update products</p>
            </div>
            <Button variant="outline" className="w-full">
              Open Inventory
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/20 border-success/20 hover:scale-105 transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">View Reports</h3>
              <p className="text-muted-foreground text-sm">Analyze your sales data</p>
            </div>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[
            { id: "#001", customer: "Walk-in Customer", total: "$45.99", time: "2 minutes ago" },
            { id: "#002", customer: "John Doe", total: "$127.50", time: "15 minutes ago" },
            { id: "#003", customer: "Walk-in Customer", total: "$23.75", time: "32 minutes ago" },
          ].map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{transaction.id} - {transaction.customer}</p>
                  <p className="text-sm text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
              <p className="font-semibold text-lg">{transaction.total}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;