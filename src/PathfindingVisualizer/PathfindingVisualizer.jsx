import React, {Component} from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: []
        };
    }

    componentDidMount() {
        const nodes = [];
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
        } else if (type === 'finish') {
            newNodes[row][col].isFinish = false;
            newNodes[targetRow][targetCol].isFinish = true;
        }
        this.setState({ nodes: newNodes });
    };

    render() {
        const {nodes} = this.state;
        return (
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
        );
    };
}
