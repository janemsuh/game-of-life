import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import { ACHIMS_P144, ANVIL } from './presets';
import styled from 'styled-components';
import './App.css';

function App() {
  const numRows = 25;
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
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => (Math.random() > 0.75 ? 1 : 0)));
    }
    setGrid(rows);
    setNumGens(1);
  }

  function drawPreset1() {
    setGrid(ACHIMS_P144);
    setNumGens(1);
  }

  function drawPreset2() {
    setGrid(ANVIL);
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
      <Controls>
        <Generation>Generation: {numGens}</Generation>
        <Run>
          <button onClick={toggleRunning}>{running ? 'Stop' : 'Play'}</button>
          <button onClick={() => {
              setGrid(drawEmptyGrid());
              setNumGens(1);
            }}>Clear
          </button>
        </Run>
        <Patterns>
          <button onClick={drawRandomGrid}>Random</button>
          <button onClick={drawPreset1}>Achim's P144</button>
          <button onClick={drawPreset2}>Anvil</button>
        </Patterns>
      </Controls>
      <div style={{ display: 'flex' }}>
        <div style={{ flexDirection: 'column' }}>
          <h2>Game Rules</h2>
          <ul style={{ textAlign: 'left' }}>
            <Li>Each cell is either alive or dead.</Li>
            <Li>Any live cell with fewer than two or greater than three live neighbors dies.</Li>
            <Li>Any live cell with two or three live neighbors survives to the next generation.</Li>
            <Li>Any dead cell with three live neighbors becomes a live cell in the next generation.</Li>
          </ul>
        </div>
        <div className='board'
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
            gridTemplateRows: `repeat(${numRows}, 20px)`,
            marginRight: '10%'
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
      {/* <p>text placeholder...</p> */}
    </div>
  )
}
export default App;

const Li = styled.li`
  margin: 1.2em;
`
const Controls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-left: 25%;
  margin-right: 25%;
  margin-bottom: 1%;
  // border: 1px solid red;
  padding-left: 10%;
`

const Run = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  width: 20%;
  // background: yellow;
  // border: 1px dashed green;
`

const Patterns = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  width: 40%;
  // background: pink;
  // border: 1px solid purple;
`

const Generation = styled.div`
  font-size: 18px;
`