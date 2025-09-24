import React, { useState } from "react";

export default function DynamicFormUploader() {
  const [fields, setFields] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newField, setNewField] = useState({
    label: "",
    placeholder: "",
    type: "text",
  });

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
          alert("JSON must be an array of objects.");
        }
      } catch (err) {
        alert("Invalid JSON file!");
      }
    };

    reader.readAsText(file);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data);
    alert("Form submitted! Check console.");
  };


  const renderField = (field, index) => {
    const name = field.name || field.label.toLowerCase().replace(/\s+/g, "_");

    switch (field.type) {
      case "select":
        return (
          <select name={name} required={field.required || false} style={inputStyle}>
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

 
  const handleAddField = () => {
    if (!newField.label || !newField.type) {
      alert("Label and type are required!");
      return;
    }
    setFields([...fields, newField]);
    setNewField({ label: "", placeholder: "", type: "text" });
    setShowPopup(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1>Upload JSON & Generate Form</h1>


      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: "block", margin: "10px 0" }}
      />


      {fields.length > 0 && (
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>{field.label}</label>
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
              marginRight: "10px",
            }}
          >
            Submit
          </button>

          <button
            type="button"
            onClick={() => setShowPopup(true)}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add More
          </button>
        </form>
      )}

     
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "300px" }}>
            <h3>Add New Field</h3>
            <input
              type="text"
              placeholder="Label"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Placeholder"
              value={newField.placeholder}
              onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
              style={inputStyle}
            />
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
              style={inputStyle}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="select">Select</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>

            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button
                onClick={() => setShowPopup(false)}
                style={{ marginRight: "10px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button onClick={handleAddField} style={{ cursor: "pointer" }}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
