import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
    render() {
        // Extracting necessary props
        const { isStart, isFinish, isVisiting, onDragStart, onDragOver, onDrop, isWall } = this.props;

        // Determining additional class names based on the node's state
        const extraClassName = isFinish ? 'node-finish' :
                               isStart ? 'node-start' :
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
             ></div>
         );
    }
}
