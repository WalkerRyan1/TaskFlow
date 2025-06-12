import React, { useState } from "react";
import {
  DragDropContext,
  DropResult,
  DragStart,
  DragUpdate,
} from "react-beautiful-dnd";
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Column from "./components/Column";
import { ColumnMap, TodoItem } from "./types";

const initialColumns: ColumnMap = {
  todo: {
    id: "todo",
    title: "To Do",
    items: [],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    items: [],
  },
  completed: {
    id: "completed",
    title: "Completed",
    items: [],
  },
};

function App() {
  const theme = useTheme();
  const [columns, setColumns] = useState<ColumnMap>(initialColumns);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TodoItem | null>(null);
  const [newItem, setNewItem] = useState({
    content: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  const onDragStart = (start: DragStart) => {
    console.log("Drag started:", start);
  };

  const onDragUpdate = (update: DragUpdate) => {
    console.log("Drag updated:", update);
  };

  const handleDragEnd = (result: DropResult) => {
    console.log("Drag ended:", result);
    const { source, destination } = result;

    if (!destination) {
      console.log("No destination found");
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log("Dropped in same position");
      return;
    }

    const newColumns = { ...columns };

    if (source.droppableId === destination.droppableId) {
      console.log("Moving within same column");
      const column = newColumns[source.droppableId as keyof ColumnMap];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      newColumns[source.droppableId as keyof ColumnMap] = {
        ...column,
        items: copiedItems,
      };
    } else {
      console.log("Moving to different column");
      const sourceColumn = newColumns[source.droppableId as keyof ColumnMap];
      const destColumn = newColumns[destination.droppableId as keyof ColumnMap];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

      if (destination.droppableId === "completed") {
        removed.completedAt = new Date();
      } else {
        removed.completedAt = undefined;
      }

      destItems.splice(destination.index, 0, removed);

      newColumns[source.droppableId as keyof ColumnMap] = {
        ...sourceColumn,
        items: sourceItems,
      };
      newColumns[destination.droppableId as keyof ColumnMap] = {
        ...destColumn,
        items: destItems,
      };
    }

    setColumns(newColumns);
  };

  const handleAddItem = () => {
    if (!newItem.content.trim()) return;

    const newTodoItem: TodoItem = {
      id: uuidv4(),
      content: newItem.content.trim(),
      description: newItem.description.trim(),
      priority: newItem.priority,
      createdAt: new Date(),
    };

    const newColumns = { ...columns };
    newColumns.todo.items = [...newColumns.todo.items, newTodoItem];
    setColumns(newColumns);

    setNewItem({
      content: "",
      description: "",
      priority: "medium",
    });
    setOpen(false);
  };

  const handleEditItem = (item: TodoItem) => {
    setEditingItem(item);
    setNewItem({
      content: item.content,
      description: item.description || "",
      priority: item.priority,
    });
    setOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const updatedItem = {
      ...editingItem,
      content: newItem.content.trim(),
      description: newItem.description.trim(),
      priority: newItem.priority,
    };

    const newColumns = { ...columns };
    Object.keys(newColumns).forEach((columnId) => {
      const column = newColumns[columnId as keyof ColumnMap];
      const itemIndex = column.items.findIndex(
        (item) => item.id === editingItem.id
      );
      if (itemIndex !== -1) {
        column.items[itemIndex] = updatedItem;
      }
    });

    setColumns(newColumns);
    setEditingItem(null);
    setNewItem({
      content: "",
      description: "",
      priority: "medium",
    });
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingItem(null);
    setNewItem({
      content: "",
      description: "",
      priority: "medium",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[50],
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: theme.palette.grey[700] }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            TaskFlow
          </Typography>
          <IconButton color="inherit" sx={{ color: theme.palette.grey[700] }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ color: theme.palette.grey[700], ml: 1 }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  letterSpacing: "-0.5px",
                  mb: 1,
                }}
              >
                TaskFlow
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "1rem",
                }}
              >
                Manage your tasks and track your progress
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1.5,
                fontSize: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                },
              }}
            >
              Add New Task
            </Button>
          </Box>

          <DragDropContext
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={handleDragEnd}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "space-between",
                minHeight: "calc(100vh - 250px)",
                alignItems: "flex-start",
              }}
            >
              {Object.values(columns).map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onEditItem={handleEditItem}
                />
              ))}
            </Box>
          </DragDropContext>
        </Container>
      </Box>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 600,
            color: theme.palette.primary.main,
            fontSize: "1.5rem",
          }}
        >
          {editingItem ? "Edit Task" : "Add New Task"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={newItem.content}
            onChange={(e) =>
              setNewItem({ ...newItem, content: e.target.value })
            }
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            select
            margin="dense"
            label="Priority"
            fullWidth
            value={newItem.priority}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                priority: e.target.value as "low" | "medium" | "high",
              })
            }
            variant="outlined"
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: "none",
              px: 3,
              color: theme.palette.text.secondary,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingItem ? handleSaveEdit : handleAddItem}
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              px: 3,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              },
            }}
          >
            {editingItem ? "Save Changes" : "Add Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
