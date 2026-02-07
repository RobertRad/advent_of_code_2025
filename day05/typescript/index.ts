#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

type Range = {
  start: number;
  end: number;
};

type Inventory = {
  freshIngredients: Range[];
  availableIngredients: number[];
};

function parseStrictNumber(value: string): number {
  if (typeof value === 'string' && value.trim() === '') {
    throw new Error('Not a number');
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error('Not a number');
  }
  return num;
}

function parseInventory(input: string): Inventory {
  let lines = input.split('\n');
  while (lines[0].length === 0) {
    lines.shift();
  }
  while (lines[lines.length - 1].length === 0) {
    lines.pop();
  }
  const emptyIndex = lines.findIndex((line) => line.length === 0);
  if (emptyIndex < 0) {
    throw new Error(`No separator found!`);
  }
  if (lines.findLastIndex((line) => line.length === 0) !== emptyIndex) {
    throw new Error(`More than 1 separator found!`);
  }
  const freshLines = lines.slice(0, emptyIndex);
  if (freshLines.length === 0) {
    throw new Error(`No fresh ingredients found!`);
  }
  const availableLines = lines.slice(emptyIndex + 1);
  if (availableLines.length === 0) {
    throw new Error(`No available ingredients found!`);
  }
  const freshIngredients = freshLines.map((fl) => {
    const split = fl.split('-');
    if (split.length !== 2) {
      throw new Error(`Cannot parse fresh ingredient: ${fl}`);
    }
    return { start: parseStrictNumber(split[0]), end: parseStrictNumber(split[1]) } satisfies Range;
  });
  const availableIngredients = availableLines.map((al) => parseStrictNumber(al));
  return { freshIngredients, availableIngredients };
}

function part1(inventory: Inventory) {
  let result = 0;
  for (const available of inventory.availableIngredients) {
    for (const range of inventory.freshIngredients) {
      if (available >= range.start && available <= range.end) {
        result++;
        break;
      }
    }
  }
  console.log('Part 1:', result);
}

function part2(inventory: Inventory) {
  const sortedRanges = inventory.freshIngredients.sort((a, b) => a.start - b.start);
  const mergedRanges = sortedRanges.reduce<Range[]>((acc, curr) => {
    const last = acc.pop();
    if (last == null) {
      acc.push(curr);
      return acc;
    }
    if (last.end < curr.start - 1) {
      acc.push(last);
      acc.push(curr);
    } else {
      const mergedRange = { start: last.start, end: Math.max(last.end, curr.end) };
      acc.push(mergedRange);
    }
    return acc;
  }, []);
  const result = mergedRanges.reduce((acc, curr) => acc + curr.end - curr.start + 1, 0);
  console.log('Part 2:', result);
}

const input = readFileContent(Mode.PUZZLE_INPUT, 5);
const inventory = parseInventory(input);
part1(inventory);
part2(inventory);
