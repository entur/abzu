/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

/**
 * MapLibre 6 builds its worker URL at runtime from `import.meta.url`, which
 * Vite can't see, so the worker never reaches the build and every GeoJSON
 * layer (multimodal edges, path links, group polygons, zones) silently fails
 * to render (F-04). `?worker&url` makes Vite bundle the worker together with
 * its own imports (`maplibre-gl-shared.mjs`); a plain `?url` copy would 404 on
 * those. Passed to `<Map mapLib>`, this keeps MapLibre lazy-loaded and sets the
 * URL before the first map is created.
 */
export const maplibreLib = import("maplibre-gl").then((maplibre) => {
  maplibre.setWorkerUrl(maplibreWorkerUrl);
  return maplibre;
});
