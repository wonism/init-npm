#! /bin/bash

if mkdir "$1"; then
  cd "$1"
fi

git init
npm init -y
npx gitignore node

if [[ ! -z $(npm get init.license) && ! -z $(npm get init.author.name) ]]; then
  npx license $(npm get init.license) -o "$(npm get init.author.name)" > LICENSE
fi

if [ -z $(npm get init.author.email) ]; then
  npx covgen "$(npm get init.author.email)"
fi
