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

import { useEffect } from "react";
import type { ThemeFontFace, ThemeFonts } from "../config/theme-config";

const FONT_RESOURCE_ATTRIBUTE = "data-abzu-theme-font";
const DEFAULT_FONT_WEIGHT = 400;
const DEFAULT_FONT_STYLE = "normal";
const DEFAULT_FONT_DISPLAY = "swap";
const ABSOLUTE_URL_PATTERN = /^(https?:)?\/\//;
const LEADING_SLASH_PATTERN = /^\//;

const resolveUrl = (url: string): string =>
  ABSOLUTE_URL_PATTERN.test(url)
    ? url
    : `${import.meta.env.BASE_URL}${url.replace(LEADING_SLASH_PATTERN, "")}`;

const buildFontFaceRule = (face: ThemeFontFace): string => {
  const format = face.format ? ` format("${face.format}")` : "";
  const unicodeRange = face.unicodeRange
    ? `  unicode-range: ${face.unicodeRange};\n`
    : "";

  return (
    `@font-face {\n` +
    `  font-family: "${face.family}";\n` +
    `  src: url("${resolveUrl(face.src)}")${format};\n` +
    `  font-weight: ${face.weight ?? DEFAULT_FONT_WEIGHT};\n` +
    `  font-style: ${face.style ?? DEFAULT_FONT_STYLE};\n` +
    `  font-display: ${face.display ?? DEFAULT_FONT_DISPLAY};\n` +
    unicodeRange +
    `}`
  );
};

const createStylesheetLink = (href: string): HTMLLinkElement => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolveUrl(href);
  link.setAttribute(FONT_RESOURCE_ATTRIBUTE, "");
  return link;
};

const createFontFaceStyle = (faces: ThemeFontFace[]): HTMLStyleElement => {
  const style = document.createElement("style");
  style.textContent = faces.map(buildFontFaceRule).join("\n");
  style.setAttribute(FONT_RESOURCE_ATTRIBUTE, "");
  return style;
};

/**
 * Loads the active theme's font resources into <head> and removes them again
 * when the theme changes or the provider unmounts, so a runtime theme switch
 * never leaves the previous theme's fonts behind.
 */
export const useThemeFonts = (fonts?: ThemeFonts): void => {
  useEffect(() => {
    if (!fonts) return;

    const stylesheets = fonts.stylesheets ?? [];
    const faces = fonts.faces ?? [];

    const elements: HTMLElement[] = stylesheets.map(createStylesheetLink);
    if (faces.length > 0) {
      elements.push(createFontFaceStyle(faces));
    }

    elements.forEach((element) => document.head.appendChild(element));

    return () => elements.forEach((element) => element.remove());
  }, [fonts]);
};
