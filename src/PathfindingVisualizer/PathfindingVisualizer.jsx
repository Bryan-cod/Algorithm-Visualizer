import React, {Component} from 'react';
import Node from './Node/Node';
import bfs from './Algorithms/Bfs';
import dfs from './Algorithms/Dfs';

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
            nodes: []  
        };
    }

    clearGrid = (nodes) => {
        const { startNode, finishNode } = this.state;
        for (let row = 0; row < 25; row++) {
            const currentRow = [];
            for (let col = 0; col < 25; col++) {
                currentRow.push({
                    col,
                    row,
                    isStart: row === startNode.row && col === startNode.col,
                    isFinish: row === finishNode.row && col === finishNode.col, 
                    isVisiting: false
                });
            }
            nodes.push(currentRow);
        }
        this.setState({nodes});
    }

    componentDidMount() {
        const nodes = [];
        const width = window.innerWidth;
        const height = window.innerHeight;
        console.log(`(height, width) = (${height}, ${width})`);
        for (let row = 0; row < 25; row++) {
            const currentRow = [];
            for (let col = 0; col < 25; col++) {
                currentRow.push({
                    col,
                    row,
                    isStart: row === 10 && col === 10, // Example start node
                    isFinish: row === 20 && col === 20, // Example finish node
                    isVisiting: false
                });
            }
            nodes.push(currentRow);
        }
        this.setState({nodes});
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
        setTimeout(() => {
            this.setState(prevState => ({
                nodes: prevState.nodes.map(row =>
                    row.map(n => (n.row === node.row && n.col === node.col) ? {...n, isVisiting: true} : n)
                )
            }));
        }, delay);
    };

    runAlgorithm = () => {
        const { startNode, finishNode } = this.state;
        let nodes = [];
        // Clear the grid before the algorithm starts
        this.clearGrid(nodes);
        const start = nodes[startNode.row][startNode.col];
        const finish = nodes[finishNode.row][finishNode.col];
        // Run desired algorithm
        bfs(nodes, start, finish, this.visitNodeCallback);
    };

    render() {
        const {nodes} = this.state;
        return (
            <div>
                <button onClick={this.runAlgorithm}>Run Dijkstra</button>
            <div className="grid">
                {nodes.map((row, rowIdx) => (
                    <div key={rowIdx} style={{ display: 'flex' }}>
                        {row.map((node, nodeIdx) => (
                            <Node
                            key={nodeIdx}
                            isStart={node.isStart}
                            isFinish={node.isFinish}
                            isVisiting={node.isVisiting}
                            onDragStart={this.handleDragStart(node)}
                            onDragOver={this.handleDragOver}
                            onDrop={this.handleDrop(rowIdx, nodeIdx)}
                            draggable={node.isStart}
                        />
                        ))}
                    </div>
                ))}
            </div>
        </div>
        );
    };
}
