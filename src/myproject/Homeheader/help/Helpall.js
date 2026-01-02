import React from "react";

function Helpall() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User</h2>

      {/* LOGIN FORM (you can add your fields later) */}
      <div style={styles.formBox}>
        <p style={{ textAlign: "center", color: "#666" }}>
         info
        </p>
      </div>

      {/* SECURITY & FRAUD WARNING SECTION */}
      <div style={styles.securityBox}>
        <h3 style={styles.secTitle}>🔒 Important Safety & Fraud Protection</h3>

        <ul style={styles.list}>
          <li>Never share your OTP, password, login code, or PIN with anyone.</li>
          <li>We NEVER call, WhatsApp, SMS, or video call asking for login details.</li>
          <li>Do NOT trust anyone claiming to be “Support”, “Verification Team”, or “Employee”.</li>
          <li>Do NOT share screenshots of your account, wallet, or dashboard.</li>
          <li>Avoid screen-sharing apps (AnyDesk, TeamViewer, QuickSupport). Scammers use these.</li>
          <li>We NEVER ask for remote access to your phone or computer.</li>
          <li>Do NOT send money to unknown people claiming to fix or activate your account.</li>
          <li>Do NOT upload Aadhaar, PAN, ATM card, bank passbook, or personal documents to strangers.</li>
          <li>We NEVER verify users through WhatsApp video calls or Instagram chats.</li>
          <li>Always check the official website link before entering your password.</li>
          <li>If someone threatens account suspension or says “Your KYC failed”, ignore them.</li>
          <li>Do NOT trust job offers, rewards, bonuses, or money-doubling schemes.</li>
          <li>Only contact support using official contact details displayed on this site.</li>
          <li>If anything feels suspicious — STOP immediately and report it.</li>
        </ul>

        <p style={styles.smallNote}>
          Your safety is your responsibility. Stay alert. Avoid online fraud.
        </p>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: {
    maxWidth: "450px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    marginBottom: "15px",
  },

  formBox: {
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #eee",
    background: "#fafafa",
    marginBottom: "25px",
  },

  securityBox: {
    background: "#fff3cd",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid #ffeeba",
  },

  secTitle: {
    marginBottom: "12px",
    fontSize: "18px",
    color: "#856404",
    fontWeight: "600",
  },

  list: {
    paddingLeft: "20px",
    lineHeight: "1.7",
    fontSize: "14px",
    color: "#6c4f00",
    margin: 0,
  },

  smallNote: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#856404",
    fontStyle: "italic",
  },
};

export default Helpall;
