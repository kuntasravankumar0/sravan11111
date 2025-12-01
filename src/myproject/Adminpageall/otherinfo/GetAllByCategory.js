import React, { useEffect, useState } from "react";
import axios from "axios";

function GetAllByCategory() {
  const [category, setCategory] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Load all data on page load
  useEffect(() => {
    axios
      .get("https://besravan11111.onrender.com/api/links/all")
      .then((response) => {
        const list = response.data?.data || response.data;
        setAllData(list);
        setFilteredData(list);
      })
      .catch((error) => console.error("API error:", error));
  }, []);

  const handleSearch = () => {
    const text = category.toLowerCase();

    if (text.trim() === "") {
      setFilteredData(allData);
      return;
    }

    const result = allData.filter((item) => {
      const cat = (item.categary || "").toLowerCase();
      return cat.startsWith(text);
    });

    setFilteredData(result);
  };

  return (
    <div style={styles.page}>

      {/* Mobile-friendly CSS */}
      <style>{`
        .modern-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          font-size: 15px;
        }

        .modern-table th {
          background: #4a90e2;
          color: white;
          padding: 12px;
          text-align: left;
        }

        .modern-table td {
          background: white;
          padding: 12px;
          border-bottom: 1px solid #e5e5e5;
          word-break: break-word;
        }

        .search-container {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .search-container {
            flex-direction: column;
            width: 100%;
            padding: 0 10px;
          }

          .search-container input,
          .search-container button {
            width: 100% !important;
          }

          .modern-table {
            font-size: 14px;
          }

          .modern-table th,
          .modern-table td {
            padding: 10px;
          }
        }
      `}</style>

      <h2 style={styles.title}>Get All Links by Category</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Type first 2,3,4 letters..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Link Name</th>
              <th>Category</th>
              <th>Use Note</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No Data Found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.linkname}</td>
                  <td>{item.categary}</td>
                  <td>{item.usenote}</td>
                  <td>
                    <a
                      href={item.links}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllByCategory;

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial",
    background: "#f7f7f7",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "22px",
  },

  input: {
    padding: "12px",
    width: "280px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    padding: "12px 20px",
    background: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
