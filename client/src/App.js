import { useEffect, useState } from "react";
import axios from "axios";

/**
 * API URL
 * - Uses Netlify env in production
 * - Falls back safely if env is missing
 */
const API =
  process.env.REACT_APP_API_URL ||
  "https://csd-attendance.onrender.com";

export default function App() {
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  // ==========================
  // READ
  // ==========================
  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      const res = await axios.get(API);
      setPeople(res.data);
    } catch (err) {
      console.error("Fetch failed:", err.message);
    }
  };

  // ==========================
  // CREATE
  // ==========================
  const addPerson = async () => {
    try {
      if (!form.name || !form.age) {
        return alert("Enter name & age");
      }

      const res = await axios.post(API, {
        name: form.name,
        age: Number(form.age),
      });

      setPeople([...people, res.data]);
      setForm({ name: "", age: "" });
    } catch (err) {
      console.error("Add failed:", err.message);
    }
  };

  // ==========================
  // START EDIT
  // ==========================
  const startEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, age: p.age });
  };

  // ==========================
  // UPDATE
  // ==========================
  const updatePerson = async () => {
    try {
      const res = await axios.put(`${API}/${editId}`, form);

      setPeople(
        people.map((p) => (p._id === editId ? res.data : p))
      );

      setEditId(null);
      setForm({ name: "", age: "" });
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  // ==========================
  // DELETE
  // ==========================
  const deletePerson = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setPeople(people.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  return (
    <div style={{ width: 400, margin: "40px auto" }}>
      <h2>People CRUD</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        placeholder="Age"
        type="number"
        value={form.age}
        onChange={(e) =>
          setForm({ ...form, age: e.target.value })
        }
      />

      {editId ? (
        <button onClick={updatePerson}>Update</button>
      ) : (
        <button onClick={addPerson}>Add</button>
      )}

      <hr />

      {people.map((p) => (
        <div key={p._id}>
          <b>{p.name}</b> - {p.age}
          <button onClick={() => startEdit(p)}>Edit</button>
          <button onClick={() => deletePerson(p._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
