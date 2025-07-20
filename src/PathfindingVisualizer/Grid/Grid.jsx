import React, { Component } from 'react';
import Node from '../Node/Node';
import './Grid.css';

export default class Grid extends Component {
    render() {
        const { nodes, onDragStart, onDragOver, onDrop, onMouseDown, onMouseEnter, onMouseUp } = this.props;
        
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
                                isWall={node.isWall}
                                isPath={node.isPath}
                                onDragStart={onDragStart(node)}
                                onDragOver={onDragOver}
                                onDrop={onDrop(rowIdx, nodeIdx)}
                                onMouseDown={() => onMouseDown(rowIdx, nodeIdx)}
                                onMouseEnter={() => onMouseEnter(rowIdx, nodeIdx)}
                                onMouseUp={onMouseUp}
                                draggable={node.isStart}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
} 