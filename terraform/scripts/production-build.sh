#!/bin/bash

shopt -s expand_aliases

cd $(dirname $0)
cd ../..
alias aws-npm="docker run --rm -v\"$(pwd)/:/app\" -w=\"/app\" --entrypoint=\"\" public.ecr.aws/lambda/nodejs:12 npm"

npm ci --ignore-scripts

npm ci --prefix packages/prisma
npm run prisma:generate --prefix packages/prisma
npm run build --prefix packages/prisma
rm -rf packages/prisma/node_modules

rm -f services/api/lambda.zip
npm ci --prefix services/api
npm run build --prefix services/api
aws-npm ci --only=production --prefix services/api --cache .npm --prefer-offline

rm -f services/site/lambda.zip
rm -rf services/site/.next
npm ci --prefix services/site
npm run build --prefix services/site
npm ci --only=production --prefix services/site

rm -f services/submission-checker/lambda.zip
npm ci --prefix services/submission-checker
npm run build --prefix services/submission-checker
npm ci --only=production --prefix services/submission-checker

rm -f services/submission-renderer/lambda.zip
npm ci --prefix services/submission-renderer
npm run build --prefix services/submission-renderer
npm ci --only=production --prefix services/submission-renderer
