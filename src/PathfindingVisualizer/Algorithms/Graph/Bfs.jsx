const graphBFS = (nodes, edges, startNode, finishNode, visitNodeCallback) => {
    const queue = [];
    const visited = new Set();
    const parentMap = new Map(); // Track parent nodes for path reconstruction
    let delay = 0;
    const delayIncrement = 10;
    let pathFound = false;

    // Create adjacency list
    const adjacencyList = new Map();
    nodes.forEach(node => {
        adjacencyList.set(node.id, []);
    });
    
    edges.forEach(edge => {
        adjacencyList.get(edge.from).push(edge.to);
        adjacencyList.get(edge.to).push(edge.from); // Undirected graph
    });

    queue.push(startNode);
    visited.add(startNode.id);
    visitNodeCallback(startNode, delay);

    while (queue.length > 0 && !pathFound) {
        const currentNode = queue.shift();
        delay += delayIncrement;

        // Check if we reached the finish node
        if (currentNode.id === finishNode.id) {
            console.log('Finish node reached!');
            pathFound = true;
            break;
        }

        // Get neighbors from adjacency list
        const neighbors = adjacencyList.get(currentNode.id) || [];
        
        neighbors.forEach(neighborId => {
            if (!visited.has(neighborId)) {
                const neighbor = nodes.find(n => n.id === neighborId);
                
                // Skip wall nodes
                if (neighbor.isWall) {
                    return;
                }
                
                visited.add(neighborId);
                parentMap.set(neighborId, currentNode);
                queue.push(neighbor);
                visitNodeCallback(neighbor, delay);
                
                // Check if this neighbor is the finish node
                if (neighbor.id === finishNode.id) {
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
        
        while (currentNode && currentNode.id !== startNode.id) {
            path.unshift(currentNode);
            currentNode = parentMap.get(currentNode.id);
        }
        
        if (currentNode) {
            path.unshift(currentNode); // Add start node
        }
        
        return path;
    }
    
    return []; // Return empty path if no path found
};

export default graphBFS; 