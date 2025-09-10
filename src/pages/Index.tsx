import { useState } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import POSInterface from "@/components/POSInterface";
import InventoryManager from "@/components/InventoryManager";
import HeroSection from "@/components/HeroSection";
import BackendRequiredNotice from "@/components/BackendRequiredNotice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [showApp, setShowApp] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  if (!showApp) {
    return (
      <div className="min-h-screen bg-background">
        <HeroSection />
        
        {/* Call to Action */}
        <div className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <h2 className="text-3xl font-bold">Ready to Transform Your Business?</h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of retail management with our demo interface
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

        {/* Backend Notice */}
        <div className="py-20 px-6 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <BackendRequiredNotice />
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
