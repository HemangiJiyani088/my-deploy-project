import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://deploy-demo-api.onrender.com";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch(() =>
        setError("Could not reach the server. It may be waking up, so try again in a minute.")
      )
      .finally(() => setLoading(false));
  }, []);

  async function addTask(e) {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: text, isDone: false }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setTasks([...tasks, created]);
      setTitle("");
      setError("");
    } catch {
      setError("Could not save the task. Please try again.");
    }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setTasks(tasks.filter((t) => t.id !== id));
      setError("");
    } catch {
      setError("Could not delete the task. Please try again.");
    }
  }

  return (
    <main className="card">
      <h1>My Tasks</h1>
      <p className="subtitle">React + ASP.NET + PostgreSQL</p>

      <form onSubmit={addTask} className="form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="hint">Loading tasks...</p>}
      {!loading && tasks.length === 0 && !error && (
        <p className="hint">No tasks yet. Add your first one!</p>
      )}

      <ul className="list">
        {tasks.map((t) => (
          <li key={t.id}>
            <span className="dot" />
            <span className="task-title">{t.title}</span>
            <button
              className="delete"
              onClick={() => deleteTask(t.id)}
              aria-label="Delete task"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}