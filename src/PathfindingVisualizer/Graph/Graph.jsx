import React, { Component } from 'react';
import './Graph.css';

export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDragging: false,
            draggedVertex: null,
            dragOffset: { x: 0, y: 0 },
            showAddVertexIndicator: false,
            addVertexPosition: { x: 0, y: 0 },
            selectedVertex: null,
            isCreatingEdge: false,
            hasDragged: false, // Track if we've been dragging
            showWeightPopup: false,
            weightPopupVertexId: null,
            weightInputValue: ''
        };
    }

    handleMouseDown = (vertexId, event) => {
        // Calculate offset from the center of the vertex (30px diameter)
        const vertexSize = 30;
        const offsetX = vertexSize / 2;
        const offsetY = vertexSize / 2;
        
        this.setState({
            isDragging: true,
            draggedVertex: vertexId,
            dragOffset: { x: offsetX, y: offsetY },
            hasDragged: false // Reset drag flag
        });
    };

    handleMouseMove = (event) => {
        if (this.state.isDragging && this.state.draggedVertex !== null) {
            const rect = event.currentTarget.getBoundingClientRect();
            const newX = event.clientX - rect.left - this.state.dragOffset.x;
            const newY = event.clientY - rect.top - this.state.dragOffset.y;
            
            // Add bounds checking to keep vertices within the graph container
            const vertexSize = 30;
            const minX = 0;
            const maxX = rect.width - vertexSize;
            const minY = 0;
            const maxY = rect.height - vertexSize;
            
            const clampedX = Math.max(minX, Math.min(maxX, newX));
            const clampedY = Math.max(minY, Math.min(maxY, newY));
            
            this.setState({ hasDragged: true }); // Mark that we've been dragging
            
            this.props.onVertexDrag(this.state.draggedVertex, clampedX, clampedY);
        }
    };

    handleMouseUp = () => {
        this.setState({
            isDragging: false,
            draggedVertex: null
        });
    };

    handleVertexClick = (vertexId) => {
        // Don't handle clicks if we've been dragging
        if (this.state.hasDragged) {
            this.setState({ hasDragged: false }); // Reset the flag
            return;
        }
        
        if (this.state.isCreatingEdge) {
            // If we're in edge creation mode, select the second vertex
            if (this.state.selectedVertex && this.state.selectedVertex !== vertexId) {
                this.props.onCreateEdge(this.state.selectedVertex, vertexId);
                this.setState({
                    selectedVertex: null,
                    isCreatingEdge: false
                });
            } else if (!this.state.selectedVertex) {
                // Select the first vertex
                this.setState({
                    selectedVertex: vertexId,
                    isCreatingEdge: true
                });
            }
        } else {
            // Normal vertex click behavior
            this.props.onVertexClick(vertexId);
        }
    };

    handleVertexRightClick = (vertexId, event) => {
        event.preventDefault();
        this.props.onVertexDelete(vertexId);
    };

    handleGraphClick = (event) => {
        console.log('Graph click event:', event.target.className); // Debug log
        console.log('Event target:', event.target); // Debug log
        
        // Don't create vertices if we've been dragging
        if (this.state.hasDragged) {
            console.log('Ignoring click due to drag'); // Debug log
            this.setState({ hasDragged: false }); // Reset the flag
            return;
        }
        
        // Check if click is on the graph container or its direct children that should allow vertex creation
        const isGraphContainerClick = event.target.className === 'graph-container' || 
                                   event.target.classList.contains('graph-container') ||
                                   event.target.tagName === 'svg' ||
                                   event.target.className === 'graph-svg';
        
        if (isGraphContainerClick) {
            console.log('Valid graph container click'); // Debug log
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            console.log('Click coordinates:', x, y); // Debug log
            
            // Check if click is far enough from existing vertices
            const minDistance = 50; // Minimum distance from existing vertices
            const isFarFromVertices = this.props.nodes.every(node => {
                const distance = Math.sqrt(
                    Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
                );
                return distance > minDistance;
            });

            console.log('Is far from vertices:', isFarFromVertices); // Debug log
            console.log('Number of existing nodes:', this.props.nodes.length); // Debug log

            if (isFarFromVertices) {
                console.log('Creating new vertex at:', x, y); // Debug log
                this.props.onAddVertex(x, y);
            } else {
                console.log('Too close to existing vertices'); // Debug log
            }
        } else {
            console.log('Click not on graph container, target:', event.target.className); // Debug log
        }
    };

    handleGraphMouseMove = (event) => {
        // Show indicator for where new vertex would be placed
        if (event.target.className === 'graph-container') {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Check if position is far enough from existing vertices
            const minDistance = 50;
            const isFarFromVertices = this.props.nodes.every(node => {
                const distance = Math.sqrt(
                    Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
                );
                return distance > minDistance;
            });

            this.setState({
                showAddVertexIndicator: isFarFromVertices,
                addVertexPosition: { x, y }
            });
        } else {
            this.setState({
                showAddVertexIndicator: false
            });
        }
    };

    handleEdgeModeToggle = () => {
        console.log('Edge mode toggle clicked!'); // Debug log
        this.setState(prevState => ({
            isCreatingEdge: !prevState.isCreatingEdge,
            selectedVertex: null
        }));
    };

    handleVertexDoubleClick = (vertexId, event) => {
        event.stopPropagation();
        const vertex = this.props.nodes.find(n => n.id === vertexId);
        this.setState({
            showWeightPopup: true,
            weightPopupVertexId: vertexId,
            weightInputValue: vertex && vertex.weight !== undefined ? vertex.weight : 1
        });
    };

    handleWeightInputChange = (e) => {
        this.setState({ weightInputValue: e.target.value });
    };

    handleWeightPopupSave = () => {
        const { weightPopupVertexId, weightInputValue } = this.state;
        const newWeight = parseInt(weightInputValue, 10);
        if (!isNaN(newWeight) && newWeight > 0) {
            this.props.onVertexWeightChange(weightPopupVertexId, newWeight);
        }
        this.setState({ showWeightPopup: false, weightPopupVertexId: null, weightInputValue: '' });
    };

    handleWeightPopupCancel = () => {
        this.setState({ showWeightPopup: false, weightPopupVertexId: null, weightInputValue: '' });
    };

    render() {
        const { nodes, edges, path } = this.props;
        const { selectedVertex, isCreatingEdge, showWeightPopup, weightPopupVertexId, weightInputValue } = this.state;

        console.log('Graph rendering, isCreatingEdge:', isCreatingEdge); // Debug log
        console.log('Path received:', path); // Debug path
        console.log('Path length:', path ? path.length : 0); // Debug path length

        return (
            <div 
                className="graph-container"
                onMouseMove={(e) => {
                    this.handleMouseMove(e);
                    this.handleGraphMouseMove(e);
                }}
                onMouseUp={this.handleMouseUp}
                onClick={this.handleGraphClick}
            >
                {/* Edge creation mode indicator */}
                {isCreatingEdge && (
                    <div className="edge-mode-indicator">
                        Edge Creation Mode Active
                        <button 
                            className="cancel-edge-button"
                            onClick={this.handleEdgeModeToggle}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Edge creation toggle button */}
                <button 
                    className={`edge-toggle-button ${isCreatingEdge ? 'active' : ''}`}
                    onClick={this.handleEdgeModeToggle}
                    title="Toggle edge creation mode"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: isCreatingEdge ? '#007bff' : '#28a745',
                        color: 'white',
                        border: '3px solid white',
                        cursor: 'pointer',
                        fontSize: '24px',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        transition: 'all 0.3s ease',
                        fontWeight: 'bold'
                    }}
                >
                    {isCreatingEdge ? '✕' : '🔗'}
                </button>

                {/* Graph mode instructions */}
                <div 
                    className="graph-instructions"
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 1000,
                        maxWidth: '220px',
                        pointerEvents: 'auto'
                    }}
                >
                    <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Graph Mode:</div>
                    <div>• Click 🔗 to create edges</div>
                    <div>• Right-click edges to delete</div>
                    <div>• Click vertices to toggle walls</div>
                    <div>• Right-click vertices to delete</div>
                    <div>• Drag to move vertices</div>
                </div>

                {/* Render edges */}
                <svg className="graph-svg">
                    {edges.map((edge, index) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        
                        if (!fromNode || !toNode) return null;

                        // Check if this edge is part of the path by checking if both connected nodes are path nodes
                        const isPathEdge = fromNode.isPath && toNode.isPath;

                        // Debug path edge detection
                        if (isPathEdge) {
                            console.log('Path edge found:', edge.from, '->', edge.to);
                        }

                        const handleEdgeDelete = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Edge deletion triggered:', edge.from, '->', edge.to);
                            this.props.onEdgeDelete(edge.from, edge.to);
                        };

                        return (
                            <g key={index}>
                                <line
                                    x1={fromNode.x + 15}
                                    y1={fromNode.y + 15}
                                    x2={toNode.x + 15}
                                    y2={toNode.y + 15}
                                    className={`graph-edge ${isPathEdge ? 'path-edge' : ''}`}
                                    strokeWidth={isPathEdge ? 3 : 2}
                                    onContextMenu={handleEdgeDelete}
                                    style={{ cursor: 'pointer' }}
                                />
                                {/* Invisible wider line for easier clicking */}
                                <line
                                    x1={fromNode.x + 15}
                                    y1={fromNode.y + 15}
                                    x2={toNode.x + 15}
                                    y2={toNode.y + 15}
                                    stroke="transparent"
                                    strokeWidth="12"
                                    onContextMenu={handleEdgeDelete}
                                    style={{ cursor: 'pointer', pointerEvents: 'all' }}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Add vertex indicator */}
                {this.state.showAddVertexIndicator && (
                    <div
                        className="add-vertex-indicator"
                        style={{
                            left: this.state.addVertexPosition.x - 15,
                            top: this.state.addVertexPosition.y - 15
                        }}
                    >
                        +
                    </div>
                )}

                {/* Render vertices */}
                {nodes.map(node => {
                    const isPathNode = node.isPath;
                    const isSelected = selectedVertex === node.id;
                    
                    // Debug path vertex detection
                    if (isPathNode) {
                        console.log('Path vertex found:', node.id);
                    }
                    
                    return (
                        <div
                            key={node.id}
                            className={`graph-vertex ${node.isStart ? 'start-vertex' : ''} 
                                      ${node.isFinish ? 'finish-vertex' : ''} 
                                      ${node.isVisiting ? 'visiting-vertex' : ''} 
                                      ${node.isWall ? 'wall-vertex' : ''} 
                                      ${isPathNode ? 'path-vertex' : ''}
                                      ${isSelected ? 'selected-vertex' : ''}`}
                            style={{
                                left: node.x,
                                top: node.y,
                                cursor: this.state.isDragging ? 'grabbing' : 'grab',
                                zIndex: showWeightPopup && weightPopupVertexId === node.id ? 1100 : 10
                            }}
                            onMouseDown={(e) => this.handleMouseDown(node.id, e)}
                            onClick={() => this.handleVertexClick(node.id)}
                            onDoubleClick={(e) => this.handleVertexDoubleClick(node.id, e)}
                            onContextMenu={(e) => this.handleVertexRightClick(node.id, e)}
                        >
                            <span style={{ fontWeight: 'bold' }}>{node.id}</span>
                            <span style={{ fontSize: '10px', display: 'block' }}>w:{node.weight !== undefined ? node.weight : 1}</span>
                        </div>
                    );
                })}

                {/* Weight Edit Popup */}
                {showWeightPopup && (
                    <div className="weight-popup-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(0,0,0,0.2)' }} onClick={this.handleWeightPopupCancel}>
                        <div className="weight-popup" style={{
                            position: 'absolute',
                            left: nodes.find(n => n.id === weightPopupVertexId)?.x + 40 || 100,
                            top: nodes.find(n => n.id === weightPopupVertexId)?.y || 100,
                            background: 'white',
                            border: '2px solid #007bff',
                            borderRadius: '8px',
                            padding: '16px',
                            zIndex: 2100,
                            minWidth: '120px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Edit Vertex Weight</div>
                            <input type="number" min="1" value={weightInputValue} onChange={this.handleWeightInputChange} style={{ width: '60px', marginRight: '8px' }} />
                            <button onClick={this.handleWeightPopupSave} style={{ marginRight: '6px' }}>Save</button>
                            <button onClick={this.handleWeightPopupCancel}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}