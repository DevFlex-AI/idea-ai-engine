import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Settings, Bell, User } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold">AIPlatform</span>
            <Badge variant="outline" className="text-xs">Beta</Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="/features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">Docs</a>
            <a href="/admin" className="text-sm font-medium hover:text-primary transition-colors">Admin</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-primary">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 p-4 bg-card/50 backdrop-blur rounded-lg border border-border">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
              <a href="/features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">Docs</a>
              <a href="/admin" className="text-sm font-medium hover:text-primary transition-colors">Admin</a>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1">
                  Sign In
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};