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

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface HeaderSlotContextValue {
  slotContent: ReactNode;
  setSlotContent: (content: ReactNode) => void;
}

const HeaderSlotContext = createContext<HeaderSlotContextValue>({
  slotContent: null,
  setSlotContent: () => {},
});

/**
 * Wrap the application root so both the header and page components
 * can access the shared slot state.
 */
export const HeaderSlotProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [slotContent, setSlotContent] = useState<ReactNode>(null);

  return (
    <HeaderSlotContext.Provider value={{ slotContent, setSlotContent }}>
      {children}
    </HeaderSlotContext.Provider>
  );
};

/**
 * Used by ModernHeader to render whatever the active page has registered.
 * Returns null when no page has claimed the slot (falls back to HeaderSearch).
 */
export const useHeaderSlotContent = (): ReactNode => {
  return useContext(HeaderSlotContext).slotContent;
};

/**
 * Used by page components to inject content into the header center slot.
 * The content is cleared automatically when the component unmounts.
 *
 * Pass every value that the content depends on as deps — same contract as useEffect.
 *
 * @example
 * useHeaderSlot(
 *   <ReportSearchBar searchQuery={q} onSearch={handleSearch} />,
 *   [q, handleSearch],
 * );
 */
export const useHeaderSlot = (
  content: ReactNode,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  deps: React.DependencyList,
): void => {
  const { setSlotContent } = useContext(HeaderSlotContext);

  useEffect(() => {
    setSlotContent(content);
    return () => setSlotContent(null);
    // Intentionally passing caller-controlled deps, not content directly,
    // to avoid recreating the effect on every JSX reference change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
