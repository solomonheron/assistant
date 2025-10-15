import { MessageSquare, CheckSquare, Palette, Sparkles, Clock } from "lucide-react";
import { QuickActionCard } from "@/components/quick-action-card";
import { ActivityItem } from "@/components/activity-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  // todo: remove mock functionality
  const recentActivities = [
    {
      icon: MessageSquare,
      title: "New conversation started",
      description: "Asked about project management tips",
      time: "2 hours ago",
    },
    {
      icon: CheckSquare,
      title: "Task completed",
      description: "Finished 'Review quarterly report'",
      time: "5 hours ago",
    },
    {
      icon: Palette,
      title: "Preferences updated",
      description: "Changed communication style to casual",
      time: "1 day ago",
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Welcome back!</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your personal AI assistant is ready to help you stay productive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Start a Chat"
            description="Have a conversation with your AI assistant"
            icon={MessageSquare}
            href="/chat"
            testId="card-quick-chat"
          />
          <QuickActionCard
            title="Manage Tasks"
            description="View and organize your task list"
            icon={CheckSquare}
            href="/tasks"
            testId="card-quick-tasks"
          />
          <QuickActionCard
            title="Personalize"
            description="Customize your AI experience"
            icon={Palette}
            href="/personalization"
            testId="card-quick-personalize"
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
