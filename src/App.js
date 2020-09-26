import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

function App() {
  const numRows = 30;
  const numCols = 50;
  const [grid, setGrid] = useState(drawEmptyGrid());
  const [running, setRunning] = useState(false);
  const runningRef = useRef();
  runningRef.current = running;
  const timeInterval = 50;
  const [numGens, setNumGens] = useState(1); 

  function drawEmptyGrid() {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  }

  function drawRandomGrid() {
    const rows = [];
    for (let i = 0; i < numRows; i++ ) {
      rows.push(Array.from(Array(numCols), () => (Math.random() > 0.75 ? 1 : 0)));
    }
    setGrid(rows);
    setNumGens(1);
  }

  const handleCellClick = (i, j) => {
    if (!running) {
      const newGrid = produce(grid, draftGrid => {
        if (grid[i][j] === 0) {
          draftGrid[i][j] = 1;
        }
        else {
          draftGrid[i][j] = 0;
        }
      });
      setGrid(newGrid);
    }
  };

  const toggleRunning = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runGame();
    }
  };

  const runGame = useCallback(() => {
    const neighborLocations = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [-1, -1],
      [1, 1],
      [1, -1],
    ];
    const countNeighbors = (grid, i, j) => {
      let numNeighbors = 0;
      neighborLocations.forEach(([r, c]) => {
        const newR = r + i;
        const newC = c + j;
        if (newR >= 0 && newR < numRows && newC >= 0 && newC < numCols) {
          if (grid[newR][newC] > 0) {
            numNeighbors += 1;
          }
        }
      });
      return numNeighbors;
    };
    if (!runningRef.current) {
      return;
    }
    setGrid(g => {
      return produce(g, draftGrid => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const neighbors = countNeighbors(g, i, j);
            if (neighbors < 2 || neighbors > 3) {
              draftGrid[i][j] = 0;
            }
            else if (g[i][j] === 0 && neighbors === 3) {
              draftGrid[i][j] = 1;
            }
          }
        }
      });
    });
    setNumGens(gen => gen + 1);
    setTimeout(runGame, timeInterval);
  }, []);

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <div className='controls'>
        <button onClick={toggleRunning}>{running ? 'Stop' : 'Play'}</button>
        <button onClick={() => {
            setGrid(drawEmptyGrid());
            setNumGens(1);
          }}>Clear
        </button>
        <button onClick={drawRandomGrid}>Random</button>
        <p>Generation: {numGens}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <h2>Text Placeholder...</h2>
        <div className='board'
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
            gridTemplateRows: `repeat(${numRows}, 20px)`,
            // background: 'grey',
            // border: '3px dashed purple',
          }}
        >
          {grid.map((rows, i) =>
            rows.map((cell, j) => (
              <div
                onClick={() => handleCellClick(i, j)}
                key={`cell @[${i},${j}]`}
                style={{
                  width: 18,
                  height: 18,
                  background: grid[i][j] > 0 ? '#009cde' : '#abe0f9',
                  border: '1px solid white'
                }}
              />
            ))
          )}
        </div>
      </div>
      <p>text placeholder...</p>
    </div>
  )
}
export default App;