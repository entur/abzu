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
import { resolveThemeAssetUrl } from "./resolveThemeAssetUrl";

const FAVICON_SELECTOR = "link[rel~='icon']";
const FAVICON_REL = "icon";

/**
 * Points the document favicon at the active theme's icon, restoring the previous
 * one when the theme changes, so switching themes at runtime does not leave the
 * old deployment's icon in the browser tab.
 */
export const useThemeFavicon = (favicon?: string): void => {
  useEffect(() => {
    if (!favicon) return;

    const existingLink =
      document.querySelector<HTMLLinkElement>(FAVICON_SELECTOR);
    const link = existingLink ?? document.createElement("link");
    const previousHref = existingLink?.getAttribute("href") ?? null;

    link.rel = FAVICON_REL;
    link.href = resolveThemeAssetUrl(favicon);

    if (!existingLink) document.head.appendChild(link);

    return () => {
      if (!existingLink) {
        link.remove();
        return;
      }
      if (previousHref === null) {
        existingLink.removeAttribute("href");
        return;
      }
      existingLink.setAttribute("href", previousHref);
    };
  }, [favicon]);
};
