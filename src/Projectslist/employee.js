import React from "react";
import "./allproject.css"; // optional, can remove if not needed

const EmployeeManagementSystem = () => {
  return (
    <div className="employeeboxcontainer mt-5">

      {/* HEADER */}
      <div className="employeetopfeatures mb-4">
        <h1>Employee Management System (EMS)</h1>
        <p className="lead">
          The Employee Management System (EMS) helps companies manage their entire
          workforce by storing employee information, tracking attendance, managing
          leaves, calculating salaries, and evaluating performance.
        </p>

        <p>
          <a
            href="https://github.com/kuntasravankumar0/Employeedata.git"
            className="btn btn-outline-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit GitHub Repository
          </a>
        </p>
      </div>

      {/* KEY FEATURES */}
      <div className="employeesystemblock mb-4">
        <h2>Key Features</h2>

        <div className="employeeinfoskyblue">
          <strong>Employee Information:</strong> Stores name, ID, contact, job title, etc.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Attendance Tracking:</strong> Tracks working days, leaves, and absences.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Leave Management:</strong> Employees can request leave; managers approve/reject.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Payroll System:</strong> Calculates salary, deductions, bonuses, and overtime.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Performance Tracking:</strong> Helps managers evaluate performance and set goals.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Reports:</strong> Generate attendance, salary, and performance reports.
        </div>
      </div>

      {/* TECHNOLOGIES USED */}
      <div className="employeesystemblock mb-4">
        <h2>Technologies Used</h2>

        <div className="employeeinfoskyblue">
          <strong>Frontend:</strong> HTML, CSS, JavaScript (or React).
        </div>

        <div className="employeeinfoskyblue">
          <strong>Backend:</strong> Java / Spring Boot for handling employee data.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Database:</strong> MySQL for storing all employee records.
        </div>
      </div>

      {/* BENEFITS */}
      <div className="employeesystemblock mb-4">
        <h2>Benefits</h2>

        <div className="employeeinfoskyblue">
          Saves time by automating attendance, payroll, leave, and reporting.
        </div>

        <div className="employeeinfoskyblue">
          Stores employee information in one organized place.
        </div>

        <div className="employeeinfoskyblue">
          Improves decision-making with accurate reports and analytics.
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE */}
      <div className="employeesystemblock mb-4">
        <h2>System Architecture</h2>

        <div className="employeeinfoskyblue">
          <strong>User Interface (UI):</strong> For employees and managers to operate the system.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Backend Server:</strong> Handles logic, requests, and data processing.
        </div>

        <div className="employeeinfoskyblue">
          <strong>Database:</strong> Stores all employee records, attendance, and payroll data.
        </div>
      </div>

    </div>
  );
};

export default EmployeeManagementSystem;
