#!/bin/sh
set -e

cd /usr/app

# Install deps inside docker volume
yarn install

# Run Nest in watch mode
nest start --watch