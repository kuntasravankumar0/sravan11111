import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CustomerCrickLinks.css";
import API_BASE_URL from "../../config/apiConfig";

const API = `${API_BASE_URL}/api/cricklinks`;

export default function CustomerCrickLinks() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(API);

      const unique = [
        ...new Map(
          (res.data || [])
            .filter(item => item.customerId)
            .sort((a, b) => b.customerId.localeCompare(a.customerId))
            .map(item => [
              item.customerId,
              {
                customerId: item.customerId,
                imageUrl: item.imageUrl,
                crickLinks: item.crickLinks,
                id: item.id,
              },
            ])
        ).values(),
      ];

      setCustomers(unique);
      setFilteredCustomers(unique);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterCustomers = useCallback(() => {
    if (!search.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const query = search.toLowerCase();

    const result = customers.filter(c =>
      typeof c.crickLinks === "string" &&
      c.crickLinks.toLowerCase().startsWith(query)
    );

    setFilteredCustomers(result);
  }, [search, customers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    filterCustomers();
  }, [filterCustomers]);

  return (
    <div className="customer-page">
      <h1>Drive links</h1>

      <input
        type="text"
        placeholder="Search by names"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="customer-search"
      />

      {loading && <div className="state">Loading customers…</div>}

      {!loading && error && <div className="state error">{error}</div>}

      {!loading && filteredCustomers.length === 0 && (
        <div className="state">No matching results</div>
      )}

      <div className="customer-grid">
        {filteredCustomers.map(c => (
          <Link
            key={c.customerId}
            to={`/crick-links/${c.customerId}`}
            className="customer-card"
          >
            {c.imageUrl && (
              <div className="customer-logo-wrapper">
                <img
                  src={c.imageUrl}
                  alt="Logo"
                  className="customer-logo"
                />
              </div>
            )}

            <div className="customer-link">ID: {c.id}</div>
            <div className="customer-link">{c.crickLinks}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
