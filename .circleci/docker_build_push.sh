#!/bin/bash

set -euo pipefail

CLOUDSDK_CORE_PROJECT="entur-system-1287"

IMAGE="eu.gcr.io/${CLOUDSDK_CORE_PROJECT}/${CIRCLE_PROJECT_REPONAME}${IMAGE_POSTFIX:-}"
echo "Image: ${IMAGE}"

eval "docker build -t ${IMAGE} ${BUILD_ARGS:-} ."

docker tag "${IMAGE}" "${IMAGE}":"${CIRCLE_SHA1}"
docker push "${IMAGE}"