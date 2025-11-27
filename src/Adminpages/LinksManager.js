import React, { useEffect, useState } from "react";
import axios from "axios";

function LinksManager() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({
    linkname: "",
    categary: "",
    usenote: "",
    links: ""
  });

  const [editNumber, setEditNumber] = useState("");
  const [deleteNumber, setDeleteNumber] = useState("");

  const loadAll = () => {
    axios
      .get("http://localhost:8080/api/links/all")
      .then((res) => setLinks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addLink = () => {
    axios
      .post("http://localhost:8080/api/links/create", form)
      .then(() => {
        alert("Link Added!");
        loadAll();
        setForm({ linkname: "", categary: "", usenote: "", links: "" });
      })
      .catch((err) => console.error(err));
  };

  const updateLink = () => {
    if (!editNumber) return alert("Enter Link Number to Update");

    axios
      .put(`http://localhost:8080/api/links/update/${editNumber}`, form)
      .then(() => {
        alert("Updated Successfully!");
        loadAll();
        setEditNumber("");
      })
      .catch(() => alert("Link number not found"));
  };

  const deleteLinkByNumber = () => {
    if (!deleteNumber) return alert("Enter Link Number to Delete");

    axios
      .delete(`http://localhost:8080/api/links/delete/${deleteNumber}`)
      .then(() => {
        alert("Deleted Successfully!");
        loadAll();
        setDeleteNumber("");
      })
      .catch(() => alert("Link number not found"));
  };

  return (
    <div className="page" style={styles.page}>

      {/* --- RESPONSIVE CSS --- */}
      <style>{`
        .modern-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 10px;
          font-size: 15px;
        }

        .modern-table th {
          background: #4a90e2;
          color: white;
          padding: 12px;
          text-align: left;
          border-radius: 6px 6px 0 0;
        }

        .modern-table td {
          background: white;
          padding: 12px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          word-break: break-word;
        }

        .modern-table tr {
          box-shadow: 0 3px 8px rgba(0,0,0,0.05);
          transition: 0.2s;
        }

        .modern-table tr:hover {
          transform: scale(1.01);
          background: #f7faff;
        }

        /* ----------- Responsive Layout ----------- */
        @media (max-width: 768px) {
          .formRow {
            flex-direction: column !important;
          }

          .buttonRow {
            flex-direction: column !important;
            width: 100%;
          }

          .buttonRow button {
            width: 100%;
          }

          .input, .inputFull {
            width: 100% !important;
          }

          .card {
            padding: 15px !important;
            width: 95% !important;
          }

          .modern-table {
            font-size: 13px;
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .modern-table th,
          .modern-table td {
            padding: 8px;
            font-size: 12px;
          }

          h1, h2 {
            font-size: 18px !important;
          }

          .page {
            padding: 10px !important;
          }
        }
      `}</style>

      <h1 style={styles.title}>Links Manager (CRUD)</h1>

      {/* ADD / UPDATE SECTION */}
      <div className="card" style={styles.card}>
        <h2 style={styles.sectionTitle}>Add / Update Link</h2>

        <div className="formRow" style={styles.formRow}>
          <input
            type="text"
            name="linkname"
            placeholder="Link Name"
            value={form.linkname}
            onChange={handleChange}
            className="input"
            style={styles.input}
          />

          <input
            type="text"
            name="categary"
            placeholder="Category"
            value={form.categary}
            onChange={handleChange}
            className="input"
            style={styles.input}
          />
        </div>

        <div className="formRow" style={styles.formRow}>
          <input
            type="text"
            name="usenote"
            placeholder="Use Note"
            value={form.usenote}
            onChange={handleChange}
            className="input"
            style={styles.input}
          />

          <input
            type="text"
            name="links"
            placeholder="Link URL"
            value={form.links}
            onChange={handleChange}
            className="input"
            style={styles.input}
          />
        </div>

        <input
          type="text"
          placeholder="Link Number (for update)"
          value={editNumber}
          onChange={(e) => setEditNumber(e.target.value)}
          className="inputFull"
          style={styles.inputFull}
        />

        <div className="buttonRow" style={styles.buttonRow}>
          <button style={styles.addBtn} onClick={addLink}>Add Link</button>
          <button style={styles.updateBtn} onClick={updateLink}>Update Link</button>
        </div>
      </div>

      {/* DELETE SECTION */}
      <div className="card" style={styles.card}>
        <h2 style={styles.sectionTitle}>Delete Link</h2>

        <div className="formRow" style={styles.formRow}>
          <input
            type="text"
            placeholder="Enter Link Number"
            value={deleteNumber}
            onChange={(e) => setDeleteNumber(e.target.value)}
            className="input"
            style={styles.input}
          />

          <button style={styles.deleteBtn} onClick={deleteLinkByNumber}>
            Delete
          </button>
        </div>
      </div>

      {/* ALL LINKS TABLE */}
      <div className="card" style={styles.card}>
        <h2 style={styles.sectionTitle}>All Links</h2>

        <div style={{ overflowX: "auto" }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Link Name</th>
                <th>Category</th>
                <th>Use Note</th>
                <th>Link</th>
                <th>Link Number</th>
              </tr>
            </thead>

            <tbody>
              {links.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.linkname}</td>
                  <td>{item.categary}</td>
                  <td>{item.usenote}</td>
                  <td>
                    <a href={item.links} rel="noreferrer">Open</a>
                  </td>
                  <td>{item.linknumber}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default LinksManager;

/* ----------- Inline Base Styles ----------- */
const styles = {
  page: {
    padding: "30px",
    fontFamily: "Arial",
    background: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    padding: "20px",
    margin: "20px auto",
    maxWidth: "900px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    marginBottom: "15px",
    color: "#444",
  },
  formRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  inputFull: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginBottom: "15px",
  },
  buttonRow: {
    display: "flex",
    gap: "15px",
  },
  addBtn: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  updateBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    height: "42px",
  },
};
