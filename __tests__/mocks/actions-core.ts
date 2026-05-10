import path from 'path';

export function getInput(name: string): string {
  return process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
}

export function addPath(inputPath: string): void {
  process.env.PATH = `${inputPath}${path.delimiter}${process.env.PATH || ''}`;
}

export function debug(message: string): void {
  void message;
}

export function info(message: string): void {
  void message;
}
