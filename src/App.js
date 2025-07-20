import React, { useState, useRef } from 'react';
import './App.css';
import Navbar from './PathfindingVisualizer/Navbar/Navbar';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Select Algorithm');
  const [visualizationMode, setVisualizationMode] = useState('grid');
  const pathfindingRef = useRef(null);

    const handleAlgorithmChange = (algorithm) => {
        setSelectedAlgorithm(algorithm);
    };

    const handleResetGrid = () => {
        if (pathfindingRef.current) {
            pathfindingRef.current.resetGrid();
        }
    };

    const handleRunAlgorithm = () => {
        if (pathfindingRef.current) {
            pathfindingRef.current.runAlgorithm();
        }
    };

    const handleToggleMode = () => {
        if (pathfindingRef.current) {
            // Call a new method that toggles mode and notifies App
            pathfindingRef.current.toggleVisualizationModeFromApp();
        }
    };

  return (
    <div className="App">
      <Navbar 
        onAlgorithmChange={handleAlgorithmChange} 
        onResetGrid={handleResetGrid}
        onRunAlgorithm={handleRunAlgorithm}
        onToggleMode={handleToggleMode}
        selectedAlgorithm={selectedAlgorithm}
        visualizationMode={visualizationMode}
      />
      <PathfindingVisualizer 
        ref={pathfindingRef} 
        selectedAlgorithm={selectedAlgorithm} 
        visualizationMode={visualizationMode}
        setVisualizationMode={setVisualizationMode}
      />
    </div>
  );
}

export default App;
