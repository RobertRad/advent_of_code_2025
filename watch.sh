#!/usr/bin/bash

if [ -z $1 ]; then
  echo "Argument needed: Day number"
  exit 1
fi

day=$1
if [ ${#day} == 1 ]; then
  day="0${day}"
fi

if [ ! -f "./day${day}/typescript/index.ts" ]; then
  echo "Cannot find typescript/index.ts in day${day}"
  exit 1
fi

nodemon -L -w ./day${day} -e "ts txt" --exec "./day${day}/typescript/index.ts"
