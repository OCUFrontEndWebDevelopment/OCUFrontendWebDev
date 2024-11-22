import React, { useState, useEffect } from "react";
import "./App.css";

// TaskItem component with due date reminder
function TaskItem({ id, title, priority, completed, dueDate, onToggle, onDelete }) {
  const isOverdue = new Date(dueDate) < new Date() && !completed;
  const isDueSoon = new Date(dueDate) - new Date() <= 86400000 && !completed; // within 1 day

  return (
    <div
      className={`task-item ${completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''}`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <div>
        <h3>{title}</h3>
        <p>Priority: {priority}</p>
        <p>Due Date: {new Date(dueDate).toLocaleDateString()}</p>
      </div>
      {isOverdue && <p className="overdue-warning">Overdue!</p>}
      {isDueSoon && <p className="due-soon-warning">Due Soon!</p>}
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

// TaskList component
function TaskList({ tasks, setTasks }) {
  const toggleTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="task-list-container">
      {tasks.length > 0 ? (
        <div className="tasks">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority}
              completed={task.completed}
              dueDate={task.dueDate}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      ) : (
        <p className="no-results">No tasks available</p>
      )}
    </div>
  );
}

// AddTaskForm component with due date input
function AddTaskForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now(),
      completed: false,
    });
    setFormData({ title: '', priority: 'Medium', dueDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-group">
        <label htmlFor="title">Task Title:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority Level:</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date:</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

// Main App component
export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const toggleTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="App">
      <h1>Task Tracker</h1>
      <AddTaskForm onAdd={addTask} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
