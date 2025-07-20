import React, {Component} from 'react';
import Node from './Node/Node';
import Grid from './Grid/Grid';
import Graph from './Graph/Graph';
import * as GridAlgorithms from './Algorithms/Grid';
import * as GraphAlgorithms from './Algorithms/Graph';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startNode: {
                col: 10,
                row: 10,
                isStart: true,
                isFinish: false,
                isVisiting: false
            },
            finishNode: {
                col: 20,
                row: 20,
                isStart: false,
                isFinish: true,
                isVisiting: false
            },
            path: [], // Path returned by the algorithm
            visitedNodesInOrder: [], // Nodes visited in the order they were visited
            nodes: [],
            gridSize: {
                rows: 25,
                cols: 25
            },
            isMousePressed: false, // State for mouse button press
            isAlgorithmRunning: false, // Track if algorithm is currently running
            visitingNodesCount: 0, // Track how many nodes are being visited
            visualizationMode: 'grid', // 'grid' or 'graph'
            graphNodes: [], // For graph mode - vertices with positions
            graphEdges: [], // For graph mode - connections between vertices
            resultPopup: null // { visitedCount, pathCost }
        };
    }

    // Calculate grid dimensions based on window size
    calculateGridSize = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Account for navbar height and margins - reduced margin for more height
        const availableHeight = windowHeight - 300; // Reduced from 400 to 300 for more height
        const availableWidth = windowWidth - 40; // 20px margin on each side
        
        // Calculate optimal grid size based on available space
        const targetCellSize = 20; // Reduced from 25 to make grid larger
        const rows = Math.floor(availableHeight / targetCellSize);
        const cols = Math.floor(availableWidth / targetCellSize);
        
        // Ensure minimum and maximum grid size - increased minimum for larger grid
        const minSize = 25; // Increased from 15
        const maxSize = 80; // Increased from 50 for larger screens
        
        // Calculate actual cell size for better fit
        const actualCellSize = Math.min(
            availableWidth / cols,
            availableHeight / rows
        );
        
        return {
            rows: Math.max(minSize, Math.min(maxSize, rows)),
            cols: Math.max(minSize, Math.min(maxSize, cols)),
            cellSize: Math.max(12, Math.min(30, actualCellSize)) // Adjusted cell size range
        };
    };

    // Get current grid dimensions for debugging
    getGridInfo = () => {
        const { gridSize, nodes } = this.state;
        const wallCount = nodes.reduce((count, row) => 
            count + row.filter(node => node.isWall).length, 0
        );
        const pathCount = nodes.reduce((count, row) => 
            count + row.filter(node => node.isPath).length, 0
        );
        
        return {
            rows: gridSize.rows,
            cols: gridSize.cols,
            totalNodes: gridSize.rows * gridSize.cols,
            wallCount: wallCount,
            pathCount: pathCount,
            windowSize: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    };

    // Generate grid based on current dimensions
    generateGrid = () => {
        const { gridSize, startNode, finishNode } = this.state;
        const nodes = [];
        
        for (let row = 0; row < gridSize.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < gridSize.cols; col++) {
                currentRow.push({
                    col,
                    row,
                    isStart: row === startNode.row && col === startNode.col,
                    isFinish: row === finishNode.row && col === finishNode.col, 
                    isVisiting: false,
                    isWall: false, // Add wall state
                    isPath: false // Add path state
                });
            }
            nodes.push(currentRow);
        }
        
        return nodes;
    };

    // Handle wall creation/toggle
    handleWallToggle = (row, col) => {
        const newNodes = this.state.nodes.slice();
        const node = newNodes[row][col];
        
        // Don't allow walls on start or finish nodes
        if (node.isStart || node.isFinish) {
            return;
        }
        
        // Toggle wall state
        node.isWall = !node.isWall;
        this.setState({ nodes: newNodes });
        console.log(`Wall ${node.isWall ? 'created' : 'removed'} at (${row}, ${col})`);
    };

    // Handle mouse events for wall creation
    handleMouseDown = (row, col) => {
        this.setState({ isMousePressed: true });
        this.handleWallToggle(row, col);
    };

    handleMouseEnter = (row, col) => {
        if (this.state.isMousePressed) {
            this.handleWallToggle(row, col);
        }
    };

    handleMouseUp = () => {
        this.setState({ isMousePressed: false });
    };

    // Handle window resize
    handleResize = () => {
        const newGridSize = this.calculateGridSize();
        const { startNode, finishNode } = this.state;
        
        // Ensure start and finish nodes are within new grid bounds
        const adjustedStartNode = {
            ...startNode,
            row: Math.min(startNode.row, newGridSize.rows - 1),
            col: Math.min(startNode.col, newGridSize.cols - 1)
        };
        
        const adjustedFinishNode = {
            ...finishNode,
            row: Math.min(finishNode.row, newGridSize.rows - 1),
            col: Math.min(finishNode.col, newGridSize.cols - 1)
        };
        
        this.setState({
            gridSize: newGridSize,
            startNode: adjustedStartNode,
            finishNode: adjustedFinishNode
        }, () => {
            // Regenerate grid with new dimensions
            const nodes = this.generateGrid();
            this.setState({ nodes });
        });
    };
    
    clearGrid = (nodes) => {
        const { startNode, finishNode, gridSize } = this.state;
        for (let row = 0; row < gridSize.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < gridSize.cols; col++) {
                currentRow.push({
                    col,
                    row,
                    isStart: row === startNode.row && col === startNode.col,
                    isFinish: row === finishNode.row && col === finishNode.col, 
                    isVisiting: false,
                    isWall: this.state.nodes[row][col].isWall, // Preserve wall state
                    isPath: false // Clear path state for new algorithm run
                });
            }
            nodes.push(currentRow);
        }
        this.setState({nodes});
    }

    // Reset grid to initial state
    resetGrid = () => {
        if (this.state.visualizationMode === 'grid') {
            // Reset grid mode
            const { gridSize, startNode, finishNode } = this.state;
            const nodes = [];
            
            for (let row = 0; row < gridSize.rows; row++) {
                const currentRow = [];
                for (let col = 0; col < gridSize.cols; col++) {
                    currentRow.push({
                        col,
                        row,
                        isStart: row === startNode.row && col === startNode.col,
                        isFinish: row === finishNode.row && col === finishNode.col, 
                        isVisiting: false,
                        isWall: false, // Clear walls
                        isPath: false // Clear path
                    });
                }
                nodes.push(currentRow);
            }
            this.setState({ nodes });
        } else {
            // Reset graph mode
            this.initializeGraphMode();
        }
    };

    // Toggle between grid and graph visualization modes
    toggleVisualizationMode = () => {
        const newMode = this.state.visualizationMode === 'grid' ? 'graph' : 'grid';
        console.log(`Switching from ${this.state.visualizationMode} to ${newMode} mode`);
        
        this.setState({ visualizationMode: newMode }, () => {
            if (newMode === 'graph') {
                console.log('Initializing graph mode...');
                this.initializeGraphMode();
            } else {
                console.log('Initializing grid mode...');
                this.initializeGridMode();
            }
        });
    };

    // Called by App to toggle mode and update App state
    toggleVisualizationModeFromApp = () => {
        const newMode = this.state.visualizationMode === 'grid' ? 'graph' : 'grid';
        console.log(`Switching from ${this.state.visualizationMode} to ${newMode} mode`);
        this.setState({ visualizationMode: newMode }, () => {
            if (this.props.setVisualizationMode) {
                this.props.setVisualizationMode(newMode);
            }
            if (newMode === 'graph') {
                this.initializeGraphMode();
            } else {
                this.initializeGridMode();
            }
        });
    };

    // Initialize graph mode with some default vertices
    initializeGraphMode = () => {
        console.log('Creating default graph nodes and edges...');
        const graphNodes = [
            { id: 0, x: 100, y: 100, isStart: true, isFinish: false, isVisiting: false, isWall: false },
            { id: 1, x: 200, y: 150, isStart: false, isFinish: false, isVisiting: false, isWall: false },
            { id: 2, x: 300, y: 100, isStart: false, isFinish: false, isVisiting: false, isWall: false },
            { id: 3, x: 400, y: 200, isStart: false, isFinish: false, isVisiting: false, isWall: false },
            { id: 4, x: 150, y: 250, isStart: false, isFinish: false, isVisiting: false, isWall: false },
            { id: 5, x: 350, y: 300, isStart: false, isFinish: true, isVisiting: false, isWall: false },
            { id: 6, x: 250, y: 350, isStart: false, isFinish: false, isVisiting: false, isWall: false },
            { id: 7, x: 500, y: 150, isStart: false, isFinish: false, isVisiting: false, isWall: false }
        ];

        const graphEdges = [
            { from: 0, to: 1 },
            { from: 0, to: 4 },
            { from: 1, to: 2 },
            { from: 1, to: 4 },
            { from: 2, to: 3 },
            { from: 2, to: 7 },
            { from: 3, to: 5 },
            { from: 4, to: 6 },
            { from: 5, to: 6 },
            { from: 6, to: 7 }
        ];

        this.setState({ graphNodes, graphEdges }, () => {
            console.log('Graph mode initialized with', this.state.graphNodes.length, 'nodes and', this.state.graphEdges.length, 'edges');
        });
    };

    // Initialize grid mode
    initializeGridMode = () => {
        const gridSize = this.calculateGridSize();
        this.setState({ gridSize }, () => {
            const nodes = this.generateGrid();
            this.setState({ nodes });
        });
    };

    // Handle vertex dragging in graph mode
    handleVertexDrag = (vertexId, newX, newY) => {
        this.setState(prevState => ({
            graphNodes: prevState.graphNodes.map(node =>
                node.id === vertexId ? { ...node, x: newX, y: newY } : node
            )
        }));
    };

    // Handle vertex click in graph mode
    handleVertexClick = (vertexId) => {
        this.setState(prevState => ({
            graphNodes: prevState.graphNodes.map(node => {
                if (node.id === vertexId) {
                    // Toggle wall state if not start or finish
                    if (!node.isStart && !node.isFinish) {
                        return { ...node, isWall: !node.isWall };
                    }
                }
                return node;
            })
        }));
    };

    // Handle adding new vertex in graph mode
    handleAddVertex = (x, y) => {
        this.setState(prevState => {
            // Find the next available ID
            const maxId = Math.max(...prevState.graphNodes.map(node => node.id), -1);
            const newId = maxId + 1;
            
            const newNode = {
                id: newId,
                x: x,
                y: y,
                isStart: false,
                isFinish: false,
                isVisiting: false,
                isWall: false,
                weight: 1 // Default weight
            };
            
            // Check for nearby vertices to create edges
            const nearbyVertices = prevState.graphNodes.filter(node => {
                const distance = Math.sqrt(
                    Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
                );
                return distance <= 100; // Create edge if vertices are within 100px
            });
            
            // Create edges to nearby vertices
            const newEdges = nearbyVertices.map(vertex => ({
                from: newId,
                to: vertex.id
            }));
            
            return {
                graphNodes: [...prevState.graphNodes, newNode],
                graphEdges: [...prevState.graphEdges, ...newEdges]
            };
        });
    };

    // Handle deleting vertex in graph mode
    handleVertexDelete = (vertexId) => {
        this.setState(prevState => {
            // Don't delete start or finish vertices
            const vertexToDelete = prevState.graphNodes.find(node => node.id === vertexId);
            if (vertexToDelete && (vertexToDelete.isStart || vertexToDelete.isFinish)) {
                return prevState;
            }
            
            // Remove the vertex
            const updatedNodes = prevState.graphNodes.filter(node => node.id !== vertexId);
            
            // Remove all edges connected to this vertex
            const updatedEdges = prevState.graphEdges.filter(edge => 
                edge.from !== vertexId && edge.to !== vertexId
            );
            
            return {
                graphNodes: updatedNodes,
                graphEdges: updatedEdges
            };
        });
    };

    // Handle creating edge between vertices in graph mode
    handleCreateEdge = (fromId, toId) => {
        this.setState(prevState => {
            // Check if edge already exists
            const edgeExists = prevState.graphEdges.some(edge => 
                (edge.from === fromId && edge.to === toId) || 
                (edge.from === toId && edge.to === fromId)
            );
            
            if (edgeExists) {
                console.log('Edge already exists between these vertices');
                return prevState;
            }
            
            // Create new edge
            const newEdge = { from: fromId, to: toId };
            
            return {
                graphEdges: [...prevState.graphEdges, newEdge]
            };
        });
    };

    // Handle deleting edge in graph mode
    handleEdgeDelete = (fromId, toId) => {
        this.setState(prevState => ({
            graphEdges: prevState.graphEdges.filter(edge => 
                !((edge.from === fromId && edge.to === toId) || 
                  (edge.from === toId && edge.to === fromId))
            )
        }));
    };

    // Handle changing vertex weight in graph mode
    handleVertexWeightChange = (vertexId, newWeight) => {
        this.setState(prevState => ({
            graphNodes: prevState.graphNodes.map(node =>
                node.id === vertexId ? { ...node, weight: newWeight } : node
            )
        }));
    };

    componentDidMount() {
        // Calculate initial grid size
        const gridSize = this.calculateGridSize();
        this.setState({ gridSize }, () => {
            // Generate initial grid
            const nodes = this.generateGrid();
            this.setState({ nodes });
        });
        
        // Add window resize listener
        window.addEventListener('resize', this.handleResize);
        
        // Add global mouse up listener to reset mouse state
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        // Clean up resize listener
        window.removeEventListener('resize', this.handleResize);
        
        // Clean up mouse listener
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleDragStart = (node) => (event) => {
        const data = { row: node.row, col: node.col, type: node.isStart ? 'start' : 'finish' };
        event.dataTransfer.setData("application/json", JSON.stringify(data));
        event.dataTransfer.effectAllowed = "move";
    };

    handleDragOver = (event) => {
        event.preventDefault(); // Necessary to allow dropping
    };

    handleDrop = (targetRow, targetCol) => (event) => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData("application/json"));
        this.moveStartNode(data, targetRow, targetCol);
    };

    moveStartNode = (data, targetRow, targetCol) => {
        const { row, col, type } = data;
        console.log(row, col, type, targetRow, targetCol);
        const newNodes = this.state.nodes.slice();
        if (type === 'start') {
            newNodes[row][col].isStart = false;
            newNodes[targetRow][targetCol].isStart = true;
            this.setState({ startNode: { 
                col: targetCol,
                row: targetRow,
                isStart: true,
                isFinish: false,
                isVisiting: false 
            }})
        } else if (type === 'finish') {
            newNodes[row][col].isFinish = false;
            newNodes[targetRow][targetCol].isFinish = true;
            this.setState({ finishNode: { 
                col: targetCol,
                row: targetRow,
                isStart: false,
                isFinish: true,
                isVisiting: false 
            }})
        }
        this.setState({ nodes: newNodes });
    };

    visitNodeCallback = (node, delay) => {
        this.setState(prevState => ({
            visitingNodesCount: prevState.visitingNodesCount + 1,
            // Track visited nodes for graph mode
            graphVisitedSet: this.state.visualizationMode === 'graph'
                ? new Set([...(prevState.graphVisitedSet || []), node.id])
                : prevState.graphVisitedSet
        }));
        
        setTimeout(() => {
            if (this.state.visualizationMode === 'grid') {
                // Grid mode - update grid nodes
                this.setState(prevState => ({
                    nodes: prevState.nodes.map(row =>
                        row.map(n => (n.row === node.row && n.col === node.col) ? {...n, isVisiting: true} : n)
                    ),
                    visitingNodesCount: prevState.visitingNodesCount - 1
                }));
            } else {
                // Graph mode - update graph nodes
                this.setState(prevState => ({
                    graphNodes: prevState.graphNodes.map(n => 
                        n.id === node.id ? {...n, isVisiting: true} : n
                    ),
                    visitingNodesCount: prevState.visitingNodesCount - 1
                }));
            }
        }, delay);
    };

    // Check if all visiting animations are complete
    checkVisitingComplete = (path) => {
        const checkInterval = setInterval(() => {
            if (this.state.visitingNodesCount === 0) {
                clearInterval(checkInterval);
                // Wait a moment for any final animations to settle
                setTimeout(() => {
                    this.visualizePath(path);
                    this.setState({ isAlgorithmRunning: false });
                }, 200);
            }
        }, 50); // Check every 50ms
    };

    handleAlgorithmChange = (algorithm) => {
        this.props.onAlgorithmChange(algorithm);  // Assuming this method is passed via props
        console.log(`${algorithm}`);
    };

    // Visualize the path with blue nodes
    visualizePath = (path) => {
        if (path.length === 0) {
            console.log('No path found');
            this.setState({ resultPopup: { visitedCount: (this.state.graphVisitedSet ? this.state.graphVisitedSet.size : 0), pathCost: 0, noPath: true } });
            return;
        }
        
        // Faster path visualization for better UX
        const pathDelay = 50; // Reduced delay between each path node
        
        path.forEach((node, index) => {
            setTimeout(() => {
                if (this.state.visualizationMode === 'grid') {
                    // Grid mode - update grid nodes
                    this.setState(prevState => ({
                        nodes: prevState.nodes.map(row =>
                            row.map(n => 
                                (n.row === node.row && n.col === node.col) ? 
                                {...n, isPath: true} : n
                            )
                        )
                    }));
                } else {
                    // Graph mode - update graph nodes
                    this.setState(prevState => ({
                        graphNodes: prevState.graphNodes.map(n => 
                            n.id === node.id ? {...n, isPath: true} : n
                        )
                    }));
                }
            }, pathDelay * index);
        });
        
        console.log(`Path visualized with ${path.length} nodes`);
        if (this.state.visualizationMode === 'graph') {
            // After path is visualized, show popup
            setTimeout(() => {
                const visitedCount = this.state.graphVisitedSet ? this.state.graphVisitedSet.size : 0;
                const pathCost = path.reduce((sum, node) => sum + (node.weight !== undefined ? node.weight : 1), 0);
                this.setState({ resultPopup: { visitedCount, pathCost } });
            }, path.length * 50 + 300);
        }
    };

    closeResultPopup = () => {
        this.setState({ resultPopup: null, graphVisitedSet: new Set() });
    };

    runAlgorithm = () => {
        const { startNode, finishNode, visualizationMode, graphNodes, graphEdges } = this.state;
        
        // Set algorithm as running
        this.setState({ 
            isAlgorithmRunning: true,
            visitingNodesCount: 0
        });
        
        let path = [];
        
        if (visualizationMode === 'grid') {
            // Grid mode - use existing grid algorithms
            // Clear visiting and path states before running algorithm
            this.setState(prevState => ({
                nodes: prevState.nodes.map(row =>
                    row.map(node => ({
                        ...node,
                        isVisiting: false,
                        isPath: false
                    }))
                )
            }), () => {
                const { nodes } = this.state;
                const start = nodes[startNode.row][startNode.col];
                const finish = nodes[finishNode.row][finishNode.col];
                
                // Run desired algorithm and get the path
                switch (this.props.selectedAlgorithm) {
                    case 'Dijkstra':
                        path = GridAlgorithms.Dijkstra(nodes, start, finish, this.visitNodeCallback);
                        break;
                    case 'A*':
                        path = GridAlgorithms.AStar(nodes, start, finish, this.visitNodeCallback);
                        break;
                    case 'BFS':
                        path = GridAlgorithms.Bfs(nodes, start, finish, this.visitNodeCallback);
                        break;
                    case 'DFS':
                        path = GridAlgorithms.Dfs(nodes, start, finish, this.visitNodeCallback);
                        break;
                    case 'Greedy BFS':
                        path = GridAlgorithms.GreedyBFS(nodes, start, finish, this.visitNodeCallback);
                        break;
                    default:
                        console.log('No algorithm selected or algorithm not implemented');
                        this.setState({ isAlgorithmRunning: false });
                        return;
                }
                
                // Start checking for visiting completion
                this.checkVisitingComplete(path);
            });
        } else {
            // Graph mode - use graph algorithms
            // Clear visiting and path states before running algorithm
            this.setState(prevState => ({
                graphNodes: prevState.graphNodes.map(node => ({
                    ...node,
                    isVisiting: false,
                    isPath: false
                }))
            }), () => {
                const { graphNodes } = this.state;
                const start = graphNodes.find(n => n.isStart);
                const finish = graphNodes.find(n => n.isFinish);
                
                if (!start || !finish) {
                    console.log('Start or finish node not found in graph');
                    this.setState({ isAlgorithmRunning: false });
                    return;
                }
                
                // For now, use BFS for graph mode (can be extended with other algorithms)
                switch (this.props.selectedAlgorithm) {
                    case 'BFS':
                        path = GraphAlgorithms.Bfs(graphNodes, graphEdges, start, finish, this.visitNodeCallback);
                        break;
                    case 'DFS':
                        path = GraphAlgorithms.Dfs(graphNodes, graphEdges, start, finish, this.visitNodeCallback);
                        break;
                    case 'Dijkstra':
                        path = GraphAlgorithms.Dijkstra(graphNodes, graphEdges, start, finish, this.visitNodeCallback);
                        break;
                    case 'A*':
                        path = GraphAlgorithms.AStar(graphNodes, graphEdges, start, finish, this.visitNodeCallback);
                        break;
                    case 'Greedy BFS':
                        path = GraphAlgorithms.GreedyBFS(graphNodes, graphEdges, start, finish, this.visitNodeCallback);
                        break;
                    default:
                        console.log('Algorithm not implemented for graph mode');
                        this.setState({ isAlgorithmRunning: false });
                        return;
                }
                
                // Start checking for visiting completion
                this.checkVisitingComplete(path);
            });
        }
    };

    render() {
        const {nodes, visualizationMode, graphNodes, graphEdges, path, resultPopup} = this.state;
        
        console.log('Rendering in', visualizationMode, 'mode with', 
            visualizationMode === 'grid' ? nodes.length + 'x' + (nodes[0]?.length || 0) + ' grid' : 
            graphNodes.length + ' nodes and ' + graphEdges.length + ' edges');
        
        return (
            <div className="pathfinding-container">
                {/* Render grid or graph based on mode */}
                {visualizationMode === 'grid' ? (
                    <Grid 
                        nodes={nodes}
                        onDragStart={this.handleDragStart}
                        onDragOver={this.handleDragOver}
                        onDrop={this.handleDrop}
                        onMouseDown={this.handleMouseDown}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseUp={this.handleMouseUp}
                    />
                ) : (
                    <Graph 
                        nodes={graphNodes}
                        edges={graphEdges}
                        path={path}
                        onVertexDrag={this.handleVertexDrag}
                        onVertexClick={this.handleVertexClick}
                        onAddVertex={this.handleAddVertex}
                        onVertexDelete={this.handleVertexDelete}
                        onCreateEdge={this.handleCreateEdge}
                        onEdgeDelete={this.handleEdgeDelete}
                        onVertexWeightChange={this.handleVertexWeightChange}
                    />
                )}
                {visualizationMode === 'graph' && resultPopup && (
                    <div className="result-popup-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 3000, background: 'rgba(0,0,0,0.2)' }} onClick={this.closeResultPopup}>
                        <div className="result-popup" style={{
                            position: 'absolute',
                            left: '50%',
                            top: '30%',
                            transform: 'translate(-50%, -30%)',
                            background: 'white',
                            border: '2px solid #007bff',
                            borderRadius: '10px',
                            padding: '32px',
                            zIndex: 3100,
                            minWidth: '260px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            textAlign: 'center'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '16px' }}>Pathfinding Result</div>
                            {resultPopup.noPath ? (
                                <div style={{ color: '#dc3545', marginBottom: '12px' }}>No path found.</div>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '10px' }}>Vertices visited: <b>{resultPopup.visitedCount}</b></div>
                                    <div style={{ marginBottom: '18px' }}>Optimal path cost: <b>{resultPopup.pathCost}</b></div>
                                </>
                            )}
                            <button onClick={this.closeResultPopup} style={{ padding: '8px 20px', borderRadius: '6px', background: '#007bff', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };
}
