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

import { afterEach, describe, expect, test, vi } from "vitest";
import { copyToClipboard } from "../components/modern/Shared/clipboard/copyToClipboard";

const setClipboard = (writeText: (text: string) => Promise<void>) =>
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });

const setExecCommand = (result: boolean | Error) => {
  const execCommand = vi.fn(() => {
    if (result instanceof Error) throw result;
    return result;
  });
  Object.defineProperty(document, "execCommand", {
    value: execCommand,
    configurable: true,
  });
  return execCommand;
};

describe("copyToClipboard (F-44)", () => {
  afterEach(() => vi.restoreAllMocks());

  test("uses the Clipboard API when it works", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    setClipboard(writeText);
    const execCommand = setExecCommand(true);

    expect(await copyToClipboard("NSR:StopPlace:1")).toBe(true);
    expect(writeText).toHaveBeenCalledWith("NSR:StopPlace:1");
    expect(execCommand).not.toHaveBeenCalled();
  });

  test("falls back to the selection copy when the clipboard is refused", async () => {
    setClipboard(() => Promise.reject(new Error("Write permission denied.")));
    const execCommand = setExecCommand(true);

    expect(await copyToClipboard("NSR:StopPlace:1")).toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
  });

  test("says false, without throwing, when both routes fail", async () => {
    setClipboard(() => Promise.reject(new Error("Write permission denied.")));
    setExecCommand(new Error("not allowed"));

    expect(await copyToClipboard("NSR:StopPlace:1")).toBe(false);
    expect(document.querySelector("textarea")).toBeNull();
  });
});
