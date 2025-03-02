import React, { useState } from "react";
import ReactJson from "react-json-view";
import "./JsonFormatter.css";

const JsonFormatter = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [viewMode, setViewMode] = useState("tree");
  const [parsedJson, setParsedJson] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (input, spaces) => {
    try {
      const parsed = JSON.parse(input);
      setParsedJson(parsed);
      return JSON.stringify(parsed, null, spaces);
    } catch (error) {
      throw new Error("Invalid JSON");
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setJsonInput(input);
    
    try {
      const formatted = formatJson(input, indentSize);
      setFormattedJson(formatted);
      setError("");
    } catch (error) {
      setError(error.message);
      setFormattedJson("");
      setParsedJson(null);
    }
  };

  const handleIndentChange = (e) => {
    const spaces = parseInt(e.target.value);
    setIndentSize(spaces);
    if (jsonInput) {
      try {
        const formatted = formatJson(jsonInput, spaces);
        setFormattedJson(formatted);
      } catch (error) {
        // Keep existing error state
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMinify = () => {
    if (parsedJson) {
      setFormattedJson(JSON.stringify(parsedJson));
    }
  };

  return (
    <div className="json-formatter">
      {/* Header */}
      <header className="formatter-header">
        <h1>JSON Formatter</h1>
        <p className="subtitle">Format, validate and beautify JSON data</p>
      </header>

      {/* Toolbar */}
      <div className="formatter-toolbar">
        <div className="toolbar-group">
          <label htmlFor="indent">Indent:</label>
          <select
            id="indent"
            className="select-input"
            value={indentSize}
            onChange={handleIndentChange}
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="8">8 spaces</option>
          </select>
        </div>

        <div className="toolbar-group">
          <label>View:</label>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === "tree" ? "active" : ""}`}
              onClick={() => setViewMode("tree")}
            >
              Tree
            </button>
            <button
              className={`toggle-btn ${viewMode === "text" ? "active" : ""}`}
              onClick={() => setViewMode("text")}
            >
              Text
            </button>
          </div>
        </div>

        <div className="toolbar-group toolbar-actions">
          <button className="action-btn" onClick={handleMinify}>
            Minify
          </button>
          <button 
            className={`action-btn ${copied ? 'copied' : ''}`} 
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="action-btn primary" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="formatter-content">
        {/* Left side - Input JSON */}
        <div className="editor-panel">
          <div className="panel-header">
            <label>Input JSON</label>
          </div>
          <div className="panel-content">
            <textarea
              className="json-input"
              placeholder="Paste JSON here..."
              value={jsonInput}
              onChange={handleInputChange}
              spellCheck="false"
            />
          </div>
        </div>

        {/* Right side - Formatted JSON */}
        <div className="editor-panel">
          <div className="panel-header">
            <label>{error ? "Error" : "Formatted JSON"}</label>
          </div>
          <div className="panel-content">
            {error ? (
              <div className="error-message">{error}</div>
            ) : viewMode === "tree" && parsedJson ? (
              <ReactJson
                src={parsedJson}
                theme="tomorrow"
                name={false}
                displayDataTypes={false}
                enableClipboard={false}
                style={{ padding: "1rem" }}
                collapsed={false}
                collapseStringsAfterLength={50}
              />
            ) : (
              <textarea
                className="json-output"
                value={formattedJson}
                readOnly
                spellCheck="false"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
