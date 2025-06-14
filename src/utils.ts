// -------- HELPERS ---------
export function isPrime(n: number) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

/**
 * Generate positions (x,y) for 1..max in an Ulam spiral.
 * (0,0) is centre. +x = right, –y = up  (CSS grid rows grow downward in CSS).
 */
export function generateSpiral(max: number) {
  const pos = new Array(max + 1);
  let x = 0,
    y = 0,
    step = 1,
    n = 1;
  pos[1] = { x: 0, y: 0 };

  while (n < max) {
    // → right
    for (let i = 0; i < step && n < max; i++) pos[++n] = { x: ++x, y };
    // ↑ up
    for (let i = 0; i < step && n < max; i++) pos[++n] = { x, y: --y };
    step++;
    // ← left
    for (let i = 0; i < step && n < max; i++) pos[++n] = { x: --x, y };
    // ↓ down
    for (let i = 0; i < step && n < max; i++) pos[++n] = { x, y: ++y };
    step++;
  }
  return pos;
}
