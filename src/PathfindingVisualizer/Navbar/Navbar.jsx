import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = ({ onAlgorithmChange, onResetGrid, selectedAlgorithm, onRunAlgorithm, onToggleMode, visualizationMode }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const algorithms = [
        { id: 'BFS', name: 'Breadth-First Search', description: 'Level-by-level exploration' },
        { id: 'DFS', name: 'Depth-First Search', description: 'Deep path exploration' },
        { id: 'Dijkstra', name: 'Dijkstra', description: 'Shortest path algorithm' },
        { id: 'A*', name: 'A* Search', description: 'Heuristic-based search' },
        { id: 'Greedy BFS', name: 'Greedy BFS', description: 'Best-first search' }
    ];

    const handleAlgorithmChange = (algorithm) => {
        onAlgorithmChange(algorithm);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleResetGrid = () => {
        onResetGrid();
        setIsMobileMenuOpen(false);
    };

    const handleRunAlgorithm = () => {
        onRunAlgorithm();
        setIsMobileMenuOpen(false);
    };

    const handleToggleMode = () => {
        onToggleMode();
        setIsMobileMenuOpen(false);
    };

    // Handle clicking outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo/Brand */}
                <div className="navbar-brand">
                    <div className="brand-icon">🔍</div>
                    <div className="brand-text">
                        <h1>Pathfinder</h1>
                        <span>Algorithm Visualizer</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-desktop">
                    <div className="nav-controls">
                        {/* Mode Toggle Button */}
                        <button 
                            className="mode-toggle-button"
                            onClick={handleToggleMode}
                            title={`Switch to ${visualizationMode === 'grid' ? 'Graph' : 'Grid'} mode`}
                        >
                            <span className="mode-icon">
                                {visualizationMode === 'grid' ? '📊' : '🔲'}
                            </span>
                            <span className="mode-text">
                                {visualizationMode === 'grid' ? 'Graph' : 'Grid'}
                            </span>
                        </button>

                        {/* Algorithm Dropdown */}
                        <div className="dropdown-container" ref={dropdownRef}>
                            <button 
                                className={`dropdown-button ${isDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className="dropdown-icon">⚡</span>
                                <span className="dropdown-text">
                                    {selectedAlgorithm || 'Select Algorithm'}
                                </span>
                                <span className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            
                            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                {algorithms.map((algo) => (
                                    <button
                                        key={algo.id}
                                        className={`dropdown-item ${selectedAlgorithm === algo.id ? 'selected' : ''}`}
                                        onClick={() => handleAlgorithmChange(algo.id)}
                                    >
                                        <div className="algo-info">
                                            <span className="algo-name">{algo.name}</span>
                                            <span className="algo-description">{algo.description}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Run Algorithm Button */}
                        <button 
                            className="run-algorithm-button"
                            onClick={handleRunAlgorithm}
                            disabled={!selectedAlgorithm || selectedAlgorithm === 'Select Algorithm'}
                            title="Run the selected algorithm"
                        >
                            <span className="run-icon">▶️</span>
                            <span className="run-text">Run</span>
                        </button>

                        {/* Reset Button */}
                        <button 
                            className="reset-button"
                            onClick={handleResetGrid}
                            title="Reset grid and clear all walls"
                        >
                            <span className="reset-icon">🔄</span>
                            <span className="reset-text">Reset</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`} ref={mobileMenuRef}>
                <div className="mobile-menu-header">
                    <h3>Controls</h3>
                </div>
                
                <div className="mobile-menu-section">
                    <h4>Algorithm</h4>
                    <div className="mobile-algorithm-list">
                        {algorithms.map((algo) => (
                            <button
                                key={algo.id}
                                className={`mobile-algo-item ${selectedAlgorithm === algo.id ? 'selected' : ''}`}
                                onClick={() => handleAlgorithmChange(algo.id)}
                            >
                                <span className="mobile-algo-name">{algo.name}</span>
                                <span className="mobile-algo-desc">{algo.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mobile-menu-section">
                    <h4>Actions</h4>
                    <button 
                        className="mobile-mode-button"
                        onClick={handleToggleMode}
                    >
                        <span className="mobile-mode-icon">
                            {visualizationMode === 'grid' ? '📊' : '🔲'}
                        </span>
                        Switch to {visualizationMode === 'grid' ? 'Graph' : 'Grid'} Mode
                    </button>
                    <button 
                        className="mobile-run-button"
                        onClick={handleRunAlgorithm}
                        disabled={!selectedAlgorithm || selectedAlgorithm === 'Select Algorithm'}
                    >
                        <span className="mobile-run-icon">▶️</span>
                        Run Algorithm
                    </button>
                    <button 
                        className="mobile-reset-button"
                        onClick={handleResetGrid}
                    >
                        <span className="mobile-reset-icon">🔄</span>
                        Reset Grid
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
