import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
    render() {
        // Extracting necessary props
        const { isStart, isFinish, isVisiting, isWall, isPath, onDragStart, onDragOver, onDrop, onMouseDown, onMouseEnter, onMouseUp } = this.props;

        // Determining additional class names based on the node's state
        const extraClassName = isFinish ? 'node-finish' :
                               isStart ? 'node-start' :
                               isPath ? 'node-path' :
                               isVisiting ? 'node-visiting' :
                               isWall ? 'node-wall' : '';

         // Make node draggable if it is the start or finish node
         const draggable = isStart || isFinish;

         return (
             <div
                 className={`node ${extraClassName}`}
                 draggable={draggable}
                 onDragStart={draggable ? onDragStart : undefined}
                 onDragOver={onDragOver}
                 onDrop={onDrop}
                 onMouseDown={onMouseDown}
                 onMouseEnter={onMouseEnter}
                 onMouseUp={onMouseUp}
             ></div>
         );
    }
}
