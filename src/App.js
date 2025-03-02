import React, { useState } from 'react';
import './App.css';
import JsonFormatter from './pages/jsonFormatter';
import JsonDiff from './pages/jsonDiff';
import { FaCode, FaExchangeAlt, FaArrowLeft } from 'react-icons/fa';

function App() {
  const [activeTool, setActiveTool] = useState(null);

  const renderHome = () => (
    <div className="home-container">
      <h1 className="home-title">Dev Utilities</h1>
      <p className="home-subtitle">Select a tool to get started</p>
      
      <div className="tools-grid">
        <button 
          className="tool-card" 
          onClick={() => setActiveTool('formatter')}
        >
          <FaCode className="tool-icon" />
          <h2>JSON Formatter</h2>
          <p>Format, validate and beautify JSON data</p>
        </button>

        <button 
          className="tool-card" 
          onClick={() => setActiveTool('diff')}
        >
          <FaExchangeAlt className="tool-icon" />
          <h2>JSON Diff</h2>
          <p>Compare two JSON objects and highlight differences</p>
        </button>
      </div>
    </div>
  );

  const renderTool = () => {
    switch (activeTool) {
      case 'formatter':
        return <JsonFormatter />;
      case 'diff':
        return <JsonDiff />;
      default:
        return renderHome();
    }
  };

  return (
    <div className="app">
      {activeTool && (
        <button 
          className="back-button" 
          onClick={() => setActiveTool(null)}
          title="Back to Home"
        >
          <FaArrowLeft />
        </button>
      )}
      {renderTool()}
    </div>
  );
}

export default App;
