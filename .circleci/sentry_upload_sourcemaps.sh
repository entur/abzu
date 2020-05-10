#!/bin/bash -ex

# Upload js source-maps to Entur's project at Sentry https://setry.io

imageTag=$1
token=$2
project=$3

# Create a new release
curl https://sentry.io/api/0/organizations/entur/releases/"${imageTag}"/ \
   -X POST \
   -H "Authorization: Bearer $token" \
   -H 'Content-Type: application/json' \
   -d '{/"projects/": ["$project"], "version": "$imageTag"}' \

# We need to upload both the $sourcemap and the source code (i.e. main.bundle.[hash].js and main.bundle.[hash].js.map)
for filename in $(ls ./build | grep .js); do
    curl https://sentry.io/api/0/projects/$project/releases/${imageTag}/files/ \
    -X POST \
    -H "Authorization: Bearer $token" \
    -F file=@"./build/$filename" \
    -F name="~/build/$filename"
done
