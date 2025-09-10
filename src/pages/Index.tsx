import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import POSInterface from "@/components/POSInterface";
import InventoryManager from "@/components/InventoryManager";
import HeroSection from "@/components/HeroSection";
import BackendRequiredNotice from "@/components/BackendRequiredNotice";
import AuthModal from "@/components/AuthModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut } from "lucide-react";

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [showApp, setShowApp] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal />;
  }

  if (!showApp) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute top-4 right-4 z-50">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Welcome, <span className="font-semibold">{profile?.full_name || user.email}</span>
              <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                {profile?.role || 'user'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <HeroSection />
        
        {/* Call to Action */}
        <div className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <h2 className="text-3xl font-bold">Ready to Transform Your Business?</h2>
            <p className="text-xl text-muted-foreground">
              Access your personalized POS dashboard with real-time data
            </p>
            <Button 
              size="lg" 
              variant="premium" 
              className="text-lg px-8 py-6"
              onClick={() => setShowApp(true)}
            >
              Enter POS System
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "pos":
        return <POSInterface />;
      case "inventory":
        return <InventoryManager />;
      case "reports":
        return (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
            <p className="text-muted-foreground">
              Advanced reporting features will be available with Supabase integration.
              <br />
              Connect to Supabase to enable AI-powered analytics and insights.
            </p>
          </Card>
        );
      case "users":
        return (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-muted-foreground">
              User authentication and role management requires Supabase.
              <br />
              Connect to Supabase to manage cashiers, admins, and permissions.
            </p>
          </Card>
        );
      case "settings":
        return (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">
              System configuration and preferences will be available here.
            </p>
          </Card>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 lg:ml-0 ml-0">
        <main className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
