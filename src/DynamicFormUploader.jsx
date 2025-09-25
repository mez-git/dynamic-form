import React, { useState } from "react";
import "./DynamicFormUploader.css";

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
        isEditing: true,
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
    <div className="form-uploader">
      <h1>Upload JSON & Generate Editable Form</h1>

      {/* Upload */}
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="file-input"
      />

      {/* Editable Form */}
      {fields.length > 0 && (
        <div>
          <h2>Editable Form</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => {
              const name =
                field.name || field.label.toLowerCase().replace(/\s+/g, "_");

              return (
                <div key={index} className="field-card">
                  <div className="field-content">
                    {field.isEditing ? (
                      <div className="edit-fields">
                        <input
                          type="text"
                          value={field.label}
                          placeholder="Field Label"
                          onChange={(e) =>
                            updateField(index, "label", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          value={field.placeholder || ""}
                          placeholder="Placeholder"
                          onChange={(e) =>
                            updateField(index, "placeholder", e.target.value)
                          }
                        />
                        <select
                          value={field.type}
                          onChange={(e) =>
                            updateField(index, "type", e.target.value)
                          }
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
                      </div>
                    ) : (
                      <div className="preview-field">
                        <strong>{field.label}</strong>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="field-actions">
                      <button
                        type="button"
                        onClick={() => toggleEditMode(index)}
                        className="btn-action"
                      >
                        {field.isEditing ? "Save" : "Edit"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteField(index)}
                        className="btn-action"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <hr className="divider" />

                  {/* Live Preview */}
                  {!field.isEditing && (
                    <div className="field-preview">
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
                          <label key={i} className="option-label">
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
                          <label key={i} className="option-label-block">
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
                    </div>
                  )}
                </div>
              );
            })}

            <button type="button" onClick={addField} className="btn-add">
              ➕ Add Field
            </button>
            <button type="submit" className="btn-submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
