import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Zap, Shield, Users } from "lucide-react";

const BackendRequiredNotice = () => {
  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Database className="w-8 h-8 text-primary" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-3">Connect to Supabase</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            To unlock the full power of this AI-powered POS system, including user authentication, 
            database storage, real-time inventory tracking, and AI analytics, you'll need to connect to Supabase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-muted-foreground">
              Secure authentication with role-based access for admins and cashiers
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold">Real-time Data</h3>
            <p className="text-sm text-muted-foreground">
              Live inventory updates, sales tracking, and instant synchronization
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold">AI Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent insights, demand forecasting, and natural language queries
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button size="lg" variant="premium" className="text-lg px-8">
            <Database className="w-5 h-5 mr-2" />
            Connect Supabase Now
          </Button>
          <p className="text-sm text-muted-foreground">
            Click the green Supabase button in the top right of your Lovable interface
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BackendRequiredNotice;