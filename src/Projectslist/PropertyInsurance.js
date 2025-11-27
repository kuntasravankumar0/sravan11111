import React from "react";
import "./allproject.css"; // optional, can remove if not needed

const PropertyInsurance = () => {
  return (
    <div className="employeeboxcontainer">

      {/* TOP HEADER */}
      <div className="employeetopfeatures">
        <h1>Property Insurance</h1>
        <p style={{ marginTop: "-10px" }}>
          Complete explanation of the property insurance system
        </p>
      </div>

      {/* INTRODUCTION BLOCK */}
      <div className="employeesystemblock">
        <h2>Introduction</h2>

        <div className="employeeinfoskyblue">
          Property insurance refers to coverage that protects against damage or
          loss of property.
        </div>

        <div className="employeeinfoskyblue">
          It provides protection for residential, commercial, or industrial
          properties against disasters or accidents.
        </div>

        <div className="employeeinfoskyblue">
          Policies typically cover both the structure and the contents inside.
        </div>

        <div className="employeeinfoskyblue">
          This insurance gives financial security to property owners.
        </div>
      </div>

      {/* HOME PAGE SECTION */}
      <div className="employeesystemblock">
        <h2>1. Home Page</h2>

        <div className="employeeinfoskyblue">
          The home page shows a “Property Insurance” button to begin the process.
        </div>

        <div className="employeeinfoskyblue">
          Users enter property details like value, area, and building age.
        </div>
      </div>

      {/* STEP INFORMATION BLOCK */}
      <div className="employeesystemblock">
        <h2>Steps to Calculate Premium</h2>

        <div className="employeeinfoskyblue">
          <strong>Step 1:</strong> Enter property value, area, and building age.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Step 2:</strong> After clicking proceed, the premium is shown.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Step 3:</strong> Premium is calculated using multiple factors.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Step 4:</strong> If user selects “NO” for security, premium increases.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Step 5:</strong> Older buildings reduce premium slightly.
        </div>
      </div>

      {/* PERSONAL INFO SECTION */}
      <div className="employeesystemblock">
        <h2>2. Property & Personal Information</h2>

        <div className="employeeinfoskyblue">
          Users must fill in remaining property and personal details.
        </div>

        <div className="employeeinfoskyblue">
          Left side shows previously entered details (email & mobile).
        </div>

        <div className="employeeinfoskyblue">
          After entering details, click “Proceed to Pay”.
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="employeesystemblock">
        <h2>3. Payment Page</h2>

        <div className="employeeinfoskyblue">
          Razorpay is used for payment integration.
        </div>

        <div className="employeeinfoskyblue">
          User selects payment method inside Razorpay window.
        </div>

        <div className="employeeinfoskyblue">
          Premium amount appears inside Razorpay before completing payment.
        </div>

        <div className="employeeinfoskyblue">
          After payment, user is redirected to the Home Page.
        </div>
      </div>

      {/* PAYMENT INSTRUCTIONS */}
      <div className="employeesystemblock">
        <h2>Payment Instructions</h2>

        <div className="employeeinfoskyblue">
          Follow Razorpay portal instructions to complete your payment securely.
        </div>
      </div>

      {/* FOOTER */}
      <div className="employeesystemblock" style={{ textAlign: "center" }}>
        <h2>Source Code</h2>

        <div className="employeeinfoskyblue">
          Visit the{" "}
          <a
            href="https://github.com/kuntasravankumar0/Propertyinsurances"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", fontWeight: "700" }}
          >
            GitHub Repository
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default PropertyInsurance;
