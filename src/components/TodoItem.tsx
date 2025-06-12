import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { TodoItem as TodoItemType } from "../types";
import { format } from "date-fns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  item: TodoItemType;
  index: number;
  onEdit: (item: TodoItemType) => void;
}

const TodoItem: React.FC<Props> = ({ item, index, onEdit }) => {
  const theme = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "High Priority";
      case "medium":
        return "Medium Priority";
      case "low":
        return "Low Priority";
      default:
        return "Priority";
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 8 : 1}
          sx={{
            mb: 2,
            backgroundColor: item.completedAt
              ? theme.palette.grey[50]
              : theme.palette.background.paper,
            border: `1px solid ${
              item.completedAt
                ? theme.palette.grey[200]
                : theme.palette.grey[300]
            }`,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title={getPriorityLabel(item.priority)}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: getPriorityColor(item.priority),
                      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                    }}
                  />
                </Tooltip>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    textDecoration: item.completedAt ? "line-through" : "none",
                    color: item.completedAt
                      ? theme.palette.text.secondary
                      : theme.palette.text.primary,
                  }}
                >
                  {item.content}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleEditClick}
                sx={{
                  color: theme.palette.grey[600],
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.light + "20",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            {item.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  color: item.completedAt
                    ? theme.palette.text.disabled
                    : theme.palette.text.secondary,
                }}
              >
                {item.description}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
                pt: 1,
                borderTop: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.text.secondary,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              {item.completedAt && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CheckCircleIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.success.main,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: "0.75rem",
                    }}
                  >
                    Completed
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      )}
    </Draggable>
  );
};

export default TodoItem;
