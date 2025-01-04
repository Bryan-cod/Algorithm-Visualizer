const dfs = (grid, startNode, finishNode, visitNodeCallback) => {
    const stack = [];
    const visited = new Set();
    let delay = 0;
    const delayIncrement = 10;

    stack.push(startNode);
    visited.add(`${startNode.row},${startNode.col}`);
    visitNodeCallback(startNode, delay);

    while (stack.length > 0) {
        const currentNode = stack.pop();
        delay += delayIncrement;  // Increase the delay for the next node visit
        if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
            console.log('Finish node reached!');
            break;  // Stop the loop when finish node is found
        }
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // eslint-disable-next-line no-loop-func
        directions.forEach(([dRow, dCol]) => {
            const newRow = currentNode.row + dRow;
            const newCol = currentNode.col + dCol;

            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && !visited.has(`${newRow},${newCol}`)) {
                visited.add(`${newRow},${newCol}`);
                const newNode = grid[newRow][newCol];
                stack.push(newNode);
                visitNodeCallback(newNode, delay);
            }
        });

    }
};

export default dfs;
