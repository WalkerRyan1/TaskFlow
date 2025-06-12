export interface TodoItem {
  id: string;
  content: string;
  createdAt: Date;
  completedAt?: Date;
  priority: "low" | "medium" | "high";
  description?: string;
}

export interface Column {
  id: "todo" | "inProgress" | "completed";
  title: string;
  items: TodoItem[];
}

export interface ColumnMap {
  todo: Column;
  inProgress: Column;
  completed: Column;
}
