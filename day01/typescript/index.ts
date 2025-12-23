#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning

function someFunc(input: string) {
  console.log(input);
}

someFunc('Day 1');

