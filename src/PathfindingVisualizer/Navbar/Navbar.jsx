import React, { useState } from 'react';
import './Navbar.css'; // Ensure your CSS file is linked

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [algorithm, setAlgorithm] = useState('Select Algorithm'); // State to track the selected algorithm

    const handleAlgorithmChange = (event) => {
        setAlgorithm(event.target.value);
        console.log("Algorithm selected:", event.target.value); // Example action on select
    }

    return (
        <nav className="navbar">
            <div className="logo">
                Search Algorithm Visualizer
            </div>
            <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                <span>Menu</span>
            </button>
            <ul className={isOpen ? 'nav-links open' : 'nav-links'}>
                <li>
                    <div className="dropdown">
                        <button className="dropbtn">{algorithm}</button>
                        <div className="dropdown-content">
                            <button onClick={() => handleAlgorithmChange({ target: { value: 'Dijkstra' }})}>Dijkstra</button>
                            <button onClick={() => handleAlgorithmChange({ target: { value: 'A*' }})}>A*</button>
                            <button onClick={() => handleAlgorithmChange({ target: { value: 'BFS' }})}>BFS</button>
                            <button onClick={() => handleAlgorithmChange({ target: { value: 'DFS' }})}>DFS</button>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
