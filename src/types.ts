export type CellProps = {
  n: number;
  row: number;
  col: number;
  prime: boolean;
  mults: Multiple[];
  remainders: ColorNumbersWhereModNEquals[];
  bgColors: string[];
  isPerfectSquare: boolean;
};

export type Multiple = {
  n: number;
  colorHex: string;
};

export type ColorNumbersWhereModNEquals = {
  n: number;
  remainder: number;
  colorHex: string;
};

export type FormState = {
  maxVal: number;
  multiples: Multiple[];
  colorNumbersWhereModNEquals: ColorNumbersWhereModNEquals[];
  colorPerfectSquares: boolean;
  perfectSquareColorHex: string;
  primesColorHex: string;
  displayNumbers: boolean;
  displayBorder: boolean;
};
