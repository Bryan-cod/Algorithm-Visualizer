// Heuristic function: Manhattan distance
const heuristic = (nodeA, nodeB) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

const greedyBFS = (grid, startNode, finishNode, visitNodeCallback) => {
    const queue = []; // Priority queue (using array for simplicity)
    const visited = new Set();
    const parentMap = new Map(); // Track parent nodes for path reconstruction
    let delay = 0;
    const delayIncrement = 10;
    let pathFound = false;

    // Add start node to queue with priority based on heuristic
    queue.push({
        node: startNode,
        priority: heuristic(startNode, finishNode)
    });
    visited.add(`${startNode.row},${startNode.col}`);
    visitNodeCallback(startNode, delay);

    while (queue.length > 0 && !pathFound) {
        // Sort queue by priority (heuristic value) - lowest first
        queue.sort((a, b) => a.priority - b.priority);
        
        const current = queue.shift();
        const currentNode = current.node;
        delay += delayIncrement;

        // Check if we reached the finish node
        if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
            console.log('Finish node reached!');
            pathFound = true;
            break;
        }

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // eslint-disable-next-line no-loop-func
        directions.forEach(([dRow, dCol]) => {
            const newRow = currentNode.row + dRow;
            const newCol = currentNode.col + dCol;

            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && !visited.has(`${newRow},${newCol}`)) {
                const newNode = grid[newRow][newCol];
                
                // Skip wall nodes
                if (newNode.isWall) {
                    return;
                }
                
                visited.add(`${newRow},${newCol}`);
                parentMap.set(`${newRow},${newCol}`, currentNode);
                
                // Add to queue with priority based on heuristic
                queue.push({
                    node: newNode,
                    priority: heuristic(newNode, finishNode)
                });
                
                visitNodeCallback(newNode, delay);
            }
        });
    }

    // Reconstruct the path if found
    if (pathFound) {
        const path = [];
        let currentNode = finishNode;
        
        while (currentNode && (currentNode.row !== startNode.row || currentNode.col !== startNode.col)) {
            path.unshift(currentNode);
            const parentKey = `${currentNode.row},${currentNode.col}`;
            currentNode = parentMap.get(parentKey);
        }
        
        if (currentNode) {
            path.unshift(currentNode); // Add start node
        }
        
        return path;
    }
    
    return []; // Return empty path if no path found
};

export default greedyBFS; 