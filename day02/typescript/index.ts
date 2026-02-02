#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

type IDRange = {
  start: number;
  end: number;
};

function parseIdRanges(input: string): IDRange[] {
  return input.split(',').map((rangeString, index) => {
    const parts = rangeString.split('-');
    if (parts.length !== 2) {
      throw new Error(`[${index}] Expected 2 parts: ${rangeString}`);
    }
    const start = Number(parts[0]);
    if (isNaN(start) || !Number.isInteger(start)) {
      throw new Error(`[${index}] Wrong start number: ${start}`);
    }
    const end = Number(parts[1]);
    if (isNaN(end) || !Number.isInteger(end)) {
      throw new Error(`[${index}] Wrong end number: ${end}`);
    }
    if (start >= end) {
      throw new Error(`[${index}] start (${start}) must be < end ${end}`);
    }
    return { start, end } satisfies IDRange;
  });
}

function part1(idRanges: IDRange[]) {
  let result = 0;
  for (const idRange of idRanges) {
    for (let id = idRange.start; id <= idRange.end; id++) {
      if (Math.floor(Math.log10(id)) % 2 === 0) {
        continue;
      }
      const stringToTest = id.toString();
      const firstPart = stringToTest.substring(0, stringToTest.length / 2);
      const secondPart = stringToTest.substring(stringToTest.length / 2);
      if (firstPart === secondPart) {
        console.log('Invalid id:', stringToTest);
        result += id;
      }
    }
  }
  console.log('Part 1:', result);
}

function part2(idRanges: IDRange[]) {
  let result = 0;
  for (const idRange of idRanges) {
    for (let id = idRange.start; id <= idRange.end; id++) {
      const stringToTest = id.toString();
      if (id <= 1) {
        continue;
      }
      for (let j = 1; j < stringToTest.length; j++) {
        if (stringToTest.length % j !== 0) {
          continue;
        }
        const parts = Array(stringToTest.length / j)
          .fill(0)
          .map((_, index) => stringToTest.substring(index * j, (index * j) + j));
        let [firstPart, ...otherParts] = parts;
        if (otherParts.every((part) => part === firstPart)) {
          console.log('Invalid id:', stringToTest);
          result += id;
          break;
        }
      }
    }
  }
  console.log('Part 2:', result);
}
const input = readFileContent(Mode.PUZZLE_INPUT, 2);
const idRanges = parseIdRanges(input);
part1(idRanges);
part2(idRanges);
