import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, GripVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllTasksQueryFn, updateTaskStatusMutationFn } from "@/lib/api";
import { TaskStatusEnum, TaskStatusEnumType } from "@/constant";
import { TaskType } from "@/types/api.type";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/** Column order is the delivery pipeline, left to right — not the enum's declaration order. */
const COLUMNS: {
  status: TaskStatusEnumType;
  label: string;
  accent: string;
  dot: string;
}[] = [
  {
    status: TaskStatusEnum.BACKLOG,
    label: "Backlog",
    accent: "from-slate-500/15",
    dot: "bg-slate-400",
  },
  {
    status: TaskStatusEnum.TODO,
    label: "To Do",
    accent: "from-blue-500/15",
    dot: "bg-blue-500",
  },
  {
    status: TaskStatusEnum.IN_PROGRESS,
    label: "In Progress",
    accent: "from-amber-500/15",
    dot: "bg-amber-500",
  },
  {
    status: TaskStatusEnum.IN_REVIEW,
    label: "In Review",
    accent: "from-violet-500/15",
    dot: "bg-violet-500",
  },
  {
    status: TaskStatusEnum.DONE,
    label: "Done",
    accent: "from-emerald-500/15",
    dot: "bg-emerald-500",
  },
];

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  LOW: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const isOverdue = (task: TaskType) =>
  task.status !== TaskStatusEnum.DONE &&
  !!task.dueDate &&
  new Date(task.dueDate).getTime() < Date.now();

const formatDue = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const TaskCard = ({
  task,
  overlay = false,
}: {
  task: TaskType;
  overlay?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id, data: { task } });

  const overdue = isOverdue(task);
  const name = task.assignedTo?.name ?? "";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
      className={cn(
        "group cursor-grab touch-none rounded-xl border bg-card p-3.5 text-left shadow-sm transition",
        "hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md active:cursor-grabbing",
        // The original stays in place as a hole; the DragOverlay renders the moving copy.
        isDragging && !overlay && "opacity-40",
        overlay && "rotate-[1.5deg] cursor-grabbing border-foreground/25 shadow-xl"
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition group-hover:text-muted-foreground" />
        <p className="flex-1 text-sm font-medium leading-snug text-foreground">
          {task.title}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-6">
        <span
          className={cn(
            "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            PRIORITY_STYLES[task.priority]
          )}
        >
          {task.priority.toLowerCase()}
        </span>

        {task.project?.emoji && (
          <span className="rounded-md border bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {task.project.emoji} {task.project.name}
          </span>
        )}

        {task.dueDate && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
              overdue
                ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "border-transparent bg-muted/60 text-muted-foreground"
            )}
          >
            {overdue && <AlertCircle className="h-3 w-3" />}
            {formatDue(task.dueDate)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between pl-6">
        <span className="font-mono text-[10px] text-muted-foreground/70">
          {task.taskCode}
        </span>
        {task.assignedTo ? (
          <Avatar className="h-6 w-6 border">
            <AvatarImage src={task.assignedTo.profilePicture ?? undefined} />
            <AvatarFallback
              className={cn("text-[10px]", getAvatarColor(name))}
            >
              {getAvatarFallbackText(name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-[10px] text-muted-foreground/60">
            Unassigned
          </span>
        )}
      </div>
    </div>
  );
};

const Column = ({
  column,
  tasks,
  isDraggingAny,
}: {
  column: (typeof COLUMNS)[number];
  tasks: TaskType[];
  isDraggingAny: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        // Grow to share the width when all five columns fit; fall back to a fixed
        // min-width and let the row scroll when they don't.
        "flex min-w-[216px] flex-1 flex-col rounded-2xl border bg-muted/30 transition",
        isOver && "border-foreground/25 bg-muted/70 ring-2 ring-foreground/10",
        // Only hint at the drop targets while something is actually in the air.
        isDraggingAny && !isOver && "border-dashed"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-t-2xl bg-gradient-to-b to-transparent px-4 py-3",
          column.accent
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", column.dot)} />
          <h3 className="text-sm font-semibold tracking-tight">
            {column.label}
          </h3>
        </div>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div className="scrollbar flex max-h-[calc(100vh-20rem)] min-h-[7rem] flex-1 flex-col gap-2.5 overflow-y-auto p-3 pt-1">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed py-8 text-xs text-muted-foreground">
            {isDraggingAny ? "Drop here" : "Nothing here"}
          </div>
        )}
      </div>
    </div>
  );
};

const BoardSkeleton = () => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {COLUMNS.map((c) => (
      <div key={c.status} className="min-w-[216px] flex-1 space-y-2.5">
        <Skeleton className="h-11 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    ))}
  </div>
);

const TaskBoard = () => {
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  // The board wants every task at once — the table's server-side pagination would
  // otherwise chop columns off at page 1.
  const { data, isLoading } = useQuery({
    queryKey: ["all-tasks", workspaceId, "board"],
    queryFn: () =>
      getAllTasksQueryFn({ workspaceId, pageSize: 200, pageNumber: 1 }),
    enabled: !!workspaceId,
    staleTime: 0,
  });

  const [tasks, setTasks] = useState<TaskType[]>([]);
  useEffect(() => {
    if (data?.tasks) setTasks(data.tasks);
  }, [data]);

  const { mutate } = useMutation({ mutationFn: updateTaskStatusMutationFn });

  const sensors = useSensors(
    // A few pixels of slop, or every click on a card would register as a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const grouped = useMemo(() => {
    const map = {} as Record<TaskStatusEnumType, TaskType[]>;
    for (const c of COLUMNS) map[c.status] = [];
    for (const t of tasks) map[t.status]?.push(t);
    return map;
  }, [tasks]);

  const onDragStart = (event: DragStartEvent) => {
    setActiveTask((event.active.data.current?.task as TaskType) ?? null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const task = active.data.current?.task as TaskType | undefined;
    const target = over.id as TaskStatusEnumType;
    if (!task || !COLUMNS.some((c) => c.status === target)) return;
    if (task.status === target) return;

    const projectId = task.project?._id;
    if (!projectId) {
      toast({
        title: "Cannot move this task",
        description: "It is not attached to a project.",
        variant: "destructive",
      });
      return;
    }

    const previous = tasks;
    // Move the card now; the request catches up. If it fails we put it back.
    setTasks((current) =>
      current.map((t) => (t._id === task._id ? { ...t, status: target } : t))
    );

    mutate(
      { taskId: task._id, projectId, workspaceId, status: target },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
          queryClient.invalidateQueries({ queryKey: ["task-analytics"] });
        },
        onError: (error) => {
          setTasks(previous);
          toast({
            title: "Could not move task",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) return <BoardSkeleton />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="scrollbar flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <Column
            key={column.status}
            column={column}
            tasks={grouped[column.status] ?? []}
            isDraggingAny={!!activeTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask && <TaskCard task={activeTask} overlay />}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
