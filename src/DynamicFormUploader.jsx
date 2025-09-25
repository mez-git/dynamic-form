import React, { useState } from "react";

export default function DynamicFormUploader() {
  const [fields, setFields] = useState([]);

  // ----------------- File Upload -----------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (Array.isArray(jsonData)) {
          // ensure each field has isEditing = false initially
          setFields(jsonData.map((f) => ({ ...f, isEditing: false })));
        } else {
          alert("JSON must be an array of objects.");
        }
      } catch (err) {
        alert("Invalid JSON file!");
      }
    };

    reader.readAsText(file);
  };

  // ----------------- Field Update -----------------
  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  // ----------------- Toggle Edit Mode -----------------
  const toggleEditMode = (index) => {
    const updated = [...fields];
    updated[index].isEditing = !updated[index].isEditing;
    setFields(updated);
  };

  // ----------------- Delete Field -----------------
  const deleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // ----------------- Add Field -----------------
  const addField = () => {
    setFields([
      ...fields,
      {
        label: "New Field",
        placeholder: "",
        type: "text",
        required: false,
        options: [],
        isEditing: true, // new fields open in edit mode
      },
    ]);
  };

  // ----------------- Form Submit -----------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data);
    alert("Form submitted! Check console.");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Upload JSON & Generate Editable Form</h1>

      {/* Upload */}
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: "block", margin: "10px 0" }}
      />

      {/* Editable Form */}
      {fields.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Editable Form</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => {
              const name =
                field.name || field.label.toLowerCase().replace(/\s+/g, "_");

              return (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "8px",
                    background: "#fafafa",
                  }}
                >
                  {/* ----------------- Edit Mode ----------------- */}
                  {field.isEditing ? (
                    <>
                      <input
                        type="text"
                        value={field.label}
                        placeholder="Field Label"
                        onChange={(e) =>
                          updateField(index, "label", e.target.value)
                        }
                        style={{ width: "100%", marginBottom: "8px" }}
                      />

                      <input
                        type="text"
                        value={field.placeholder || ""}
                        placeholder="Placeholder"
                        onChange={(e) =>
                          updateField(index, "placeholder", e.target.value)
                        }
                        style={{ width: "100%", marginBottom: "8px" }}
                      />

                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(index, "type", e.target.value)
                        }
                        style={{ width: "100%", marginBottom: "8px" }}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="password">Password</option>
                        <option value="select">Select</option>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkbox</option>
                      </select>

                      {(field.type === "select" ||
                        field.type === "radio" ||
                        field.type === "checkbox") && (
                        <input
                          type="text"
                          value={field.options?.join(", ") || ""}
                          placeholder="Options (comma separated)"
                          onChange={(e) =>
                            updateField(
                              index,
                              "options",
                              e.target.value
                                .split(",")
                                .map((o) => o.trim())
                                .filter(Boolean)
                            )
                          }
                          style={{ width: "100%", marginBottom: "8px" }}
                        />
                      )}

                      <label>
                        <input
                          type="checkbox"
                          checked={field.required || false}
                          onChange={(e) =>
                            updateField(index, "required", e.target.checked)
                          }
                        />{" "}
                        Required
                      </label>
                    </>
                  ) : (
                    /* ----------------- View Mode ----------------- */
                    <div>
                      <strong>{field.label}</strong> <br />
                      <small>
                        Type: {field.type} |{" "}
                        {field.required ? "Required" : "Optional"}
                      </small>
                      {field.placeholder && (
                        <div>Placeholder: "{field.placeholder}"</div>
                      )}
                      {field.options?.length > 0 && (
                        <div>Options: {field.options.join(", ")}</div>
                      )}
                    </div>
                  )}

                  {/* ----------------- Actions ----------------- */}
                  <div style={{ marginTop: "10px" }}>
                    <button
                      type="button"
                      onClick={() => toggleEditMode(index)}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                    >
                      {field.isEditing ? "✅ Save" : "✏️ Edit"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteField(index)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <hr style={{ margin: "15px 0" }} />

                  {/* ----------------- Live Preview ----------------- */}
                  {!field.isEditing && (
                    <>
                      {field.type === "select" && (
                        <select name={name} required={field.required}>
                          <option value="">
                            {field.placeholder || "Select an option"}
                          </option>
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "radio" &&
                        field.options?.map((opt, i) => (
                          <label key={i} style={{ marginLeft: "10px" }}>
                            <input
                              type="radio"
                              name={name}
                              value={opt}
                              required={field.required}
                            />
                            {opt}
                          </label>
                        ))}

                      {field.type === "checkbox" &&
                        field.options?.map((opt, i) => (
                          <label key={i} style={{ display: "block" }}>
                            <input type="checkbox" name={name} value={opt} />
                            {opt}
                          </label>
                        ))}

                      {["text", "number", "email", "password"].includes(
                        field.type
                      ) && (
                        <input
                          type={field.type}
                          name={name}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={addField}>
              ➕ Add Field
            </button>
            <button type="submit" style={{ marginLeft: "10px" }}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
