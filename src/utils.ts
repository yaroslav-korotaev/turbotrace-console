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
