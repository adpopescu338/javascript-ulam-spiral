import { useEffect, useState } from 'react';
import type { FormState, Multiple, ColorNumbersWhereModNEquals } from './types';
import { Form } from './Form';
import { useCells } from './use-cells';
import { Cell } from './Cell';

const CELL_SIZE = 22; // px per square

export default function UlamSpiralPage() {
  const [formState, setFormState] = useState<FormState>({
    maxVal: 225,
    multiples: [] as Multiple[],
    colorNumbersWhereModNEquals: [] as ColorNumbersWhereModNEquals[],
    colorPerfectSquares: false,
    primesColorHex: 'red',
    perfectSquareColorHex: '#800080', // Default color for perfect squares
    displayNumbers: true,
  });

  const [zoom, setZoom] = useState(1); // Add zoom state

  const { cells, gridDim } = useCells(formState);

  useEffect(() => {
    // set the zoom css variable on root element
    document.documentElement.style.setProperty('--zoom-val', String(zoom));
  }, [zoom]);

  // -------- RENDER --------
  return (
    <div id="container">
      <h1 id="title">Ulam Spiral Visualizer</h1>

      {/* Zoom Controls */}
      <div id="zoom-controls">
        <button
          type="button"
          className="zoom-button"
          onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
        >
          +
        </button>
        <button
          type="button"
          className="zoom-button"
          onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
        >
          –
        </button>
        <div id="zoom-display">Zoom: {zoom.toFixed(1)}x</div>
      </div>

      {/* Controls */}
      <Form initialState={formState} onSubmit={setFormState} />

      {/* Spiral */}
      <div id="spiral-container">
        <div
          id="spiral"
          style={{
            gridTemplateColumns: `repeat(${gridDim}, ${CELL_SIZE * zoom}px)`,
            gridTemplateRows: `repeat(${gridDim}, ${CELL_SIZE * zoom}px)`,
          }}
        >
          {cells.map((c) => {
            return (
              <Cell
                key={c.n}
                cell={c}
                displayNumber={formState.displayNumbers}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
