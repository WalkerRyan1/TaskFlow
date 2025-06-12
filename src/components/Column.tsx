import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import { Column as ColumnType, TodoItem as TodoItemType } from "../types";
import TodoItem from "./TodoItem";

interface Props {
  column: ColumnType;
  onEditItem: (item: TodoItemType) => void;
}

const Column: React.FC<Props> = ({ column, onEditItem }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.grey[200]}`,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 200px)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {column.title}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.text.secondary,
              borderRadius: "12px",
              px: 1,
              py: 0.5,
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {column.items.length}
          </Box>
        </Typography>
      </Box>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              p: 2,
              backgroundColor: snapshot.isDraggingOver
                ? theme.palette.grey[50]
                : "transparent",
              transition: "background-color 0.2s ease",
              overflowY: "auto",
              minHeight: 100,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.grey[300],
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: theme.palette.grey[400],
                },
              },
            }}
          >
            {column.items.map((item, index) => (
              <TodoItem
                key={item.id}
                item={item}
                index={index}
                onEdit={() => onEditItem(item)}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default Column;
