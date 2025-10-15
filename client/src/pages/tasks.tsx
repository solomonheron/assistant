import { useState } from "react";
import { TaskCard } from "@/components/task-card";
import { TaskDialog } from "@/components/task-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ListTodo } from "lucide-react";

export default function Tasks() {
  // todo: remove mock functionality
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Review quarterly report",
      description: "Go through Q4 metrics and prepare summary",
      completed: false,
    },
    {
      id: "2",
      title: "Schedule team meeting",
      description: "Coordinate with team for weekly sync",
      completed: false,
    },
    {
      id: "3",
      title: "Update project documentation",
      description: "",
      completed: true,
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<typeof tasks[0] | null>(null);

  const handleToggle = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleEdit = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setDialogMode("edit");
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleSave = (taskData: { title: string; description: string }) => {
    if (dialogMode === "create") {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    } else if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...task, ...taskData } : task
      ));
    }
    setEditingTask(null);
  };

  const handleCreateNew = () => {
    setEditingTask(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ListTodo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Tasks</h1>
          </div>
          <Button onClick={handleCreateNew} data-testid="button-add-task">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all" data-testid="tab-all">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">
              Active ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No tasks yet. Create one to get started!</p>
              </div>
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-3 mt-6">
            {activeTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No active tasks</p>
              </div>
            ) : (
              activeTasks.map(task => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 mt-6">
            {completedTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No completed tasks</p>
              </div>
            ) : (
              completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          initialData={editingTask ? { title: editingTask.title, description: editingTask.description || "" } : undefined}
          mode={dialogMode}
        />
      </div>
    </div>
  );
}
