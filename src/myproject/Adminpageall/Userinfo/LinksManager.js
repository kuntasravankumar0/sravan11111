import React, { useEffect, useState } from "react";
import axios from "axios";

function LinksManager() {
  const [links, setLinks] = useState([]);
  const [searchText, setSearchText] = useState("");

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
      .get("https://besravan11111.onrender.com/api/links/all")
      .then((res) => setLinks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => loadAll(), []);

  // Auto-fetch update info when typing link number
  useEffect(() => {
    if (editNumber.trim() === "") {
      setForm({ linkname: "", categary: "", usenote: "", links: "" });
      return;
    }

    axios
      .get(`https://besravan11111.onrender.com/api/links/getby/${editNumber}`)
      .then((res) => {
        const item = res.data;
        setForm({
          linkname: item.linkname,
          categary: item.categary,
          usenote: item.usenote,
          links: item.links
        });
      })
      .catch(() =>
        setForm({ linkname: "", categary: "", usenote: "", links: "" })
      );
  }, [editNumber]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addLink = () => {
    axios
      .post("https://besravan11111.onrender.com/api/links/create", form)
      .then(() => {
        alert("Link Added!");
        loadAll();
        setForm({ linkname: "", categary: "", usenote: "", links: "" });
        setEditNumber("");
      });
  };

  const updateLink = () => {
    if (!editNumber) return alert("Enter Link Number to Update");

    axios
      .put(
        `https://besravan11111.onrender.com/api/links/update/${editNumber}`,
        form
      )
      .then(() => {
        alert("Updated Successfully!");
        loadAll();
        setEditNumber("");
        setForm({ linkname: "", categary: "", usenote: "", links: "" });
      });
  };

  const deleteLinkByNumber = () =>
    deleteNumber &&
    axios
      .delete(
        `https://besravan11111.onrender.com/api/links/delete/${deleteNumber}`
      )
      .then(() => {
        alert("Deleted Successfully!");
        loadAll();
        setDeleteNumber("");
      });

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Links Manager</h1>

      {/* MOBILE UI IMPROVED CSS */}
      <style>{`
        .card {
          background: #ffffff;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 20px;
          box-shadow: 0px 3px 10px rgba(0,0,0,0.08);
        }

        .input {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 12px;
          background: #fafafa;
        }

        .button {
          width: 100%;
          padding: 14px;
          font-size: 17px;
          border: none;
          border-radius: 8px;
          margin-top: 8px;
          color: white;
        }

        .green { background: #28a745; }
        .blue { background: #007bff; }
        .red { background: #dc3545; }

        .formRow {
          display: flex;
          gap: 12px;
        }

        /* Table */
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
          font-size: 15px;
          border-bottom: 1px solid #eee;
          word-break: break-word;
        }

        th {
          background: #4a90e2;
          color: white;
        }

        tr:hover {
          background: #eef6ff;
        }

        /* MOBILE VERSION */
        @media (max-width: 650px) {
          .formRow {
            flex-direction: column;
          }

          th, td {
            padding: 10px;
            font-size: 14px;
          }

          h1 {
            font-size: 22px !important;
          }

          table {
            font-size: 13px;
          }
        }
      `}</style>

      {/* ADD/UPDATE */}
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

        <button className="button green" onClick={addLink}>
          Add Link
        </button>
        <button className="button blue" onClick={updateLink}>
          Update Link
        </button>
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

        <button className="button red" onClick={deleteLinkByNumber}>
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
              .filter((item) => {
                const category = (item.categary || "").toLowerCase();
                const text = searchText.toLowerCase();
                if (!text) return true;
                return category.startsWith(text);
              })
              .map((item, index) => (
                <tr key={item.linknumber}>
                  <td>{index + 1}</td>
                  <td>{item.linkname}</td>
                  <td>{item.categary}</td>
                  <td>{item.usenote}</td>
                  <td>
                    <a href={item.links} >
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
