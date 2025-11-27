import React, { useEffect, useState } from "react";
import axios from "axios";

function GetAllByCategory() {
  const [category, setCategory] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Load all data on page load
  useEffect(() => {
    axios.get("http://localhost:8080/api/links/all")
      .then(response => {
        setAllData(response.data);
        setFilteredData(response.data); // show all initially
      })
      .catch(error => console.error("API error:", error));
  }, []);

  // Filter when category changes
  const handleSearch = () => {
    if (category.trim() === "") {
      setFilteredData(allData); // reset to all
    } else {
      const result = allData.filter(item =>
        item.categary?.toLowerCase() === category.toLowerCase()
      );
      setFilteredData(result);
    }
  };

  return (
    <div style={styles.page}>

      {/* Responsive CSS */}
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
          transition: 0.2s ease;
        }

        .modern-table tr:hover {
          transform: scale(1.01);
          background: #f7faff;
        }

        /* Responsive Search Bar */
        @media (max-width: 600px) {
          .search-container {
            flex-direction: column;
            width: 100%;
          }

          .search-container input {
            width: 100% !important;
          }

          .search-container button {
            width: 100%;
          }

          .modern-table {
            font-size: 13px;
          }
        }
      `}</style>

      <h2 style={styles.title}>Get All Links by Category</h2>

      {/* Search Bar */}
      <div className="search-container" style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {/* Table */}
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
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
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
                    <a href={item.links} rel="noreferrer">
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



// ---------- CSS STYLES ----------

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial",
    background: "#f7f7f7",
    minHeight: "100vh"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "10px"
  },

  input: {
    padding: "10px",
    width: "280px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none"
  },

  button: {
    padding: "10px 25px",
    background: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "0.2s"
  }
};
