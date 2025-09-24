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
          alert("❌ JSON must be an array of objects.");
        }
      } catch (err) {
        alert("❌ Invalid JSON file!");
      }
    };

    reader.readAsText(file);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("✅ Form Data:", data);
    alert("Form submitted! Check console.");
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
            <div key={index} style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.label.toLowerCase().replace(/\s+/g, "_")}
                placeholder={field.placeholder || ""}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
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
