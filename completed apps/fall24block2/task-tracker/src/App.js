// App.js
import React, { useState } from "react";
import "./styles.css";
import AddTaskForm from "./AddTaskForm";
import TaskItem from "./TaskItem";
import Statistics from "./Statistics";

// App Component
export default function App() {
  const [tasks, setTasks] = useState([]);

  // Add new task
  const addTask = (task) => {
    const newTask = { ...task, id: tasks.length + 1, completed: false, createdAt: new Date() };
    setTasks([...tasks, newTask]);
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : null,
            }
          : task
      )
    );
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="app">
      <h1>Task Tracker</h1>

      {/* Add Task Form */}
      <AddTaskForm onAdd={addTask} />

      {/* Statistics Dashboard */}
      <Statistics tasks={tasks} />

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
