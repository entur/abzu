import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useConfig } from "../../config/ConfigContext";
import { MatomoConfig } from "./types";

export const MatomoTracker = () => {
  const { matomo } = useConfig() as MatomoConfig;

  useEffect(() => {
    if (!matomo?.src) return;
    const w = window as unknown as Window & { _mtm: Record<string, unknown>[] };
    w._mtm = w._mtm || [];
    w._mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
  }, [matomo?.src]);

  return matomo?.src ? (
    <Helmet>
      <script src={matomo.src} async />
    </Helmet>
  ) : (
    <></>
  );
};
