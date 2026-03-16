#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

type JunctionBox = {
  id: number;
  x: number;
  y: number;
  z: number;
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

function calcDistance(a: JunctionBox, b: JunctionBox): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

function parseBoxes(input: string): JunctionBox[] {
  const lines = input.split('\n').filter((line) => line.length > 0);
  return lines.map((line, index) => {
    const parts = line.split(',');
    if (parts.length != 3) {
      throw new Error(`Wrong junction box at line ${index} ${line}`);
    }
    const numbers = parts.map(parseStrictNumber);
    return { id: index, x: numbers[0], y: numbers[1], z: numbers[2] } satisfies JunctionBox;
  });
}

function part1(boxes: JunctionBox[], mode: Mode) {
  const numberOfConnections = mode === Mode.TEST ? 10 : 1000;
  const distances: { fromId: number; toId: number; distance: number }[] = [];
  for (let aIndex = 0; aIndex < boxes.length; aIndex++) {
    for (let bIndex = aIndex + 1; bIndex < boxes.length; bIndex++) {
      const boxA = boxes[aIndex];
      const boxB = boxes[bIndex];
      const distance = calcDistance(boxes[aIndex], boxes[bIndex]);
      distances.push({ fromId: boxA.id, toId: boxB.id, distance });
    }
  }
  distances.sort((a, b) => a.distance - b.distance);
  const circuits: JunctionBox[][] = [];
  boxes.forEach((box) => circuits.push([box]));
  distances.slice(0, numberOfConnections).forEach((distance) => {
    const fromIndex = circuits.findIndex((circuit) => circuit.some((box) => box.id === distance.fromId));
    const toIndex = circuits.findIndex((circuit) => circuit.some((box) => box.id === distance.toId));
    if (fromIndex === toIndex) {
      return;
    }
    let targetIndex = fromIndex < toIndex ? fromIndex : toIndex;
    let sourceIndex = fromIndex < toIndex ? toIndex : fromIndex;
    circuits[targetIndex].splice(circuits[targetIndex].length, 0, ...circuits[sourceIndex]);
    circuits.splice(sourceIndex, 1);
  });
  const lengths = circuits
    .map((c) => c.length)
    .sort((a, b) => a - b)
    .reverse();
  console.log(lengths);
  const result = lengths.slice(0, 3).reduce((acc, curr) => acc * curr);
  console.log('Part 1:', result);
}

function part2(boxes: JunctionBox[]) {
  const distances: { fromId: number; toId: number; distance: number }[] = [];
  for (let aIndex = 0; aIndex < boxes.length; aIndex++) {
    for (let bIndex = aIndex + 1; bIndex < boxes.length; bIndex++) {
      const boxA = boxes[aIndex];
      const boxB = boxes[bIndex];
      const distance = calcDistance(boxes[aIndex], boxes[bIndex]);
      distances.push({ fromId: boxA.id, toId: boxB.id, distance });
    }
  }
  distances.sort((a, b) => a.distance - b.distance);
  const circuits: JunctionBox[][] = [];
  boxes.forEach((box) => circuits.push([box]));
  let done = false;
  distances.forEach((distance) => {
    if (done) {
      return;
    }
    const fromIndex = circuits.findIndex((circuit) => circuit.some((box) => box.id === distance.fromId));
    const toIndex = circuits.findIndex((circuit) => circuit.some((box) => box.id === distance.toId));
    if (fromIndex === toIndex) {
      return;
    }
    let targetIndex = fromIndex < toIndex ? fromIndex : toIndex;
    let sourceIndex = fromIndex < toIndex ? toIndex : fromIndex;
    circuits[targetIndex].splice(circuits[targetIndex].length, 0, ...circuits[sourceIndex]);
    circuits.splice(sourceIndex, 1);
    if (circuits.length === 1) {
      const from = circuits[0].find((c) => c.id === distance.fromId)!;
      const to = circuits[0].find((c) => c.id === distance.toId)!;
      console.log('Part 2: ', from.x * to.x);
      done = true;
    }
  });
}

const mode = Mode.PUZZLE_INPUT;
const input = readFileContent(mode, 8);
const boxes = parseBoxes(input);

part1(boxes, mode);
part2(boxes);
