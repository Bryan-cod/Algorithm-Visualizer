const bfs = (grid, startNode, finishNode, visitNodeCallback) => {
    const queue = [];
    const visited = new Set();
    let delay = 0;
    const delayIncrement = 10;

    queue.push(startNode);
    visited.add(`${startNode.row},${startNode.col}`);
    visitNodeCallback(startNode, delay);

    while (queue.length > 0) {
        const currentNode = queue.shift();
        delay += delayIncrement;  // Increase the delay for the next node visit

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // eslint-disable-next-line no-loop-func
        directions.forEach(([dRow, dCol]) => {
            const newRow = currentNode.row + dRow;
            const newCol = currentNode.col + dCol;

            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && !visited.has(`${newRow},${newCol}`)) {
                visited.add(`${newRow},${newCol}`);
                const newNode = grid[newRow][newCol];
                queue.push(newNode);
                visitNodeCallback(newNode, delay);
            }
        });

        if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
            console.log('Finish node reached!');
            break;  // Stop the loop when finish node is found
        }
    }
};

export default bfs;
