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
const THEME_FAVICON_ATTRIBUTE = "data-abzu-theme-favicon";

/**
 * Points the document favicon at the active theme's icon.
 *
 * The previous icon links are detached and re-attached on cleanup, so a runtime
 * theme switch restores the document's original icon rather than leaving the
 * outgoing theme's behind. A fresh <link> is created rather than mutating the
 * existing one's href, because browsers may keep serving the cached icon when
 * only the attribute changes.
 */
export const useThemeFavicon = (favicon?: string): void => {
  useEffect(() => {
    if (!favicon) return;

    const replacedLinks = Array.from(
      document.querySelectorAll<HTMLLinkElement>(FAVICON_SELECTOR),
    );
    replacedLinks.forEach((link) => link.remove());

    const themeLink = document.createElement("link");
    themeLink.rel = FAVICON_REL;
    themeLink.href = resolveThemeAssetUrl(favicon);
    themeLink.setAttribute(THEME_FAVICON_ATTRIBUTE, "");
    document.head.appendChild(themeLink);

    return () => {
      themeLink.remove();
      replacedLinks.forEach((link) => document.head.appendChild(link));
    };
  }, [favicon]);
};
