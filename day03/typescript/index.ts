#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

function generic(banks: string[], numberOfDigits: number): number {
  type Digit = { index: number; digit: number };
  let result = 0;
  for (const bank of banks) {
    const foundDigits: Digit[] = [];
    for (let run = 0; run < numberOfDigits; run++) {
      const searchStart = foundDigits.length > 0 ? foundDigits[foundDigits.length - 1].index + 1 : 0;
      let biggest: Digit = { index: 0, digit: 0 };
      for (let index = searchStart; index < bank.length - (numberOfDigits - run) + 1; index++) {
        const digit = Number(bank[index]);
        if (digit > biggest.digit) {
          biggest = { index, digit };
        }
      }
      foundDigits.push(biggest);
    }
    const largestJolt = Number(foundDigits.reduce((acc, curr) => acc + String(curr.digit), ''));
    result += largestJolt;
  }
  return result;
}

function part1(banks: string[]) {
  const result = generic(banks, 2);
  console.log('Part 1:', result);
}

function part2(banks: string[]) {
  const result = generic(banks, 12);
  console.log('Part 2:', result);
}
const input = readFileContent(Mode.PUZZLE_INPUT, 3);
const banks = input.split('\n').filter((bank) => bank.length > 0);
part1(banks);
part2(banks);
