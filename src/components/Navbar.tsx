import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";
import { Brain, Menu, X, User, LogOut, Settings, Bell } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, profile } = useAuth();
  const { getSubscriptionPlan } = useSubscription();

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Vortex
            </span>
            <Badge variant="outline" className="text-xs">Pro</Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Builder
                </Link>
                <a href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
                  Projects
                </a>
                <a href="/templates" className="text-sm font-medium hover:text-primary transition-colors">
                  Templates
                </a>
                <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                  Docs
                </a>
              </>
            ) : (
              <>
                <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                  Pricing
                </a>
                <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                  Docs
                </a>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Badge variant="secondary" className="bg-gradient-primary/10 border-primary/20">
                  <span className="text-xs font-medium">
                    {profile?.credits || 0} credits
                  </span>
                </Badge>
                
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{getSubscriptionPlan()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/admin" className="flex items-center w-full">
                        <Brain className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-primary hover:shadow-glow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
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
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.credits || 0} credits
                      </p>
                    </div>
                  </div>
                  
                  <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                    Builder
                  </Link>
                  <a href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
                    Projects
                  </a>
                  <a href="/templates" className="text-sm font-medium hover:text-primary transition-colors">
                    Templates
                  </a>
                  <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                    Docs
                  </a>
                  <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                    Admin
                  </Link>
                  
                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={signOut}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                    Features
                  </a>
                  <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                    Pricing
                  </a>
                  <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                    Docs
                  </a>
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Link to="/auth" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" className="flex-1">
                      <Button size="sm" className="w-full bg-gradient-primary">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};