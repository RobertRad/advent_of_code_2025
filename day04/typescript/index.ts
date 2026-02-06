#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

function parseMap(input: string): boolean[][] {
  const lines = input.split('\n').filter((line) => line.length > 0);
  if (lines.length === 0) {
    throw new Error(`No lines found`);
  }
  const lineLength = lines[0].length;
  if (!lines.every((line) => line.length === lineLength)) {
    throw new Error(`All lines should have same length`);
  }
  return lines.map((line) => line.split('').map((char) => (char === '@' ? true : false)));
}

function getNeighbors(map: boolean[][], x: number, y: number): boolean[] {
  function n(xPos: number, yPos: number): boolean {
    const line = map[yPos] ?? [];
    const value = line[xPos];
    return value;
  }
  return [
    n(x - 1, y - 1),
    n(x, y - 1),
    n(x + 1, y - 1),
    n(x - 1, y),
    n(x + 1, y),
    n(x - 1, y + 1),
    n(x, y + 1),
    n(x + 1, y + 1),
  ].filter((value) => value != null);
}

function part1(map: boolean[][]) {
  let result = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x]) {
        const neighbors = getNeighbors(map, x, y);
        if (neighbors.filter((n) => n).length < 4) {
          result++;
        }
      }
    }
  }
  console.log('Part 1:', result);
}

function removeMoveablePaperrolls(map: boolean[][]): boolean[][] {
  const newMap: boolean[][] = [];
  for (let y = 0; y < map.length; y++) {
    const newLine: boolean[] = [];
    for (let x = 0; x < map[y].length; x++) {
      let newValue = map[y][x];
      if (map[y][x]) {
        const neighbors = getNeighbors(map, x, y);
        if (neighbors.filter((n) => n).length < 4) {
          newValue = false;
        }
      }
      newLine.push(newValue);
    }
    newMap.push(newLine);
  }
  return newMap;
}

function countPaperRolls(map: boolean[][]): number {
  return map.flatMap((line) => line.map((value) => (value ? 1 : 0))).reduce<number>((acc, curr) => acc + curr, 0);
}

function part2(map: boolean[][]) {
  let currentMap = map;
  const initialNumberOfRolls = countPaperRolls(map);
  let lastNumberOfRolls = initialNumberOfRolls;
  do {
    lastNumberOfRolls = countPaperRolls(currentMap);
    currentMap = removeMoveablePaperrolls(currentMap);
  } while (countPaperRolls(currentMap) < lastNumberOfRolls);
  const result = initialNumberOfRolls - countPaperRolls(currentMap);
  console.log('Part 2:', result);
}

const input = readFileContent(Mode.PUZZLE_INPUT, 4);
const map = parseMap(input);
part1(map);
part2(map);
