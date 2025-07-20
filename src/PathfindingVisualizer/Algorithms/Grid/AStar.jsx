// Heuristic function: Manhattan distance
const heuristic = (nodeA, nodeB) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

const aStar = (grid, startNode, finishNode, visitNodeCallback) => {
    const openSet = new Set(); // Nodes to be evaluated
    const closedSet = new Set(); // Nodes already evaluated
    const cameFrom = new Map(); // Track the most efficient path
    const gScore = new Map(); // Cost from start to node
    const fScore = new Map(); // Total cost from start to goal through node
    let delay = 0;
    const delayIncrement = 10;
    let pathFound = false;

    // Initialize
    const startKey = `${startNode.row},${startNode.col}`;
    openSet.add(startKey);
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(startNode, finishNode));
    visitNodeCallback(startNode, delay);

    while (openSet.size > 0 && !pathFound) {
        // Find node with lowest fScore
        let currentKey = null;
        let lowestFScore = Infinity;

        for (const key of openSet) {
            const f = fScore.get(key) || Infinity;
            if (f < lowestFScore) {
                lowestFScore = f;
                currentKey = key;
            }
        }

        if (!currentKey) break;

        const [row, col] = currentKey.split(',').map(Number);
        const currentNode = grid[row][col];

        // Check if we reached the finish node
        if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
            console.log('Finish node reached!');
            pathFound = true;
            break;
        }

        openSet.delete(currentKey);
        closedSet.add(currentKey);
        delay += delayIncrement;

        // Explore neighbors
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // eslint-disable-next-line no-loop-func
        directions.forEach(([dRow, dCol]) => {
            const newRow = currentNode.row + dRow;
            const newCol = currentNode.col + dCol;

            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
                const neighbor = grid[newRow][newCol];
                const neighborKey = `${newRow},${newCol}`;

                // Skip if neighbor is in closed set or is a wall
                if (closedSet.has(neighborKey) || neighbor.isWall) {
                    return;
                }

                // Calculate tentative gScore
                const tentativeGScore = gScore.get(currentKey) + 1; // Edge weight is 1

                // If neighbor is not in open set, add it
                if (!openSet.has(neighborKey)) {
                    openSet.add(neighborKey);
                } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
                    // This path is not better, skip
                    return;
                }

                // This path is the best until now, record it
                cameFrom.set(neighborKey, currentKey);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, finishNode));
                visitNodeCallback(neighbor, delay);
            }
        });
    }

    // Reconstruct the path if found
    if (pathFound) {
        const path = [];
        let currentKey = `${finishNode.row},${finishNode.col}`;
        
        while (currentKey && currentKey !== startKey) {
            const [row, col] = currentKey.split(',').map(Number);
            path.unshift(grid[row][col]);
            currentKey = cameFrom.get(currentKey);
        }
        
        if (currentKey === startKey) {
            path.unshift(startNode); // Add start node
        }
        
        return path;
    }
    
    return []; // Return empty path if no path found
};

export default aStar; 