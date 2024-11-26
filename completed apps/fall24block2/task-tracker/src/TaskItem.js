// TaskItem.js
import React from "react";

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""}`}
      onClick={onToggle}
    >
      <h3>{task.title}</h3>
      <p>Priority: {task.priority}</p>
      {task.dueDate && <p>Due Date: {task.dueDate}</p>}
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</button>
    </div>
  );
}

export default TaskItem;
