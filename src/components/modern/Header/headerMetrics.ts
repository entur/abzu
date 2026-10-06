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

/**
 * The app chrome is the header toolbar plus the navigation line beneath it.
 *
 * Everything anchored below the chrome — the persistent map, the three editor
 * drawers, the minimized bars, the mobile search panel — has to agree on how
 * tall it is. Those offsets used to be hardcoded `64`s in nine places, so
 * changing the header meant finding all nine. They are defined once here
 * instead; `sm` is the breakpoint `useResponsive().isMobile` switches on.
 */
export const HEADER_HEIGHT_MOBILE = 56;
export const HEADER_HEIGHT_DESKTOP = 64;
export const NAVIGATION_LINE_HEIGHT = 40;

export const APP_CHROME_HEIGHT_MOBILE =
  HEADER_HEIGHT_MOBILE + NAVIGATION_LINE_HEIGHT;
export const APP_CHROME_HEIGHT_DESKTOP =
  HEADER_HEIGHT_DESKTOP + NAVIGATION_LINE_HEIGHT;

/** Responsive `top` for anything pinned directly below the app chrome. */
export const appChromeTop = {
  xs: APP_CHROME_HEIGHT_MOBILE,
  sm: APP_CHROME_HEIGHT_DESKTOP,
};

/** Responsive `height` for anything filling the space below the app chrome. */
export const belowAppChromeHeight = {
  xs: `calc(100% - ${APP_CHROME_HEIGHT_MOBILE}px)`,
  sm: `calc(100% - ${APP_CHROME_HEIGHT_DESKTOP}px)`,
};

/**
 * Responsive `height` for a page laid out against the viewport rather than a
 * positioned parent — the report page is the one that does this.
 */
export const belowAppChromeViewportHeight = {
  xs: `calc(100vh - ${APP_CHROME_HEIGHT_MOBILE}px)`,
  sm: `calc(100vh - ${APP_CHROME_HEIGHT_DESKTOP}px)`,
};

/**
 * Responsive `maxHeight` for a panel hanging off the bottom of the chrome that
 * must not run past the viewport, with a little breathing room at the bottom.
 */
const PANEL_BOTTOM_GAP = 16;

export const belowAppChromePanelMaxHeight = {
  xs: `calc(100vh - ${APP_CHROME_HEIGHT_MOBILE + PANEL_BOTTOM_GAP}px)`,
  sm: `calc(100vh - ${APP_CHROME_HEIGHT_DESKTOP + PANEL_BOTTOM_GAP}px)`,
};
