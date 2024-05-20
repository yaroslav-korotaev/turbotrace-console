export function indent(string: string, level: number): string {
  return string.replace(/^/mg, '  '.repeat(level));
}

export function join(a: string | undefined, b: string | undefined): string | undefined {
  if (a === undefined) {
    return b;
  }
  
  if (b === undefined) {
    return a;
  }
  
  return `${a} ${b}`;
}

export function name(s: string): string {
  if (s == '') {
    return '.';
  }
  
  return s;
}

export function depth(n: number): number {
  return Math.max(0, n - 1);
}
