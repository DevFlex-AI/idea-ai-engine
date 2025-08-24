import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bug, 
  Inbox, 
  Users, 
  CreditCard, 
  Settings, 
  Bell, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Gift
} from "lucide-react";

const Admin = () => {
  const creditStats = {
    free: { used: 45, total: 100 },
    pro: { used: 750, total: 1000 },
    ultra: { used: 250000, total: 1000000 }
  };

  const bugReports = [
    { id: 1, title: "API timeout on large requests", severity: "high", status: "open", reporter: "john@dev.com" },
    { id: 2, title: "UI glitch in mobile view", severity: "medium", status: "in-progress", reporter: "sarah@design.com" },
    { id: 3, title: "Memory leak in background process", severity: "critical", status: "resolved", reporter: "mike@ops.com" }
  ];

  const upcomingFeatures = [
    { id: 1, title: "GPT-5 Integration", eta: "2024-Q2", votes: 234 },
    { id: 2, title: "Custom Model Training", eta: "2024-Q3", votes: 189 },
    { id: 3, title: "Advanced Analytics Dashboard", eta: "2024-Q2", votes: 156 }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pt-20 px-6">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform health and manage features</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bugs">Bug Reports</TabsTrigger>
            <TabsTrigger value="features">Feature Inbox</TabsTrigger>
            <TabsTrigger value="credits">Credit Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </Card>
              
              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Bugs</p>
                    <p className="text-2xl font-bold text-destructive">12</p>
                  </div>
                  <Bug className="w-8 h-8 text-destructive" />
                </div>
              </Card>
              
              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Feature Requests</p>
                    <p className="text-2xl font-bold text-accent">47</p>
                  </div>
                  <Inbox className="w-8 h-8 text-accent" />
                </div>
              </Card>
              
              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-tier-ultra">$47,291</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-tier-ultra" />
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-primary" />
                  Recent Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { type: "bug", message: "New critical bug reported", time: "2 min ago" },
                    { type: "feature", message: "Feature request upvoted", time: "15 min ago" },
                    { type: "user", message: "100 new users registered", time: "1 hour ago" }
                  ].map((notification, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'bug' ? 'bg-destructive' : 
                        notification.type === 'feature' ? 'bg-accent' : 'bg-primary'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-tier-ultra" />
                  Credit Usage Summary
                </h3>
                <div className="space-y-4">
                  {Object.entries(creditStats).map(([tier, stats]) => (
                    <div key={tier} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{tier}</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.used.toLocaleString()} / {stats.total.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(stats.used / stats.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bugs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bug Reports</h2>
              <Button className="bg-gradient-primary">
                <Bug className="w-4 h-4 mr-2" />
                New Bug Report
              </Button>
            </div>
            
            <div className="space-y-4">
              {bugReports.map((bug) => (
                <Card key={bug.id} className="p-6 bg-card/50 backdrop-blur border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{bug.title}</h3>
                        <Badge variant={bug.severity === 'critical' ? 'destructive' : 
                                     bug.severity === 'high' ? 'destructive' : 'secondary'}>
                          {bug.severity}
                        </Badge>
                        <Badge variant={bug.status === 'resolved' ? 'default' : 
                                     bug.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {bug.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {bug.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                          {bug.status === 'open' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {bug.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Reported by {bug.reporter}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Feature Inbox</h2>
              <Button className="bg-gradient-accent">
                <Inbox className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingFeatures.map((feature) => (
                <Card key={feature.id} className="p-6 bg-card/50 backdrop-blur border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>ETA: {feature.eta}</span>
                        <span>👍 {feature.votes} votes</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Deploy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Credit Management</h2>
              <Button className="bg-gradient-primary">
                <Gift className="w-4 h-4 mr-2" />
                Grant Free Credits
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(creditStats).map(([tier, stats]) => (
                <Card key={tier} className="p-6 bg-card/50 backdrop-blur border-border">
                  <h3 className="text-lg font-semibold mb-4 capitalize flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 bg-tier-${tier}`} />
                    {tier} Plan
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {stats.used.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        of {stats.total.toLocaleString()} used
                      </div>
                    </div>
                    <Progress 
                      value={(stats.used / stats.total) * 100} 
                      className="h-3"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Reset
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Adjust
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;