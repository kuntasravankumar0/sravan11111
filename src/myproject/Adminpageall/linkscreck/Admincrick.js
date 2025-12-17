import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admincrick.css";
import API_BASE_URL from "../../config/apiConfig";

const API = `${API_BASE_URL}/api/cricklinks`;

export default function Admincrick() {

  // ---------- FORM (NO customerId) ----------
  const emptyForm = {
    crickLinks: "",
    linkTest: "",
    imageUrl: "",
    cmdCommandSetup: "",
    videoLink: "",
    aboutSoftware: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- INPUT HANDLER ----------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------- CREATE ----------
  const handlePost = async () => {
    try {
      setLoading(true);
      await axios.post(API, form);
      setMessage("✅ Record created");
      setForm(emptyForm);
      fetchAll();
    } catch {
      setMessage("❌ Create failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- READ ----------
  const fetchAll = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data || []);
      setMessage("📦 Loaded all records");
    } catch {
      setMessage("❌ Fetch failed");
    }
  };

const fetchById = async () => {
  if (!id) return;

  try {
    const res = await axios.get(`${API}/${id}`);
    setData([res.data]);

    // 🔥 THIS IS THE FIX — hydrate the form
    setForm({
      crickLinks: res.data.crickLinks || "",
      linkTest: res.data.linkTest || "",
      imageUrl: res.data.imageUrl || "",
      cmdCommandSetup: res.data.cmdCommandSetup || "",
      videoLink: res.data.videoLink || "",
      aboutSoftware: res.data.aboutSoftware || ""
    });

    setMessage("🔍 Record loaded for update");
  } catch {
    setMessage("❌ Record not found");
  }
};


  const fetchByCustomer = async () => {
    if (!customerId) return;
    try {
      const res = await axios.get(`${API}/customer/${customerId}`);
      setData(res.data || []);
      setMessage("🔍 Customer records loaded");
    } catch {
      setMessage("❌ No records found");
    }
  };

  // ---------- UPDATE ----------
  const updateById = async () => {
    if (!id) return;
    try {
      await axios.put(`${API}/${id}`, form);
      setMessage("✏️ Updated successfully");
      fetchAll();
    } catch {
      setMessage("❌ Update failed");
    }
  };

  // ---------- DELETE ----------
  const deleteById = async () => {
    if (!id) return;
    try {
      await axios.delete(`${API}/${id}`);
      setMessage("🗑 Deleted by ID");
      fetchAll();
    } catch {
      setMessage("❌ Delete failed");
    }
  };

  const deleteByCustomer = async () => {
    if (!customerId) return;
    try {
      await axios.delete(`${API}/customer/${customerId}`);
      setMessage("🗑 Deleted customer records");
      fetchAll();
    } catch {
      setMessage("❌ Delete customer failed");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="admin-page">
      <h1>CrickLinks Admin Panel</h1>

      {/* ---------- CREATE / UPDATE ---------- */}
      <div className="card">
        <h2>Create / Update</h2>

        <input
          name="crickLinks"
          value={form.crickLinks}
          onChange={handleChange}
          placeholder="title"
        />

        <input
          name="linkTest"
          value={form.linkTest}
          onChange={handleChange}
          placeholder="linktodownload"
        />

        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <input
          name="cmdCommandSetup"
          value={form.cmdCommandSetup}
          onChange={handleChange}
          placeholder="CMD Command"
        />

        <input
          name="videoLink"
          value={form.videoLink}
          onChange={handleChange}
          placeholder="Video Link"
        />

        <textarea
          name="aboutSoftware"
          value={form.aboutSoftware}
          onChange={handleChange}
          placeholder="About Software"
        />

        <div className="actions">
          <button onClick={handlePost} disabled={loading}>
            POST
          </button>
          <button onClick={updateById}>PUT (Update)</button>
        </div>
      </div>

      {/* ---------- FETCH / DELETE ---------- */}
      <div className="card">
        <h2>Fetch / Delete</h2>

        <input
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />

        <div className="actions">
          <button onClick={fetchAll}>GET ALL</button>
          <button onClick={fetchById}>GET BY ID</button>
          <button onClick={fetchByCustomer}>GET BY CUSTOMER</button>
          <button className="danger" onClick={deleteById}>
            DELETE BY ID
          </button>
          <button className="danger" onClick={deleteByCustomer}>
            DELETE BY CUSTOMER
          </button>
        </div>
      </div>

      {/* ---------- MESSAGE ---------- */}
      {message && <div className="message">{message}</div>}

      {/* ---------- OUTPUT ---------- */}
      <div className="card output">
        <h2>Output</h2>

        {data.length === 0 && (
          <div className="empty-state">No records to display</div>
        )}

        <div className="records-grid">
          {data.map((item) => (
            <div className="record-card" key={item.id}>
              <div className="record-header">
                <span>ID: {item.id}</span>
                <span className="customer">{item.customerId}</span>
              </div>

              <div className="record-body">
                <Field label="Crick Links" value={item.crickLinks} />
                <Field label="Link Test" value={item.linkTest} />
                <Field label="CMD Command" value={item.cmdCommandSetup} />
                 <Field label="About" value={item.aboutSoftware} />

                <Field
                  label="Video Link"
                  value={
                    item.videoLink ? (
                      <a href={item.videoLink} target="_blank" rel="noreferrer">
                        Open Video
                      </a>
                    ) : "-"
                  }
                />

                <Field
                  label="Image"
                  value={
                    item.imageUrl ? (
                      <img src={item.imageUrl} alt="preview" />
                    ) : "-"
                  }
                />
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL UI HELPER ---------- */
function Field({ label, value }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{value}</div>
    </div>
  );
}
