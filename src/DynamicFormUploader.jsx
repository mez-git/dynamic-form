import React, { useState } from "react";

export default function DynamicFormUploader() {
  const [fields, setFields] = useState([]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        if (Array.isArray(jsonData)) {
          setFields(jsonData);
        } else {
          alert(" JSON must be an array of objects.");
        }
      } catch (err) {
        alert(" Invalid JSON file!");
      }
    };

    reader.readAsText(file);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(" Form Data:", data);
    alert("Form submitted! Check console.");
  };

  // Render each field based on type
  const renderField = (field, index) => {
    const name = field.name || field.label.toLowerCase().replace(/\s+/g, "_");

    switch (field.type) {
      case "select":
        return (
          <select
            name={name}
            required={field.required || false}
            style={inputStyle}
          >
            <option value="" disabled selected>
              {field.placeholder || "Select an option"}
            </option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "radio":
        return field.options?.map((opt, i) => (
          <label key={i} style={{ marginRight: "10px" }}>
            <input type="radio" name={name} value={opt} required={field.required || false} />
            {opt}
          </label>
        ));

      case "checkbox":
        return field.options?.map((opt, i) => (
          <label key={i} style={{ display: "block" }}>
            <input type="checkbox" name={name} value={opt} />
            {opt}
          </label>
        ));

      default:
        return (
          <input
            type={field.type || "text"}
            name={name}
            placeholder={field.placeholder || ""}
            required={field.required || false}
            style={inputStyle}
          />
        );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "5px",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1>Upload JSON & Generate Form</h1>

      {/* Upload Input */}
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: "block", margin: "10px 0" }}
      />

      {/* Dynamic Form */}
      {fields.length > 0 && (
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                {field.label}
              </label>
              {renderField(field, index)}
            </div>
          ))}

          <button
            type="submit"
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
