import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { analyticsService } from "@/lib/database";
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
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await analyticsService.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            POS Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || 'User'}! Here's your business overview.
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
          value={`$${metrics?.todaySales?.total?.toFixed(2) || '0.00'}`}
          trend={`${metrics?.todaySales?.count || 0} transactions today`}
          icon={<DollarSign className="w-6 h-6" />}
          color="success"
        />
        <MetricCard
          title="Total Transactions"
          value={`${metrics?.todaySales?.count || 0}`}
          trend="Today's transaction count"
          icon={<ShoppingCart className="w-6 h-6" />}
          color="primary"
        />
        <MetricCard
          title="Low Stock Items"
          value={`${metrics?.lowStockCount || 0}`}
          trend={metrics?.lowStockCount > 0 ? "Requires attention" : "All items in stock"}
          icon={<AlertTriangle className="w-6 h-6" />}
          color={metrics?.lowStockCount > 0 ? "warning" : "success"}
        />
        <MetricCard
          title="Total Products"
          value={`${metrics?.totalProducts || 0}`}
          trend="Active products in inventory"
          icon={<Package className="w-6 h-6" />}
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
          {metrics?.recentSales?.length > 0 ? (
            metrics.recentSales.map((transaction: any, index: number) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.sale_number} - {transaction.customer_name || 'Walk-in Customer'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-lg">${Number(transaction.total_amount).toFixed(2)}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent transactions</p>
              <p className="text-sm">Start making sales to see them here</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;