import { TaskCard } from "../task-card";

export default function TaskCardExample() {
  return (
    <div className="p-4 max-w-2xl space-y-3">
      <TaskCard
        id="1"
        title="Review quarterly report"
        description="Go through Q4 metrics and prepare summary"
        completed={false}
        onToggle={(id) => console.log("Toggle task:", id)}
        onEdit={(id) => console.log("Edit task:", id)}
        onDelete={(id) => console.log("Delete task:", id)}
      />
      <TaskCard
        id="2"
        title="Update documentation"
        completed={true}
        onToggle={(id) => console.log("Toggle task:", id)}
        onEdit={(id) => console.log("Edit task:", id)}
        onDelete={(id) => console.log("Delete task:", id)}
      />
    </div>
  );
}
