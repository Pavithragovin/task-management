import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

// Chart.js imports
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  // 🔐 Protect route
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 🟢 State
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Todo");

  // 🟢 Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  // 🟢 Load tasks on page open
  useEffect(() => {
    fetchTasks();
  }, []);

  // 🟢 Add task
  const addTask = async () => {
    if (!title) {
      alert("Enter task title");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/tasks",
      { title, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    setStatus("Todo");
    fetchTasks();
  };

  // 🟢 Update task status
  const updateStatus = async (id, newStatus) => {
    await axios.patch(
      `http://localhost:5000/api/tasks/${id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  // 🟢 Delete task
  const deleteTask = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/tasks/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  // 🟢 Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // 🟢 Chart Data Logic
  const todo = tasks.filter(t => t.status === "Todo").length;
  const progress = tasks.filter(t => t.status === "In Progress").length;
  const completed = tasks.filter(t => t.status === "Completed").length;

  const chartData = {
    labels: ["Todo", "In Progress", "Completed"],
    datasets: [
      {
        data: [todo, progress, completed],
        backgroundColor: ["#ffcc00", "#36a2eb", "#4caf50"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      {/* 🟢 Chart Section */}
      <h3>Task Status Chart</h3>
      <div style={{ width: "300px", marginBottom: "30px" }}>
        <Pie data={chartData} />
      </div>

      <hr />

      {/* 🟢 Add Task */}
      <h3>Add Task</h3>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button onClick={addTask} style={{ marginLeft: "10px" }}>
        Add
      </button>

      <hr />

      {/* 🟢 Task List */}
      <h3>My Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{task.title}</h4>

            <select
              value={task.status}
              onChange={(e) => updateStatus(task.id, e.target.value)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
