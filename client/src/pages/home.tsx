import { useQuery } from "@tanstack/react-query";
import { QuickActionCard } from "@/components/quick-action-card";
import { ActivityItem } from "@/components/activity-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, MessageSquare, CheckSquare, Palette, Clock, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export default function Home() {
  // Fetch recent activities from backend
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activity/recent"],
    retry: false,
    // Fallback to mock data if endpoint doesn't exist yet
    queryFn: async () => {
      try {
        return await apiClient.get<Activity[]>("/api/activity/recent");
      } catch {
        // Mock data fallback
        return [
          {
            id: "1",
            type: "message",
            title: "New conversation started",
            description: "Asked about project management tips",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "2",
            type: "task",
            title: "Task completed",
            description: "Finished 'Review quarterly report'",
            timestamp: new Date(Date.now() - 18000000).toISOString(),
          },
          {
            id: "3",
            type: "preference",
            title: "Preferences updated",
            description: "Changed communication style to casual",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
      }
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageSquare;
      case "task":
        return CheckSquare;
      case "preference":
        return Palette;
      default:
        return Clock;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    return "Just now";
  };

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
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  icon={getIcon(activity.type)}
                  title={activity.title}
                  description={activity.description}
                  time={getTimeAgo(activity.timestamp)}
                />
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
