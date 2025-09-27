import React, { useState } from "react";
import "./DynamicFormUploader.css";

export default function DynamicFormUploader() {
  const [fields, setFields] = useState([]);


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        if (!Array.isArray(jsonData)) {
          alert("JSON must be an array of objects.");
          return;
        }

        for (let i = 0; i < jsonData.length; i++) {
          const field = jsonData[i];

          if (!field.label || !field.type) {
            alert(`Field at index ${i} is missing required values (label or type).`);
            return;
          }

          if (
            ["text", "number", "email", "password"].includes(field.type) &&
            !field.placeholder
          ) {
            alert(`Field "${field.label}" (index ${i}) requires a placeholder.`);
            return;
          }

          if (
            ["select", "radio", "checkbox"].includes(field.type) &&
            (!field.options || !Array.isArray(field.options) || field.options.length === 0)
          ) {
            alert(`Field "${field.label}" (index ${i}) requires options but none were provided.`);
            return;
          }
        }

        setFields(
          jsonData.map((f) => ({
            ...f,
            options: f.options || [],
            isEditing: false,
            isNew: false, 
            original: { ...f }, 
          }))
        );
      } catch (err) {
        alert("Invalid JSON file!");
      }
    };

    reader.readAsText(file);
  };


  const handleExportJSON = () => {
    const cleanedFields = fields.map(({ isEditing, isNew, original, ...rest }) => {
      const field = {};
      if (rest.label) field.label = rest.label;
      if (rest.placeholder) field.placeholder = rest.placeholder;
      if (rest.type) field.type = rest.type;
      if (rest.required) field.required = true;
      if (rest.options && rest.options.length > 0) {
        field.options = rest.options;
      }
      return field;
    });

    const jsonData = JSON.stringify(cleanedFields, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `dynamic-form-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };


  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const toggleEditMode = (index) => {
    const updated = [...fields];
    const field = updated[index];

    if (field.isEditing) {
    
      if (!field.label?.trim()) {
        alert("Please add a label before saving!");
        if (field.isNew) deleteField(index);
        return;
      }

      if (
        ["text", "number", "email", "password"].includes(field.type) &&
        !field.placeholder?.trim()
      ) {
        alert("Please add a placeholder before saving!");
        if (field.isNew) deleteField(index);
        return;
      }

      if (
        ["select", "radio", "checkbox"].includes(field.type) &&
        (!field.options || field.options.length === 0)
      ) {
        alert("Please provide options for this field!");
        if (field.isNew) deleteField(index);
        return;
      }
    }

    updated[index].isEditing = !updated[index].isEditing;
    setFields(updated);
  };

  const deleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        label: "",
        placeholder: "",
        type: "text",
        required: false,
        options: [],
        isEditing: true,
        isNew: true,
      },
    ]);
  };

  const cancelEdit = (index) => {
    const updated = [...fields];
    const field = updated[index];

    if (field.isNew) {
   
      deleteField(index);
    } else {
    
      updated[index] = { ...field.original, isEditing: false, isNew: false, original: field.original };
      setFields(updated);
    }
  };

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

      <input type="file" accept=".json" onChange={handleFileUpload} className="file-input" />

      {fields.length > 0 && (
        <div>
          <h2>Editable Form</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => {
              const name = field.name || field.label.toLowerCase().replace(/\s+/g, "_");

              return (
                <div key={index} className="field-card">
                  <div className="field-content">
                    {field.isEditing ? (
                      <div className="edit-fields">
                        <div className="edit-row">
                          <label>Label:</label>
                          <input
                            type="text"
                            value={field.label}
                            placeholder="Field Label"
                            onChange={(e) => updateField(index, "label", e.target.value)}
                          />
                        </div>

                        <div className="edit-row">
                          <label>Placeholder:</label>
                          <input
                            type="text"
                            value={field.placeholder || ""}
                            placeholder="Placeholder"
                            onChange={(e) => updateField(index, "placeholder", e.target.value)}
                          />
                        </div>

                        <div className="edit-row">
                          <label>Type:</label>
                          <select
                            value={field.type}
                            onChange={(e) => updateField(index, "type", e.target.value)}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="password">Password</option>
                            <option value="select">Select</option>
                            <option value="date">Date</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                        </div>

                        {["select", "radio", "checkbox"].includes(field.type) && (
                          <div className="edit-row">
                            <label>Options (comma separated):</label>
                            <input
                              type="text"
                              value={field.options?.join(", ") || ""}
                              placeholder="Option1, Option2, Option3"
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
                          </div>
                        )}

                        <div className="edit-row">
                          <label>
                            <input
                              type="checkbox"
                              checked={field.required || false}
                              onChange={(e) => updateField(index, "required", e.target.checked)}
                            />{" "}
                            Required
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="preview-field">
                        <strong>{field.label}</strong>
                      </div>
                    )}

                    <div className="field-actions">
                  
                      <button
                        type="button"
                        onClick={() => toggleEditMode(index)}
                        className="btn-action"
                      >
                        {field.isEditing ? "Save" : "Edit"}
                      </button>

                      {field.isEditing && (
                        <button
                          type="button"
                          onClick={() => cancelEdit(index)}
                          className="btn-action btn-cross"
                        >
                          CANCEL
                        </button>
                      )}

                   
                      <button
                        type="button"
                        onClick={() => deleteField(index)}
                        className="btn-action btn-delete"
                      >
                        Delete Field
                      </button>
                    </div>
                  </div>

                  <hr className="divider" />

                  {!field.isEditing && (
                    <div className="field-preview">
                      {field.type === "select" && (
                        <select name={name} required={field.required}>
                          <option value="">{field.placeholder || "Select an option"}</option>
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
                            <input type="radio" name={name} value={opt} required={field.required} />
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

                      {["text", "number", "email", "password", "date"].includes(field.type) && (
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
            <button type="button" onClick={handleExportJSON} className="btn-export">
              ⬇️ Export JSON
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
