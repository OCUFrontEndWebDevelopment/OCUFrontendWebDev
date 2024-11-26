// Statistics.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function Statistics({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate average completion time only if there are completed tasks
  const avgCompletionTime = completedTasks > 0 ? (
    tasks.reduce((sum, task) => {
      if (task.completed && task.completedAt && task.createdAt) {
        return sum + (new Date(task.completedAt) - new Date(task.createdAt));
      }
      return sum;
    }, 0) / completedTasks / (1000 * 60 * 60)
  ) : 0;

  const pieData = [
    { name: "Completed", value: completedTasks },
    { name: "Incomplete", value: totalTasks - completedTasks },
  ];

  return (
    <div className="statistics-dashboard">
      <h2>Statistics Dashboard</h2>
      <PieChart width={200} height={200}>
        <Pie data={pieData} dataKey="value" outerRadius={80} label>
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? "#82ca9d" : "#8884d8"} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <p>Completion Rate: {completionRate.toFixed(2)}%</p>
      <p>Average Completion Time: {avgCompletionTime.toFixed(2)} hours</p>
    </div>
  );
}
