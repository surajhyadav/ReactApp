import { useState, useEffect } from "react";

export default function App() {
  const [todo, setTodo] = useState("");
  const [list, setList] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(list));
  }, [list]);

  // Hourly Reminder
  useEffect(() => {
    const interval = setInterval(() => {
      const pending = list.filter((i) => !i.completed);

      if (pending.length > 0) {
        alert(
          "⏰ Reminder!\nItems pending:\n" +
            pending.map((i) => "- " + i.text).join("\n")
        );
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [list]);

  const addTodo = () => {
    if (!todo.trim()) return;

    setList([
      ...list,
      { id: Date.now(), text: todo, completed: false }
    ]);

    setTodo("");
  };

  const toggleTodo = (id) => {
    setList(
      list.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTodo = (id) => {
    setList(list.filter((item) => item.id !== id));
  };

  const filteredList = list.filter((item) => {
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-8 text-white flex justify-center">
      <div className="w-full max-w-lg bg-white text-gray-800 rounded-2xl shadow-2xl p-6">
        
        <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">
          🛒 Smart React Todo App By Devops..
        </h1>

        {/* Input box */}
        <div className="flex gap-2">
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="flex-1 p-3 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Add item to purchase..."
          />
          <button
            onClick={addTodo}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:opacity-90 transition"
          >
            Add
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-around mt-6">
          {["all", "pending", "completed"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                filter === t
                  ? "bg-purple-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <ul className="mt-6 space-y-3">
          {filteredList.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-xl shadow-sm"
            >
              <span
                onClick={() => toggleTodo(item.id)}
                className={`cursor-pointer text-lg flex-1 ${
                  item.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {item.text}
              </span>

              <button
                onClick={() => deleteTodo(item.id)}
                className="ml-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm shadow hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {filteredList.length === 0 && (
          <p className="text-center mt-6 text-gray-500">No items here...</p>
        )}
      </div>
    </div>
  );
}
