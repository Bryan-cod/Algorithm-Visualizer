const graphDijkstra = (nodes, edges, startNode, finishNode, visitNodeCallback) => {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    let delay = 0;
    const delayIncrement = 10;
    let pathFound = false;

    // Create adjacency list
    const adjacencyList = new Map();
    nodes.forEach(node => {
        adjacencyList.set(node.id, []);
        distances.set(node.id, Infinity);
        unvisited.add(node.id);
    });
    edges.forEach(edge => {
        adjacencyList.get(edge.from).push(edge.to);
        adjacencyList.get(edge.to).push(edge.from);
    });

    distances.set(startNode.id, 0);
    visitNodeCallback(startNode, delay);

    while (unvisited.size > 0 && !pathFound) {
        // Find node with minimum distance
        let minDistance = Infinity;
        let currentId = null;
        for (const id of unvisited) {
            const dist = distances.get(id);
            if (dist < minDistance) {
                minDistance = dist;
                currentId = id;
            }
        }
        if (currentId === null || minDistance === Infinity) break;
        const currentNode = nodes.find(n => n.id === currentId);
        unvisited.delete(currentId);
        delay += delayIncrement;

        if (currentId === finishNode.id) {
            pathFound = true;
            break;
        }

        const neighbors = adjacencyList.get(currentId) || [];
        for (const neighborId of neighbors) {
            if (!unvisited.has(neighborId)) continue;
            const neighbor = nodes.find(n => n.id === neighborId);
            if (neighbor.isWall) continue;
            // Use vertex weight as cost to enter neighbor
            const neighborWeight = neighbor.weight !== undefined ? neighbor.weight : 1;
            const alt = distances.get(currentId) + neighborWeight;
            if (alt < distances.get(neighborId)) {
                distances.set(neighborId, alt);
                previous.set(neighborId, currentId);
                visitNodeCallback(neighbor, delay);
            }
        }
    }

    // Reconstruct the path if found
    if (pathFound) {
        const path = [];
        let currentId = finishNode.id;
        while (currentId && currentId !== startNode.id) {
            const node = nodes.find(n => n.id === currentId);
            path.unshift(node);
            currentId = previous.get(currentId);
        }
        if (currentId === startNode.id) {
            path.unshift(startNode);
        }
        return path;
    }
    return [];
};

export default graphDijkstra; 