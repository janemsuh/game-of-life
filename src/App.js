import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const numRows = 30;
  const numCols = 50;
  const [grid, setGrid] = useState(drawEmptyGrid);
  const [running, setRunning] = useState(false);
  const runningRef = useRef();
  runningRef.current = running;

  function drawEmptyGrid() {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  }

  const toggleRunning = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
    }
  };

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <div className='controls'>
        <button onClick={toggleRunning}>{running ? 'Stop' : 'Play'}</button>
        <button onClick={() => {setGrid(drawEmptyGrid())}}>Clear
        </button>
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
                key={`cell @[${i},${j}]`}
                style={{
                  width: 18,
                  height: 18,
                  background: '#abe0f9',
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