import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function App() {
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  };

  const addPerson = async () => {
    if (!form.name || !form.age) return alert("Enter name & age");
    const res = await axios.post(API, {
      name: form.name,
      age: Number(form.age),
    });
    setPeople([...people, res.data]);
    setForm({ name: "", age: "" });
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, age: p.age });
  };

  const updatePerson = async () => {
    const res = await axios.put(`${API}/${editId}`, form);
    setPeople(people.map(p => p._id === editId ? res.data : p));
    setEditId(null);
    setForm({ name: "", age: "" });
  };

  const deletePerson = async (id) => {
    await axios.delete(`${API}/${id}`);
    setPeople(people.filter(p => p._id !== id));
  };

  return (
    <div style={{ width: 400, margin: "40px auto" }}>
      <h2>People CRUD</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Age"
        type="number"
        value={form.age}
        onChange={e => setForm({ ...form, age: e.target.value })}
      />

      {editId ? (
        <button onClick={updatePerson}>Update</button>
      ) : (
        <button onClick={addPerson}>Add</button>
      )}

      <hr />

      {people.map(p => (
        <div key={p._id}>
          <b>{p.name}</b> - {p.age}
          <button onClick={() => startEdit(p)}>Edit</button>
          <button onClick={() => deletePerson(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
