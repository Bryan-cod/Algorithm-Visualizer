const bfs = (grid, startNode, finishNode, visitNodeCallback) => {
    const queue = [];
    const visited = new Set();
    const parentMap = new Map(); // Track parent nodes for path reconstruction
    let delay = 0;
    const delayIncrement = 10;
    let pathFound = false;

    queue.push(startNode);
    visited.add(`${startNode.row},${startNode.col}`);
    visitNodeCallback(startNode, delay);

    while (queue.length > 0 && !pathFound) {
        const currentNode = queue.shift();
        delay += delayIncrement;  // Increase the delay for the next node visit

        // Check if current node is finish node
        if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
            console.log('Finish node reached!');
            pathFound = true;
            break;  // Stop the loop when finish node is found
        }

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // eslint-disable-next-line no-loop-func
        directions.forEach(([dRow, dCol]) => {
            if (pathFound) return; // Skip if path already found
            
            const newRow = currentNode.row + dRow;
            const newCol = currentNode.col + dCol;

            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && !visited.has(`${newRow},${newCol}`)) {
                const newNode = grid[newRow][newCol];
                
                // Skip wall nodes
                if (newNode.isWall) {
                    return;
                }
                
                visited.add(`${newRow},${newCol}`);
                parentMap.set(`${newRow},${newCol}`, currentNode); // Store parent for path reconstruction
                queue.push(newNode);
                visitNodeCallback(newNode, delay);
                
                // Check if this new node is the finish node
                if (newNode.row === finishNode.row && newNode.col === finishNode.col) {
                    console.log('Finish node reached!');
                    pathFound = true;
                }
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

export default bfs; 