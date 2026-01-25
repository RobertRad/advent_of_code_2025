import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export enum Mode {
  PUZZLE_INPUT,
  TEST,
  OWN_TEST,
}

export function readFileContent(mode: Mode, day: number): string {
  if (day < 1 || day >= 13) {
    throw new Error('Invalid day');
  }
  if (!Number.isInteger(day)) {
    throw new Error('Day must be an integer');
  }
  const fileName = mode === Mode.PUZZLE_INPUT ? 'input.txt' : mode === Mode.TEST ? 'test.txt' : 'own_test.txt';
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const file = resolve(scriptDir, '..', 'day' + String(day).padStart(2, '0'), fileName);
  return readFileSync(file, 'utf8');
}

