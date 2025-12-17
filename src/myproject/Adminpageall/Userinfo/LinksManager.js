import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";

// single endpoint
const LINKS_API = `${API_BASE_URL}/api/links`;

function LinksManager() {
  const [links, setLinks] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [form, setForm] = useState({
    linkname: "",
    categary: "",
    usenote: "",
    links: "",
  });

  const [editNumber, setEditNumber] = useState("");
  const [deleteNumber, setDeleteNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------- LOAD ALL ----------
  const loadAll = async () => {
    try {
      const res = await axios.get(`${LINKS_API}/all`);
      setLinks(res.data || []);
    } catch (err) {
      console.error("LOAD ERROR:", err?.message);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ---------- AUTO FETCH FOR UPDATE ----------
  useEffect(() => {
    if (!editNumber.trim()) {
      setForm({ linkname: "", categary: "", usenote: "", links: "" });
      return;
    }

    axios
      .get(`${LINKS_API}/getby/${editNumber}`)
      .then((res) => {
        const item = res.data;
        if (!item) return;

        setForm({
          linkname: item.linkname || "",
          categary: item.categary || "",
          usenote: item.usenote || "",
          links: item.links || "",
        });
      })
      .catch(() =>
        setForm({ linkname: "", categary: "", usenote: "", links: "" })
      );
  }, [editNumber]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ---------- ADD ----------
  const addLink = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${LINKS_API}/create`, form);
      setMessage("✅ Link Added");
      loadAll();
      setForm({ linkname: "", categary: "", usenote: "", links: "" });
      setEditNumber("");
    } catch {
      setMessage("❌ Failed to add link");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UPDATE ----------
  const updateLink = async () => {
    if (!editNumber) {
      setMessage("⚠ Enter link number to update");
      return;
    }

    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.put(`${LINKS_API}/update/${editNumber}`, form);
      setMessage("✅ Updated Successfully");
      loadAll();
      setEditNumber("");
      setForm({ linkname: "", categary: "", usenote: "", links: "" });
    } catch {
      setMessage("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- DELETE ----------
  const deleteLinkByNumber = async () => {
    if (!deleteNumber || loading) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.delete(`${LINKS_API}/delete/${deleteNumber}`);
      setMessage("✅ Deleted Successfully");
      loadAll();
      setDeleteNumber("");
    } catch {
      setMessage("❌ Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* ===== CSS (DO NOT REMOVE) ===== */}
      <style>{`
        .card {
          background: #fff;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 20px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }

        .input {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 12px;
        }

        .button {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          margin-top: 8px;
          color: white;
          cursor: pointer;
        }

        .green { background: #28a745; }
        .blue { background: #007bff; }
        .red { background: #dc3545; }

        .formRow {
          display: flex;
          gap: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #4a90e2;
          color: white;
        }

        tr:hover {
          background: #eef6ff;
        }

        @media (max-width: 650px) {
          .formRow {
            flex-direction: column;
          }
        }
      `}</style>

      <h1 style={styles.title}>Links Manager</h1>

      {/* ADD / UPDATE */}
      <div className="card">
        <h3>Add / Update Link</h3>

        <input
          className="input"
          placeholder="Enter Link Number to Update"
          value={editNumber}
          onChange={(e) => setEditNumber(e.target.value)}
        />

        <div className="formRow">
          <input
            className="input"
            placeholder="Link Name"
            name="linkname"
            value={form.linkname}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Category"
            name="categary"
            value={form.categary}
            onChange={handleChange}
          />
        </div>

        <div className="formRow">
          <input
            className="input"
            placeholder="Use Note"
            name="usenote"
            value={form.usenote}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Link URL"
            name="links"
            value={form.links}
            onChange={handleChange}
          />
        </div>

        <button className="button green" onClick={addLink} disabled={loading}>
          Add Link
        </button>
        <button className="button blue" onClick={updateLink} disabled={loading}>
          Update Link
        </button>

        {message && <p>{message}</p>}
      </div>

      {/* DELETE */}
      <div className="card">
        <h3>Delete Link</h3>

        <input
          className="input"
          placeholder="Enter Link Number"
          value={deleteNumber}
          onChange={(e) => setDeleteNumber(e.target.value)}
        />

        <button className="button red" onClick={deleteLinkByNumber} disabled={loading}>
          Delete
        </button>
      </div>

      {/* SEARCH */}
      <div className="card">
        <h3>Search</h3>

        <input
          className="input"
          placeholder="Type first letters..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>All Links</h3>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Category</th>
              <th>Use Note</th>
              <th>Link</th>
              <th>Number</th>
            </tr>
          </thead>

          <tbody>
            {links
              .filter((i) =>
                !searchText ||
                (i.categary || "").toLowerCase().startsWith(searchText.toLowerCase())
              )
              .map((item, index) => (
                <tr key={item.linknumber}>
                  <td>{index + 1}</td>
                  <td>{item.linkname}</td>
                  <td>{item.categary}</td>
                  <td>{item.usenote}</td>
                  <td>
                    <a href={item.links} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </td>
                  <td>{item.linknumber}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LinksManager;

const styles = {
  page: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
};
