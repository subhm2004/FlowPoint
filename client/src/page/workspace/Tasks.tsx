import { useState } from "react";
import { KanbanSquare, List } from "lucide-react";

import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import TaskTable from "@/components/workspace/task/task-table";
import TaskBoard from "@/components/workspace/task/task-board";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "board" | "list";

const VIEWS = [
  { id: "board", label: "Board", Icon: KanbanSquare },
  { id: "list", label: "List", Icon: List },
] as const;

export default function Tasks() {
  const [view, setView] = useState<View>("board");

  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            {view === "board"
              ? "Drag a card to move it through the pipeline."
              : "Filter, sort and page through every task in this workspace."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border bg-muted/40 p-0.5">
            {VIEWS.map(({ id, label, Icon }) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant="ghost"
                aria-pressed={view === id}
                onClick={() => setView(id)}
                className={cn(
                  "h-8 gap-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground",
                  view === id &&
                    "bg-background text-foreground shadow-sm hover:bg-background"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
          </div>
          <CreateTaskDialog />
        </div>
      </div>

      <div>{view === "board" ? <TaskBoard /> : <TaskTable />}</div>
    </div>
  );
}
