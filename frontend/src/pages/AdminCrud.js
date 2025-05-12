import React, { useEffect, useState } from "react";
import "../styles/MainContent/AdminCrud.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_BASE = "http://localhost:8000/api/database";

const AdminCrud = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [schema, setSchema] = useState([]);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [primaryKey, setPrimaryKey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const roles = jwtDecode(token)?.roles || [];
      if (!roles.includes("admin")) {
        navigate("/");
      }
    } catch {
      navigate("/signin");
    }
  });

  useEffect(() => {
    fetch(`${API_BASE}/tables`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        if (Array.isArray(data)) setTables(data);
        else throw new Error("Tables response is not an array");
      })
      .catch((err) => {
        console.error("Failed to load tables:", err);
        setTables([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedTable) return;

    fetch(`${API_BASE}/tables/${selectedTable}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(setData)
      .catch((err) => {
        console.error("Failed to load table data:", err);
        setData([]);
      });

    fetch(`${API_BASE}/tables/${selectedTable}/schema`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((schema) => {
        if (Array.isArray(schema)) {
          setSchema(schema);
          const pk = schema.find((col) => col.is_primary)?.name || schema[0]?.name;
          setPrimaryKey(pk);
        } else {
          throw new Error("Schema is not an array");
        }
      })
      .catch((err) => {
        console.error("Failed to load schema:", err);
        setSchema([]);
      });
  }, [selectedTable]);

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedFormData = { ...formData };
    if (editingId && primaryKey) delete cleanedFormData[primaryKey];

    const url = `${API_BASE}/tables/${selectedTable}` + (editingId ? `/${editingId}` : "");
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cleanedFormData),
    });

    setFormData({});
    setEditingId(null);

    fetch(`${API_BASE}/tables/${selectedTable}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(setData)
      .catch((err) => {
        console.error("Failed to reload data after submit:", err);
        setData([]);
      });
  };

  const handleEdit = (row) => {
    setFormData(row);
    setEditingId(row[primaryKey]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;

    await fetch(`${API_BASE}/tables/${selectedTable}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetch(`${API_BASE}/tables/${selectedTable}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(setData)
      .catch((err) => {
        console.error("Failed to reload after delete:", err);
        setData([]);
      });
  };

  return (
    <div className="admin-crud">
      <aside className="sidebar">
        <button className="home-button" onClick={() => navigate("/")}>
          <FaArrowLeft style={{ marginRight: "6px" }} />
          Back to Home
        </button>
        <h2>📦 Tables</h2>
        <ul>
          {tables.map((table) => (
            <li
              key={table}
              className={selectedTable === table ? "active" : ""}
              onClick={() => setSelectedTable(table)}
            >
              {table}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main">
        <h1>🛠 Admin Database</h1>
        {selectedTable && (
          <>
            <h2>Table: {selectedTable}</h2>

            <form onSubmit={handleSubmit} className="crud-form">
              {schema.map((col) => {
                const isAutoGenerated = ["id"].includes(col.name);
                const isDisabled = editingId && isAutoGenerated;

                return (
                  <input
                    key={col.name}
                    name={col.name}
                    value={formData[col.name] || ""}
                    onChange={(e) => handleChange(e, col.name)}
                    placeholder={col.name}
                    disabled={isDisabled}
                  />
                );
              })}
              <button type="submit">{editingId ? "Update" : "Create"}</button>
            </form>

            <table className="data-table">
              <thead>
                <tr>
                  {schema.map((col) => (
                    <th key={col.name}>{col.name}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) &&
                  data.map((row, i) => (
                    <tr key={i}>
                      {schema.map((col) => (
                        <td key={col.name}>{row[col.name]}</td>
                      ))}
                      <td>
                        <button onClick={() => handleEdit(row)}>✏️</button>
                        <button onClick={() => handleDelete(row[primaryKey])}>🗑️</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminCrud;