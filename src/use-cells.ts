import { useMemo } from 'react';
import type { FormState, CellProps } from './types';
import { generateSpiral, isPrime } from './utils';

export const useCells = (formState: FormState) => {
  return useMemo(() => {
    const max = Math.max(1, Number(formState.maxVal) || 1);
    const positions = generateSpiral(max);

    const side = Math.ceil(Math.sqrt(max));
    const gridDim = side % 2 === 0 ? side + 1 : side; // smallest odd grid side length
    const centre = (gridDim - 1) / 2;

    const cells: CellProps[] = [];
    for (let n = 1; n <= max; n++) {
      const { x, y } = positions[n];
      const row = centre + y;
      const col = centre + x;

      const mults = formState.multiples
        .filter((m) => {
          return n > 0 && n % m.n === 0;
        })
        .map((m) => ({
          n: m.n,
          colorHex: m.colorHex,
        }));

      const remainders = formState.colorNumbersWhereModNEquals
        .filter((c) => n > 0 && n % c.n === c.remainder)
        .map((c) => ({
          n: c.n,
          colorHex: c.colorHex,
          remainder: c.remainder,
        }));

      const prime = isPrime(n);

      let bgColors: string[] = [];

      if (prime) {
        bgColors.push(formState.primesColorHex);
      }

      const isPerfectSquare = Number.isInteger(Math.sqrt(n));

      if (formState.colorPerfectSquares && isPerfectSquare) {
        bgColors.push(formState.perfectSquareColorHex);
      }

      if (mults.length > 0) {
        bgColors = bgColors.concat(mults.map((m) => m.colorHex));
      }

      if (remainders.length > 0) {
        bgColors = bgColors.concat(remainders.map((r) => r.colorHex));
      }

      cells.push({
        n,
        row,
        col,
        prime: isPrime(n),
        mults,
        remainders,
        bgColors,
        isPerfectSquare,
      });
    }
    return { cells, gridDim };
  }, [formState]);
};
