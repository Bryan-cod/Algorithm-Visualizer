const graphDFS = (nodes, edges, startNode, finishNode, visitNodeCallback) => {
    const stack = [];
    const visited = new Set();
    const parentMap = new Map();
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
        adjacencyList.get(edge.to).push(edge.from);
    });

    stack.push(startNode);
    visited.add(startNode.id);
    visitNodeCallback(startNode, delay);

    while (stack.length > 0 && !pathFound) {
        const currentNode = stack.pop();
        delay += delayIncrement;

        if (currentNode.id === finishNode.id) {
            pathFound = true;
            break;
        }

        const neighbors = adjacencyList.get(currentNode.id) || [];
        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                const neighbor = nodes.find(n => n.id === neighborId);
                if (neighbor.isWall) continue;
                visited.add(neighborId);
                parentMap.set(neighborId, currentNode);
                stack.push(neighbor);
                visitNodeCallback(neighbor, delay);
                if (neighbor.id === finishNode.id) {
                    pathFound = true;
                    break;
                }
            }
        }
    }

    // Reconstruct the path if found
    if (pathFound) {
        const path = [];
        let currentNode = finishNode;
        while (currentNode && currentNode.id !== startNode.id) {
            path.unshift(currentNode);
            currentNode = parentMap.get(currentNode.id);
        }
        if (currentNode) path.unshift(currentNode);
        return path;
    }
    return [];
};

export default graphDFS; 