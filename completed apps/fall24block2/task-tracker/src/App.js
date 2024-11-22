import React, { useState, createContext, useContext } from 'react';

// CategoryContext to manage available categories
const CategoryContext = createContext();

function CategoryProvider({ children }) {
  const categories = [
    { name: 'Work', color: 'blue' },
    { name: 'Personal', color: 'green' },
    { name: 'Shopping', color: 'orange' },
  ];
  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

// AddTaskForm Component
function AddTaskForm({ onAdd }) {
  const categories = useContext(CategoryContext);

  // Initialize form fields including the new category field
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    dueDate: '',
    category: categories[0].name,
  });

  // Universal change handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    onAdd(formData);
    setFormData({
      title: '',
      priority: 'Medium',
      dueDate: '',
      category: categories[0].name,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-group">
        <label htmlFor="title">
          Task Title: <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
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
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

// TaskItem Component
function TaskItem({ task, onToggle, onDelete }) {
  const categories = useContext(CategoryContext);
  const category = categories.find((cat) => cat.name === task.category);
  const categoryColor = category ? category.color : 'gray';

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''}`}
      style={{ borderLeft: `5px solid ${categoryColor}` }}
      onClick={onToggle}
    >
      <h3>{task.title}</h3>
      <p>Priority: {task.priority}</p>
      <p>Category: {task.category}</p>
      {task.dueDate && <p>Due Date: {task.dueDate}</p>}
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>
        Delete
      </button>
    </div>
  );
}

// App Component
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');

  // Add new task
  const addTask = (task) => {
    const newTask = { ...task, id: tasks.length + 1, completed: false };
    setTasks([...tasks, newTask]);
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Filter tasks by category
  const filteredTasks =
    filterCategory === 'All'
      ? tasks
      : tasks.filter((task) => task.category === filterCategory);

  return (
    <CategoryProvider>
      <div className="app">
        <h1>Task Tracker</h1>

        <AddTaskForm onAdd={addTask} />

        {/* Filter by Category */}
        <div className="filter">
          <label htmlFor="filterCategory">Filter by Category:</label>
          <select
            id="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className="task-list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      </div>
    </CategoryProvider>
  );
}
