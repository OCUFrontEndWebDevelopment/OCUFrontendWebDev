// // App.js
// import React, { useState, useEffect, useMemo } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import "./App.css";

// // Define a constant for the drag type
// const TASK_TYPE = "TASK";

// // TaskItem component with drag-and-drop enabled
// function TaskItem({ id, index, title, priority, completed, onToggle, onDelete, moveTask }) {
//   const ref = React.useRef(null);

//   // Drag hook
//   const [{ isDragging }, drag] = useDrag({
//     type: TASK_TYPE,
//     item: { id, index },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   // Drop hook
//   const [, drop] = useDrop({
//     accept: TASK_TYPE,
//     hover: (item) => {
//       if (item.index !== index) {
//         moveTask(item.index, index);
//         item.index = index;
//       }
//     },
//   });

//   // Combine drag and drop refs
//   drag(drop(ref));

//   return (
//     <div
//       ref={ref}
//       className={`task-item ${completed ? 'completed' : ''}`}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//     >
//       <input
//         type="checkbox"
//         checked={completed}
//         onChange={() => onToggle(id)}
//       />
//       <div>
//         <h3>{title}</h3>
//         <p>Priority: {priority}</p>
//       </div>
//       <button onClick={() => onDelete(id)}>Delete</button>
//     </div>
//   );
// }

// // TaskList component with moveTask function
// function TaskList({ tasks, setTasks }) {
//   const moveTask = (fromIndex, toIndex) => {
//     setTasks((prevTasks) => {
//       const updatedTasks = [...prevTasks];
//       const [movedTask] = updatedTasks.splice(fromIndex, 1);
//       updatedTasks.splice(toIndex, 0, movedTask);
//       return updatedTasks;
//     });
//   };

//   const toggleTask = (taskId) => {
//     setTasks(prevTasks =>
//       prevTasks.map(task =>
//         task.id === taskId ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   const deleteTask = (taskId) => {
//     setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="task-list-container">
//         {tasks.length > 0 ? (
//           <div className="tasks">
//             {tasks.map((task, index) => (
//               <TaskItem
//                 key={task.id}
//                 id={task.id}
//                 index={index}
//                 title={task.title}
//                 priority={task.priority}
//                 completed={task.completed}
//                 onToggle={() => toggleTask(task.id)}
//                 onDelete={() => deleteTask(task.id)}
//                 moveTask={moveTask} // Pass moveTask function to TaskItem
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="no-results">No tasks match your filters</p>
//         )}
//       </div>
//     </DndProvider>
//   );
// }

// // AddTaskForm component
// function AddTaskForm({ onAdd }) {
//   const [formData, setFormData] = useState({
//     title: '',
//     priority: 'Medium',
//     dueDate: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onAdd({
//       ...formData,
//       id: Date.now(),
//       completed: false,
//     });
//     setFormData({ title: '', priority: 'Medium', dueDate: '' });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="add-task-form">
//       <div className="form-group">
//         <label htmlFor="title">Task Title:</label>
//         <input
//           id="title"
//           name="title"
//           type="text"
//           value={formData.title}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="priority">Priority Level:</label>
//         <select
//           id="priority"
//           name="priority"
//           value={formData.priority}
//           onChange={handleChange}
//         >
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>
//       </div>
//       <button type="submit">Add Task</button>
//     </form>
//   );
// }

// // Main App component
// export default function App() {
//   const [tasks, setTasks] = useState(() => {
//     const savedTasks = localStorage.getItem('tasks');
//     return savedTasks ? JSON.parse(savedTasks) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//   }, [tasks]);

//   const addTask = (task) => {
//     setTasks((prevTasks) => [...prevTasks, task]);
//   };

//   return (
//     <div className="App">
//       <h1>Task Tracker</h1>
//       <AddTaskForm onAdd={addTask} />
//       <TaskList tasks={tasks} setTasks={setTasks} />
//     </div>
//   );
// }








import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

// Define a constant for the drag type
const TASK_TYPE = "TASK";

// TaskItem component with drag-and-drop enabled
function TaskItem({ id, index, title, priority, completed, onToggle, onDelete, moveTask }) {
  const ref = React.useRef(null);

  // Drag hook
  const [{ isDragging }, drag] = useDrag({
    type: TASK_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop hook
  const [, drop] = useDrop({
    accept: TASK_TYPE,
    hover: (item) => {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  });

  // Combine drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`task-item ${completed ? 'completed' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <div>
        <h3>{title}</h3>
        <p>Priority: {priority}</p>
      </div>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

// TaskList component with moveTask function
function TaskList({ tasks, setTasks }) {
  const moveTask = (fromIndex, toIndex) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);
      return updatedTasks;
    });
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
    <DndProvider backend={HTML5Backend}>
      <div className="task-list-container">
        {tasks.length > 0 ? (
          <div className="tasks">
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                id={task.id}
                index={index}
                title={task.title}
                priority={task.priority}
                completed={task.completed}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                moveTask={moveTask} // Pass moveTask function to TaskItem
              />
            ))}
          </div>
        ) : (
          <p className="no-results">No tasks match your filters</p>
        )}
      </div>
    </DndProvider>
  );
}

// AddTaskForm component
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

  return (
    <div className="App">
      <h1>Task Tracker</h1>
      <AddTaskForm onAdd={addTask} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
