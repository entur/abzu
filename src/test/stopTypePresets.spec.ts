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

import { describe, expect, test } from "vitest";
import en from "../static/lang/en.json";
import fi from "../static/lang/fi.json";
import fr from "../static/lang/fr.json";
import nb from "../static/lang/nb.json";
import sv from "../static/lang/sv.json";
import {
  groupStopTypePresets,
  presetLabelId,
  STOP_TYPE_PRESETS,
} from "../components/modern/Shared/StopNameAndType/stopTypePresets";

const modesOf = (groups: ReturnType<typeof groupStopTypePresets>) =>
  groups.map((group) => group.transportMode);

describe("stop type presets (F-17)", () => {
  test("every base type a stop can have is offered without a submode", () => {
    const plainTypes = STOP_TYPE_PRESETS.filter((p) => !p.submode).map(
      (p) => p.stopPlaceType,
    );
    expect(plainTypes).toEqual([
      "onstreetBus",
      "busStation",
      "harbourPort",
      "ferryStop",
      "railStation",
      "onstreetTram",
      "metroStation",
      "airport",
      "liftStation",
      "funicular",
    ]);
  });

  test("presets are grouped by transport mode, in list order", () => {
    expect(modesOf(groupStopTypePresets([]))).toEqual([
      "bus",
      "water",
      "rail",
      "tram",
      "metro",
      "air",
      "cableway",
      "funicular",
    ]);
  });

  test("types the deployment hides are left out, and so is their group", () => {
    const groups = groupStopTypePresets(["airport", "liftStation"]);
    expect(modesOf(groups)).not.toContain("air");
    expect(modesOf(groups)).not.toContain("cableway");
  });

  test("a stop's current type that isn't a preset stays, first in its group", () => {
    const current = { stopPlaceType: "onstreetBus", submode: "schoolBus" };
    const bus = groupStopTypePresets([], current)[0];
    expect(bus.presets[0]).toEqual(current);
    // Bus: three bus-stop presets and the bus station, plus the kept type.
    expect(bus.presets).toHaveLength(5);
  });

  test("a current type that is a preset isn't listed twice", () => {
    const current = { stopPlaceType: "onstreetBus", submode: null };
    const bus = groupStopTypePresets([], current)[0];
    expect(
      bus.presets.filter(
        (p) => p.stopPlaceType === "onstreetBus" && p.submode === null,
      ),
    ).toHaveLength(1);
  });

  test("no type chosen yet adds nothing", () => {
    const groups = groupStopTypePresets([], {
      stopPlaceType: "",
      submode: null,
    });
    expect(groups.flatMap((g) => g.presets)).toHaveLength(
      STOP_TYPE_PRESETS.length,
    );
  });

  test("labels: the type's name, or the submode's name", () => {
    expect(presetLabelId({ stopPlaceType: "onstreetBus", submode: null })).toBe(
      "stopTypes_onstreetBus_name",
    );
    expect(
      presetLabelId({
        stopPlaceType: "onstreetBus",
        submode: "airportLinkBus",
      }),
    ).toBe("stopTypes_onstreetBus_submodes_airportLinkBus");
  });

  test.each(Object.entries({ en, nb, sv, fi, fr }))(
    "every preset and group has a %s label",
    (_locale, messages) => {
      const ids = groupStopTypePresets([]).flatMap((group) => [
        `transport_mode_${group.transportMode}`,
        ...group.presets.map(presetLabelId),
      ]);
      expect(ids.filter((id) => !(id in messages))).toEqual([]);
    },
  );
});
