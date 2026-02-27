#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

enum Tile {
  START = 'S',
  EMPTY = '.',
  SPLITTER = '^',
  BEAM = '|',
}

function parseTile(char: string): Tile {
  switch (char) {
    case 'S':
      return Tile.START;
    case '.':
      return Tile.EMPTY;
    case '^':
      return Tile.SPLITTER;
    case '|':
      return Tile.BEAM;
    default:
      throw new Error(`Unknown tile: '${char}'`);
  }
}

type Diagram = Tile[][];

function parseDiagram(input: string): Diagram {
  const lines = input.split('\n').filter((line) => line.length > 0);
  if (lines.length === 0) {
    throw new Error(`No lines found`);
  }
  const lineLength = lines[0].length;
  if (!lines.every((line) => line.length === lineLength)) {
    throw new Error(`All lines should have same length`);
  }
  return lines.map((line) => line.split('').map(parseTile));
}

function part1(diagram: Diagram) {
  let result = 0;
  const workingCopy = structuredClone(diagram);
  for (let y = 0; y < workingCopy.length - 1; y++) {
    for (let x = 0; x < workingCopy[y].length; x++) {
      const below = workingCopy[y + 1][x];
      const isBeam = [Tile.START, Tile.BEAM].includes(workingCopy[y][x]);
      if (isBeam && below === Tile.EMPTY) {
        workingCopy[y + 1][x] = Tile.BEAM;
      }
      if (isBeam && below === Tile.SPLITTER) {
        result++;
        workingCopy[y + 1][x - 1] = Tile.BEAM;
        workingCopy[y + 1][x + 1] = Tile.BEAM;
      }
    }
  }
  console.log('Part 1:', result);
}

function part2(diagram: Diagram) {
  const map = new Map<number, number>();
  for (let y = diagram.length - 1; y > 0; y--) {
    for (let x = 0; x < diagram[y].length; x++) {
      if (diagram[y][x] === Tile.SPLITTER) {
        const numLeftPaths = map.get(x - 1) ?? 1;
        const numRightPaths = map.get(x + 1) ?? 1;
        map.set(x, numLeftPaths + numRightPaths);
      }
    }
  }
  let result: number | null = null;
  for (let x = 0; x < diagram[0].length; x++) {
    if (diagram[0][x] === Tile.START) {
      const numLeftPaths = map.get(x - 1) ?? 1;
      const numRightPaths = map.get(x + 1) ?? 1;
      result = numLeftPaths + numRightPaths;
    }
  }
  if (result == null) {
    throw new Error('No result found!');
  }
  console.log('Part 2:', result);
}

const input = readFileContent(Mode.PUZZLE_INPUT, 7);
const diagram = parseDiagram(input);
part1(diagram);
part2(diagram);
