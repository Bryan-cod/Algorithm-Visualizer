function manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const graphAStar = (nodes, edges, startNode, finishNode, visitNodeCallback) => {
    const openSet = new Set([startNode.id]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    let delay = 0;
    const delayIncrement = 10;
    let pathFound = false;

    // Create adjacency list
    const adjacencyList = new Map();
    nodes.forEach(node => {
        adjacencyList.set(node.id, []);
        gScore.set(node.id, Infinity);
        fScore.set(node.id, Infinity);
    });
    edges.forEach(edge => {
        adjacencyList.get(edge.from).push(edge.to);
        adjacencyList.get(edge.to).push(edge.from);
    });

    gScore.set(startNode.id, 0);
    fScore.set(startNode.id, manhattan(startNode, finishNode));
    visitNodeCallback(startNode, delay);

    while (openSet.size > 0 && !pathFound) {
        // Find node in openSet with lowest fScore
        let currentId = null;
        let minF = Infinity;
        for (const id of openSet) {
            if (fScore.get(id) < minF) {
                minF = fScore.get(id);
                currentId = id;
            }
        }
        if (currentId === null) break;
        const currentNode = nodes.find(n => n.id === currentId);
        if (currentId === finishNode.id) {
            pathFound = true;
            break;
        }
        openSet.delete(currentId);
        delay += delayIncrement;

        const neighbors = adjacencyList.get(currentId) || [];
        for (const neighborId of neighbors) {
            const neighbor = nodes.find(n => n.id === neighborId);
            if (neighbor.isWall) continue;
            // Use vertex weight as cost to enter neighbor
            const neighborWeight = neighbor.weight !== undefined ? neighbor.weight : 1;
            const tentativeG = gScore.get(currentId) + neighborWeight;
            if (tentativeG < gScore.get(neighborId)) {
                cameFrom.set(neighborId, currentId);
                gScore.set(neighborId, tentativeG);
                fScore.set(neighborId, tentativeG + manhattan(neighbor, finishNode));
                if (!openSet.has(neighborId)) {
                    openSet.add(neighborId);
                    visitNodeCallback(neighbor, delay);
                }
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
            currentId = cameFrom.get(currentId);
        }
        if (currentId === startNode.id) {
            path.unshift(startNode);
        }
        return path;
    }
    return [];
};

export default graphAStar; 