import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  Brain, 
  Shield, 
  TrendingUp, 
  Users, 
  BarChart3,
  ShoppingCart,
  Package
} from "lucide-react";
import heroImage from "@/assets/pos-hero-bg.jpg";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered POS System</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
                  Smart POS
                </span>
                <br />
                <span className="text-foreground">
                  for Modern Business
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Revolutionize your retail operations with AI-powered insights, 
                real-time inventory management, and intelligent analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="premium" className="text-lg px-8 py-6">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Selling Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">500+</p>
                <p className="text-sm text-muted-foreground">Businesses</p>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Process transactions in milliseconds with our optimized POS interface.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-accent/20 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI Analytics</h3>
                  <p className="text-muted-foreground">
                    Get intelligent insights and predictions to optimize your business.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-success/20 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure & Reliable</h3>
                  <p className="text-muted-foreground">
                    Bank-level security with real-time data backup and protection.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Package, title: "Inventory Management", desc: "Real-time stock tracking" },
            { icon: BarChart3, title: "Advanced Reports", desc: "AI-powered analytics" },
            { icon: Users, title: "User Management", desc: "Role-based access control" },
            { icon: TrendingUp, title: "Sales Optimization", desc: "Boost your revenue" },
          ].map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;