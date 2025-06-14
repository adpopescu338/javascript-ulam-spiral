import React from 'react';
import type { CellProps } from './types';
import { Menu, MenuButton } from '@szhsin/react-menu';
import { toast } from 'react-toastify';

export const Cell: React.FC<{
  cell: CellProps;
  displayNumber: boolean;
}> = ({ cell, displayNumber }) => {
  return (
    <Menu
      menuButton={
        <MenuButton
          className="spiral-cell"
          style={{
            ...(cell.bgColors.length > 0 && {
              background: `linear-gradient(${cell.bgColors.join(', ')})`,
            }),

            gridRowStart: String(cell.row + 1),
            gridColumnStart: String(cell.col + 1),
          }}
        >
          {displayNumber ? cell.n : ''}
        </MenuButton>
      }
    >
      <CellDetails cell={cell} />
    </Menu>
  );
};

const NumberWithCopy: React.FC<{
  n: number;
}> = ({ n }) => {
  const copyToClipboard = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation(); // Prevent the menu from closing
    e.preventDefault(); // Prevent default behavior
    navigator.clipboard.writeText(String(n));

    toast.success(`Copied ${n} to clipboard!`, {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <span onClick={copyToClipboard} className="number-with-copy">
      {n}
    </span>
  );
};

const CellDetails: React.FC<{
  cell: CellProps;
}> = ({ cell }) => {
  return (
    <div className="cellDetails">
      <h5>
        Details for <NumberWithCopy n={cell.n} />:
      </h5>

      {cell.prime && <p>This number is prime.</p>}
      {cell.mults.length > 0 && (
        <div>
          <h4>Multiple of:</h4>
          <ul>
            {cell.mults.map((m) => (
              <li key={m.n} className="list-style-none">
                <span style={{ color: m.colorHex }}>•</span>{' '}
                <NumberWithCopy n={m.n} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {cell.remainders.length > 0 && (
        <div>
          <h4>Remainder matches:</h4>
          <ul>
            {cell.remainders.map((r) => (
              <li key={r.n} className="list-style-none">
                <span style={{ color: r.colorHex }}>•</span>{' '}
                <NumberWithCopy n={r.n} /> (remainder:{' '}
                <NumberWithCopy n={r.remainder} />)
              </li>
            ))}
          </ul>
        </div>
      )}
      {cell.isPerfectSquare && <p>This number is a perfect square.</p>}
    </div>
  );
};
