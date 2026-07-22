#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import { Mode, readFileContent } from '../../utils/readFileContent.ts';

type Tile = {
  x: number;
  y: number;
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

function parseTiles(input: string): Tile[] {
  const lines = input
    .split('\n')
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith(';'));
  return lines.map((line) => {
    const parts = line.split(',');
    if (parts.length !== 2) {
      throw new Error(`Wrong line: ${line}`);
    }
    return { x: parseStrictNumber(parts[0]), y: parseStrictNumber(parts[1]) } satisfies Tile;
  });
}

function debugTiles(tiles: Tile[]) {
  const maxX = tiles.reduce((acc, tile) => Math.max(tile.x, acc), 0);
  const maxY = tiles.reduce((acc, tile) => Math.max(tile.y, acc), 0);
  for (let y = 0; y <= maxY; y++) {
    let line = '';
    for (let x = 0; x <= maxX; x++) {
      const found = !!tiles.find((tile) => tile.x === x && tile.y === y);
      line += found ? 'X' : '.';
    }
    console.log(line);
  }
}

function part1(tiles: Tile[]) {
  let biggestSquare: number = 0;
  const checkIfBigger = (a: Tile, b: Tile) => {
    if (a === b) {
      return;
    }
    const size = (Math.abs(a.y - b.y) + 1) * (Math.abs(a.x - b.x) + 1);
    if (size > biggestSquare) {
      biggestSquare = size;
    }
  };
  tiles.forEach((tile) => tiles.forEach((other) => checkIfBigger(tile, other)));
  console.log('Part 1:', biggestSquare);
}

enum Direction {
  TOP_DOWN = 'TOP_DOWN',
  LEFT_RIGHT = 'LEFT_RIGHT',
}

function part2(tiles: Tile[]) {
  // These maps are filled, while we draw the shape / hop from one tile to the next.
  // borderMapX while going LEFT <-> RIGHT
  // borderMapY while going TOP <-> DOWN
  // With this we have (all) the borders for every row / column.
  const borderMapXToYBorderConstruction = new Map<number, number[]>();
  const borderMapYToXBorderConstruction = new Map<number, number[]>();

  let direction: Direction;
  if (tiles[0].x === tiles[1].x) {
    direction = Direction.TOP_DOWN;
  } else if (tiles[0].y === tiles[1].y) {
    direction = Direction.LEFT_RIGHT;
  } else {
    throw new Error('First tiles do not match');
  }
  let hops = 0;
  for (let i = 0; i < tiles.length; i++) {
    hops++;
    const current = tiles[i];
    const next = i < tiles.length - 1 ? tiles[i + 1] : tiles[0];
    if (direction === Direction.TOP_DOWN) {
      const start = Math.min(current.y, next.y);
      const end = Math.max(current.y, next.y);
      for (let y = start; y <= end; y++) {
        const borderEntry = borderMapYToXBorderConstruction.get(y) || [];
        borderEntry.push(next.x);
        borderMapYToXBorderConstruction.set(y, borderEntry);
      }
      direction = Direction.LEFT_RIGHT;
    } else {
      const start = Math.min(current.x, next.x);
      const end = Math.max(current.x, next.x);
      for (let x = start; x <= end; x++) {
        const borderEntry = borderMapXToYBorderConstruction.get(x) || [];
        borderEntry.push(next.y);
        borderMapXToYBorderConstruction.set(x, borderEntry);
      }
      direction = Direction.TOP_DOWN;
    }
  }
  console.log('Hops:', hops);
  const buildRealMap = (borderMap: Map<number, number[]>) => {
    return new Map(
      [...borderMap.entries()].map(([key, value]) => [
        key,
        { lower: Math.min(...value), upper: Math.max(...value) },
      ]),
    );
  };

  const borderMapXToYBorder = buildRealMap(borderMapXToYBorderConstruction);
  const borderMapYToXBorder = buildRealMap(borderMapYToXBorderConstruction);
  // console.log('borderMapXToYBorder:', borderMapXToYBorder);
  // console.log('borderMapYToXBorder:', borderMapYToXBorder);

  const tileIsInBorders = (tile: Tile): boolean => {
    const yBorder = borderMapXToYBorder.get(tile.x);
    if (yBorder == null) {
      return false;
    }
    if (tile.y < yBorder.lower || tile.y > yBorder.upper) {
      return false;
    }
    const xBorder = borderMapYToXBorder.get(tile.y);
    if (xBorder == null) {
      return false;
    }
    if (tile.x < xBorder.lower || tile.x > xBorder.upper) {
      return false;
    }
    return true;
  };

  let biggestSquare: { a: Tile; b: Tile; size: number } | null = null;
  const checkIfBigger = (a: Tile, b: Tile) => {
    if (a === b) {
      return;
    }
    const size = (Math.abs(a.y - b.y) + 1) * (Math.abs(a.x - b.x) + 1);
    const isBigger = biggestSquare == null || size > biggestSquare.size;

    if (!isBigger) {
      return;
    }

    const opposingTile1: Tile = { x: a.x, y: b.y };
    const opposingTile2: Tile = { x: b.x, y: a.y };
    if (!tileIsInBorders(opposingTile1)) {
      return;
    }
    if (!tileIsInBorders(opposingTile2)) {
      return;
    }

    const minX = Math.min(opposingTile1.x, opposingTile2.x);
    const maxX = Math.max(opposingTile1.x, opposingTile2.x);
    const minY = Math.min(opposingTile1.y, opposingTile2.y);
    const maxY = Math.max(opposingTile1.y, opposingTile2.y);

    for (let x = minX; x < maxX; x++) {
      if (!tileIsInBorders({ x, y: minY } satisfies Tile)) {
        return;
      }
      if (!tileIsInBorders({ x, y: maxY } satisfies Tile)) {
        return;
      }
    }
    for (let y = minY; y < maxY; y++) {
      if (!tileIsInBorders({ x: minX, y } satisfies Tile)) {
        return;
      }
      if (!tileIsInBorders({ x: maxX, y } satisfies Tile)) {
        return;
      }
    }
    biggestSquare = { a, b, size };
  };
  tiles.forEach((tile) => tiles.forEach((other) => checkIfBigger(tile, other)));
  console.log('Biggest square:', biggestSquare!.a, '&', biggestSquare!.b);
  console.log('Part 2:', biggestSquare!.size);
}

// Problem, map is shaped like this:
//
// .XXX..XXX.
// .X.XXXX.X.
// .X......X.
// .X..XXX.X.
// .XXXX.XXX.
// So, using xBorder.lower & border.upper is not sufficient

// See "Mode.OWN_TEST" for more info.
const input = readFileContent(Mode.PUZZLE_INPUT, 9);
const tiles = parseTiles(input);
part1(tiles);
part2(tiles);
