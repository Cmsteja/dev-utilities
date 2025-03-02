import React, { useState } from "react";
import { diffLines } from "diff";
import "./JsonDiff.css";

const JsonDiff = () => {
  const [leftJson, setLeftJson] = useState("");
  const [rightJson, setRightJson] = useState("");
  const [formattedLeft, setFormattedLeft] = useState("");
  const [formattedRight, setFormattedRight] = useState("");
  const [error, setError] = useState({ left: "", right: "" });

  const formatJson = (input) => {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      throw new Error("Invalid JSON");
    }
  };

  const handleLeftChange = (e) => {
    const input = e.target.value;
    setLeftJson(input);
    try {
      const formatted = formatJson(input);
      setFormattedLeft(formatted);
      setError((prev) => ({ ...prev, left: "" }));
    } catch (error) {
      setError((prev) => ({ ...prev, left: error.message }));
      setFormattedLeft("");
    }
  };

  const handleRightChange = (e) => {
    const input = e.target.value;
    setRightJson(input);
    try {
      const formatted = formatJson(input);
      setFormattedRight(formatted);
      setError((prev) => ({ ...prev, right: "" }));
    } catch (error) {
      setError((prev) => ({ ...prev, right: error.message }));
      setFormattedRight("");
    }
  };

  const handleCopyDiff = () => {
    const diffText = `=== Left JSON ===\n${formattedLeft}\n\n=== Right JSON ===\n${formattedRight}`;
    navigator.clipboard.writeText(diffText);
  };

  const renderDiff = () => {
    if (!formattedLeft || !formattedRight) return null;

    const diff = diffLines(formattedLeft, formattedRight);
    
    return (
      <div className="diff-result">
        {diff.map((part, index) => (
          <pre
            key={index}
            className={`diff-line ${
              part.added ? "added" : part.removed ? "removed" : "unchanged"
            }`}
          >
            <span className="diff-marker">
              {part.added ? "+" : part.removed ? "-" : " "}
            </span>
            {part.value}
          </pre>
        ))}
      </div>
    );
  };

  return (
    <div className="json-diff">
      {/* Header */}
      <header className="diff-header">
        <h1>JSON Diff</h1>
        <p className="subtitle">Compare two JSON objects and highlight the differences</p>
      </header>

      {/* Toolbar */}
      <div className="diff-toolbar">
        <div className="toolbar-group">
          <button className="action-btn" onClick={handleCopyDiff}>
            Copy Both
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="diff-content">
        {/* Input panels */}
        <div className="diff-inputs">
          {/* Left JSON */}
          <div className="editor-panel">
            <div className="panel-header">
              <label>Original JSON</label>
            </div>
            <div className="panel-content">
              <textarea
                className="json-input"
                placeholder="Paste original JSON here..."
                value={leftJson}
                onChange={handleLeftChange}
                spellCheck="false"
              />
              {error.left && <div className="error-message">{error.left}</div>}
            </div>
          </div>

          {/* Right JSON */}
          <div className="editor-panel">
            <div className="panel-header">
              <label>Modified JSON</label>
            </div>
            <div className="panel-content">
              <textarea
                className="json-input"
                placeholder="Paste modified JSON here..."
                value={rightJson}
                onChange={handleRightChange}
                spellCheck="false"
              />
              {error.right && <div className="error-message">{error.right}</div>}
            </div>
          </div>
        </div>

        {/* Diff viewer */}
        <div className="diff-viewer">
          <div className="panel-header">
            <label>Differences</label>
          </div>
          <div className="panel-content">
            {renderDiff()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonDiff;