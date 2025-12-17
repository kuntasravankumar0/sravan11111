import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";
import "./AllCustomerId.css";

const API = `${API_BASE_URL}/api/cricklinks`;

function AllCustomerId() {
  const { customerId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeToArray = useCallback((input) => {
    if (Array.isArray(input)) return input;
    if (input && typeof input === "object") return [input];
    return [];
  }, []);

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/customer/${customerId}`);
      setData(normalizeToArray(res.data));
    } catch {
      setError("Failed to load customer data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [customerId, normalizeToArray]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  if (loading) return <p className="state">Loading…</p>;
  if (error) return <p className="state error">{error}</p>;

  return (
    <div className="customer-page">
      <Link to="/crick-links" className="back-link">← Back</Link>

      {data.length === 0 && (
        <p className="state">No records found</p>
      )}

      {data.map((d) => (
        <div className="record-card" key={d.id}>
          <h2 className="software-title">{d.crickLinks}</h2>

          {d.imageUrl && (
            <div className="image-center">
              <img
                src={d.imageUrl}
                alt="preview"
                className="preview-image"
              />
            </div>
          )}

          {d.aboutSoftware && (
            <section>
              <h4>About Software</h4>
              <p>{d.aboutSoftware}</p>
            </section>
          )}

          {d.cmdCommandSetup && (
            <section>
              <h4>CMD Command</h4>
              <pre className="cmd-box">{d.cmdCommandSetup}</pre>
            </section>
          )}

          {d.linkTest && (
            <section className="action-section">
              <a
                href={d.linkTest}
                target="_blank"
                rel="noreferrer"
                className="download-btn"
              >
                Download
              </a>
            </section>
          )}

          {d.videoLink && (
            <section>
              <h4>Video</h4>

              <div className="video-wrapper">
                <iframe
                  src={d.videoLink}
                  title="Video Player"
                  allowFullScreen
                />
              </div>

              <a
                href={d.videoLink}
                target="_blank"
                rel="noreferrer"
                className="video-direct-link"
              >
                ▶ Watch in new tab
              </a>
            </section>
          )}
        </div>
      ))}
    </div>
  );
}

export default AllCustomerId;
