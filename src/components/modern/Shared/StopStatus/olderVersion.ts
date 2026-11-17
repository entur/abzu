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

interface VersionedStop {
  version?: string | number | null;
  isChildOfParent?: boolean;
}

interface ClientVersion {
  version: string | number;
}

/**
 * True when a newer version of the loaded stop exists. `versions` is empty
 * after a normal load, so only a version picked in the versions dialog can
 * be "older". Child stops are versioned through their parent, so they never
 * count (same rule as legacy getIsCurrentVersionMax).
 *
 * Compared as numbers against the newest listed version, not for equality
 * with the first entry: Tiamat's version list for a multimodal stop leaves
 * out versions without children, so a just-deactivated multimodal stop
 * (newer than every listed version) was shown as an older version, with no
 * expired banner and no actions.
 */
export const isOlderVersion = (
  stop: VersionedStop | null | undefined,
  versions: ClientVersion[] | null | undefined,
): boolean => {
  if (!stop || stop.isChildOfParent || stop.version == null) return false;
  if (!versions?.length) return false;
  const newestListedVersion = Math.max(
    ...versions.map(({ version }) => Number(version)),
  );
  return Number(stop.version) < newestListedVersion;
};
