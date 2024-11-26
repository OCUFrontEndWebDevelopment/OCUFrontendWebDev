import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function Statistics({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = (completedTasks / totalTasks) * 100;

  const avgCompletionTime = useMemo(() => {
    const completedTasksWithTime = tasks.filter(task => task.completed && task.completedAt);
    const totalTime = completedTasksWithTime.reduce((sum, task) => {
      return sum + (new Date(task.completedAt) - new Date(task.createdAt));
    }, 0);
    return completedTasksWithTime.length ? totalTime / completedTasksWithTime.length / (1000 * 60 * 60) : 0;
  }, [tasks]);

  // Chart data for visualization
  const pieData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Incomplete', value: totalTasks - completedTasks },
  ];

  return (
    <div className="statistics-dashboard">
      <h2>Statistics Dashboard</h2>

      {/* Pie Chart for Completion Rate */}
      <PieChart width={200} height={200}>
        <Pie data={pieData} dataKey="value" outerRadius={80} label>
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#8884d8'} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* Display metrics */}
      <p>Completion Rate: {completionRate.toFixed(2)}%</p>
      <p>Average Completion Time: {avgCompletionTime.toFixed(2)} hours</p>
    </div>
  );
}
