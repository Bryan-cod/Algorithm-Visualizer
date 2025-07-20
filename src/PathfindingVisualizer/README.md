# Pathfinding Visualizer

A React-based algorithm visualizer that supports both grid-based and graph-based pathfinding algorithms.

## Directory Structure

```
PathfindingVisualizer/
├── Algorithms/
│   ├── Grid/           # Grid-based algorithms
│   │   ├── Bfs.jsx
│   │   ├── Dfs.jsx
│   │   ├── Dijkstra.jsx
│   │   ├── AStar.jsx
│   │   ├── GreedyBFS.jsx
│   │   └── index.js
│   └── Graph/          # Graph-based algorithms
│       ├── Bfs.jsx
│       └── index.js
├── Grid/               # Grid visualization component
│   ├── Grid.jsx
│   └── Grid.css
├── Graph/              # Graph visualization component
│   ├── Graph.jsx
│   └── Graph.css
├── Node/               # Individual node component
│   ├── Node.jsx
│   └── Node.css
├── Navbar/             # Navigation and controls
│   ├── Navbar.jsx
│   └── Navbar.css
├── PathfindingVisualizer.jsx  # Main component
├── PathfindingVisualizer.css
└── README.md
```

## Features

### Grid Mode
- 25x25 dynamic grid that adapts to window size
- Draggable start and finish nodes
- Click and drag to create/remove walls
- Supported algorithms: BFS, DFS, Dijkstra, A*, Greedy BFS

### Graph Mode
- Interactive graph with draggable vertices
- Click to add vertices, drag to move them
- Automatic edge creation between nearby vertices
- Currently supports BFS (other algorithms can be added)

### Visualization Features
- Real-time algorithm execution with animations
- Path highlighting in blue
- Wall counter display
- Debug information showing algorithm status
- Responsive design for different screen sizes

## Usage

1. Select visualization mode (Grid or Graph)
2. Choose an algorithm from the dropdown
3. For Grid mode: Drag start/finish nodes, click/drag to create walls
4. For Graph mode: Click to add vertices, drag to move them
5. Click "Run Algorithm" to start visualization
6. Use "Reset Grid" to clear the visualization

## Algorithm Implementations

### Grid Algorithms
- **BFS**: Breadth-first search using queue
- **DFS**: Depth-first search using stack
- **Dijkstra**: Shortest path with uniform edge weights
- **A***: A* search with Manhattan distance heuristic
- **Greedy BFS**: Best-first search using heuristic only

### Graph Algorithms
- **BFS**: Breadth-first search on adjacency list representation

## Technical Details

- Built with React and CSS
- Responsive design with media queries
- Modular component architecture
- Separated concerns between grid and graph modes
- Clean algorithm organization with index files for easy imports 