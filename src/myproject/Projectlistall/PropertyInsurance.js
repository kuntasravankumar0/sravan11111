import React from "react";
import "./allproject.css";

const PropertyInsurance = () => {
  return (
    <div className="employeeboxcontainer">

      {/* HEADER */}
      <div className="employeetopfeatures">
        <h1>Property Insurance</h1>
        <p className="sub-text">
          Complete explanation of the property insurance system
        </p>
      </div>

      {/* INTRO */}
      <div className="employeesystemblock">
        <h2>Introduction</h2>

        <div className="employeeinfoskyblue">
          Property insurance protects against damage or loss of property.
        </div>

        <div className="employeeinfoskyblue">
          Covers residential, commercial, and industrial properties.
        </div>

        <div className="employeeinfoskyblue">
          Policies cover structure + contents.
        </div>

        <div className="employeeinfoskyblue">
          It provides financial safety for property owners.
        </div>
      </div>

      {/* HOME PAGE */}
      <div className="employeesystemblock">
        <h2>1. Home Page</h2>

        <div className="employeeinfoskyblue">
          Shows “Property Insurance” button to start the process.
        </div>

        <div className="employeeinfoskyblue">
          User enters property value, area, and building age.
        </div>
      </div>

      {/* STEPS */}
      <div className="employeesystemblock">
        <h2>Steps to Calculate Premium</h2>

        <div className="employeeinfoskyblue"><strong>Step 1:</strong> Enter all details.</div>
        <div className="employeeinfoskyblue"><strong>Step 2:</strong> Premium shown.</div>
        <div className="employeeinfoskyblue"><strong>Step 3:</strong> Calculated using factors.</div>
        <div className="employeeinfoskyblue"><strong>Step 4:</strong> Security = lower premium.</div>
        <div className="employeeinfoskyblue"><strong>Step 5:</strong> Old buildings reduce premium slightly.</div>
      </div>

      {/* PERSONAL INFO */}
      <div className="employeesystemblock">
        <h2>2. Property & Personal Information</h2>

        <div className="employeeinfoskyblue">Fill property & personal details.</div>
        <div className="employeeinfoskyblue">Left panel shows email & mobile.</div>
        <div className="employeeinfoskyblue">Click “Proceed to Pay”.</div>
      </div>

      {/* PAYMENT */}
      <div className="employeesystemblock">
        <h2>3. Payment Page</h2>

        <div className="employeeinfoskyblue">Razorpay payment integration.</div>
        <div className="employeeinfoskyblue">User selects payment method.</div>
        <div className="employeeinfoskyblue">Amount shown before pay.</div>
        <div className="employeeinfoskyblue">After payment → redirect home.</div>
      </div>

      {/* EXTRA */}
      <div className="employeesystemblock">
        <h2>Payment Instructions</h2>

        <div className="employeeinfoskyblue">
          Follow Razorpay instructions for secure payment.
        </div>
      </div>

      {/* FOOTER */}
      <div className="employeesystemblock center">
        <h2>Source Code</h2>

        <div className="employeeinfoskyblue">
          Visit the{" "}
          <a
            href="https://github.com/kuntasravankumar0/Propertyinsurances"
            target="_blank"
            className="link"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyInsurance;
