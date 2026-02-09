#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

type Problem = {
  numbers: number[];
  operation: string;
};

function transpose<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0) {
    return matrix;
  }
  const numColumns = matrix[0].length;
  if (!matrix.every((row) => row.length === numColumns)) {
    throw new Error(`Not a valid matrix`);
  }
  const result: T[][] = Array.from(Array(numColumns), () => []);
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < matrix[rowIndex].length; columnIndex++) {
      result[columnIndex][rowIndex] = matrix[rowIndex][columnIndex];
    }
  }
  return result;
}

function parsePart1(input: string): Problem[] {
  const allLines = input.split('\n').filter((line) => line.length > 0);
  const lines = allLines.slice(0, allLines.length - 1);
  const operationLine = allLines[allLines.length - 1];
  const operations = operationLine.split(' ').filter((operation) => operation.length > 0);
  const parsedNumberMatrix = lines.map((line) =>
    line
      .split(' ')
      .filter((value) => value.length > 0)
      .map((value) => Number(value)),
  );
  const numbers = transpose(parsedNumberMatrix);
  return numbers.map<Problem>((numbers, index) => ({ numbers, operation: operations[index] }));
}

function parsePart2(input: string): Problem[] {
  const allLines = input.split('\n').filter((line) => line.length > 0);
  const lineLength = allLines[0].length;
  if (!allLines.every((line) => line.length === lineLength)) {
    throw new Error(`All lines need to have the same length`);
  }
  const lines = allLines.slice(0, allLines.length - 1);
  const operationLine = allLines[allLines.length - 1];
  type ProblemInConstruction = Omit<Problem, 'operation'> & { operation?: string };
  const problemsInConstruction: ProblemInConstruction[] = [];
  let currentProblemInConstruction: ProblemInConstruction = { numbers: [] };
  for (let x = lineLength - 1; x >= 0; x--) {
    const charLine: string[] = [];
    for (let y = 0; y < lines.length; y++) {
      const char = lines[y][x];
      if (char !== ' ') {
        charLine.push(char);
      }
    }
    if (charLine.length > 0) {
      currentProblemInConstruction.numbers.push(Number(charLine.join('')));
      const operation = operationLine[x];
      if (operation != null) {
        currentProblemInConstruction.operation = operation;
      }
    }
    if (charLine.length === 0 || x === 0) {
      problemsInConstruction.push(currentProblemInConstruction);
      currentProblemInConstruction = { numbers: [] };
    }
  }
  return problemsInConstruction.map((p) => {
    if (p.operation == null) {
      throw new Error(`No operation found for numbers: ${p.numbers.join(', ')}`);
    }
    return {
      numbers: p.numbers,
      operation: p.operation,
    } satisfies Problem;
  });
}

function solve(problems: Problem[], part: number) {
  console.log('Problems:', problems);
  const invokeOperation = (a: number, b: number, operation: string) => {
    switch (operation) {
      case '*':
        return a * b;
      case '+':
        return a + b;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  };
  let result = 0;
  for (const problem of problems) {
    const answer = problem.numbers.reduce((acc, curr) => invokeOperation(acc, curr, problem.operation));
    result += answer;
  }
  console.log(`Part ${part}:`, result);
}

const input = readFileContent(Mode.PUZZLE_INPUT, 6);
const part1Problems = parsePart1(input);
solve(part1Problems, 1);
const part2Problems = parsePart2(input);
solve(part2Problems, 2);
