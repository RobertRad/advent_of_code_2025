#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

const TEST_CASE_COMMENT = ' ; ';

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

type ExpectedResult = { sum: number; zeroCount: number; jumpOverZeroes: number };

function solve(input: string, countJumpsAlso: boolean) {
  let currentNumber = 50;
  let countOfZeros = 0;
  let jumpOverZeroes = 0;
  input
    .split(/[\r\n]/)
    .filter((line) => line.trim().length > 0)
    .forEach((line, index) => {
      const directionString = line.substring(0, 1);
      const testCaseCommentIndex = line.indexOf(TEST_CASE_COMMENT);
      const hasTestCase = testCaseCommentIndex >= 0;
      let numberToChange = parseStrictNumber(line.substring(1, hasTestCase ? testCaseCommentIndex : undefined));
      let expectedResult: ExpectedResult | null = null;
      if (hasTestCase) {
        const expectedResultString = line.substring(testCaseCommentIndex + TEST_CASE_COMMENT.length);
        const expectedResultParts = expectedResultString.split(',');
        if (expectedResultParts.length != 3) {
          console.log(`Line ${expectedResult}: Cannot parse expected result`);
        } else {
          const [sum, zeroCount, jumpOverZeroes] = expectedResultParts.map(parseStrictNumber);
          expectedResult = { sum, zeroCount, jumpOverZeroes };
        }
      }
      let numberBefore = currentNumber;
      if (directionString === 'R') {
        while (numberToChange > 100) {
          numberToChange -= 100;
          jumpOverZeroes++;
        }
        currentNumber += numberToChange;
        while (currentNumber >= 100) {
          currentNumber -= 100;
          if (currentNumber !== 0 && numberBefore !== 0) {
            jumpOverZeroes++;
          }
        }
      } else if (directionString === 'L') {
        while (numberToChange > 100) {
          numberToChange -= 100;
          jumpOverZeroes++;
        }
        currentNumber -= numberToChange;
        if (currentNumber < 0) {
          currentNumber += 100;
          if (currentNumber != 0 && numberBefore != 0) {
            jumpOverZeroes++;
          }
        }
      } else {
        throw new Error('Wrong direction: ' + directionString);
      }
      if (currentNumber === 0) {
        countOfZeros++;
      }
      if (expectedResult) {
        if (
          currentNumber !== expectedResult.sum ||
          countOfZeros !== expectedResult.zeroCount ||
          jumpOverZeroes !== expectedResult.jumpOverZeroes
        ) {
          console.error(
            `Validation error: line ${index} - expected { ${expectedResult.sum}, ${expectedResult.zeroCount}, ${expectedResult.jumpOverZeroes} }, ` +
              `but was { ${currentNumber}, ${countOfZeros}, ${jumpOverZeroes} }.`,
          );
          return;
        }
      }
    });
  const result = countOfZeros + (countJumpsAlso ? jumpOverZeroes : 0);

  console.log('Solution is', result);
}

const input = readFileContent(Mode.PUZZLE_INPUT, 1);
solve(input, false);
solve(input, true);
