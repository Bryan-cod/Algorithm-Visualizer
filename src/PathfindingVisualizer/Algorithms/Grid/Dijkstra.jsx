const dijkstra = (grid, startNode, finishNode, visitNodeCallback) => {
    const distances = new Map(); // Track distances from start to each node
    const previous = new Map(); // Track previous node for path reconstruction
    const unvisited = new Set(); // Set of unvisited nodes
    let delay = 0;
    const delayIncrement = 10;
    let pathFound = false;

    // Initialize distances and unvisited set
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const node = grid[row][col];
            const key = `${row},${col}`;
            distances.set(key, Infinity);
            unvisited.add(key);
        }
    }

    // Set start node distance to 0
    const startKey = `${startNode.row},${startNode.col}`;
    distances.set(startKey, 0);
    visitNodeCallback(startNode, delay);

    while (unvisited.size > 0 && !pathFound) {
        // Find node with minimum distance
        let minDistance = Infinity;
        let currentNode = null;
        let currentKey = null;

        for (const key of unvisited) {
            const distance = distances.get(key);
            if (distance < minDistance) {
                minDistance = distance;
                currentKey = key;
            }
        }

        // If no reachable nodes found, break
        if (minDistance === Infinity) {
            break;
        }

        // Get current node
        const [row, col] = currentKey.split(',').map(Number);
        currentNode = grid[row][col];
        unvisited.delete(currentKey);
        delay += delayIncrement;

        // Check if we reached the finish node
        if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
            console.log('Finish node reached!');
            pathFound = true;
            break;
        }

        // Explore neighbors
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // eslint-disable-next-line no-loop-func
        directions.forEach(([dRow, dCol]) => {
            const newRow = currentNode.row + dRow;
            const newCol = currentNode.col + dCol;

            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
                const neighbor = grid[newRow][newCol];
                const neighborKey = `${newRow},${newCol}`;

                // Skip if neighbor is not in unvisited set or is a wall
                if (!unvisited.has(neighborKey) || neighbor.isWall) {
                    return;
                }

                // Calculate new distance (all edges have weight 1 for simplicity)
                const newDistance = distances.get(currentKey) + 1;

                // If new path is shorter, update distance and previous
                if (newDistance < distances.get(neighborKey)) {
                    distances.set(neighborKey, newDistance);
                    previous.set(neighborKey, currentKey);
                    visitNodeCallback(neighbor, delay);
                }
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
            currentKey = previous.get(currentKey);
        }
        
        if (currentKey === startKey) {
            path.unshift(startNode); // Add start node
        }
        
        return path;
    }
    
    return []; // Return empty path if no path found
};

export default dijkstra; 