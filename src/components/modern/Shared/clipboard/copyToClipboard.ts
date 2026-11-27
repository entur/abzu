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
 * The older copy route for browsers and embedded webviews that refuse the
 * Clipboard API. Deprecated, but still the only fallback that works there.
 */
const copyWithSelection = (text: string): boolean => {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand?.("copy") ?? false;
  } catch {
    return false;
  } finally {
    textarea.remove();
    previouslyFocused?.focus();
  }
};

/**
 * Copies text and says whether it worked (F-44). Never throws: a refused
 * clipboard falls back to the selection copy, and if that fails too the
 * caller gets `false` and can tell the user.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithSelection(text);
  }
};
