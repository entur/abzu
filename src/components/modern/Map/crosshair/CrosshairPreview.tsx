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
import React from "react";
import type { CrosshairSetting } from "./types";

const PREVIEW_SIZE = 22;
const PREVIEW_C = PREVIEW_SIZE / 2;
const PREVIEW_GAP = 4;
const PREVIEW_CIRCLE_R = 3;
const PREVIEW_DOT_R = 1.5;

interface PreviewSvgProps {
  type: CrosshairSetting;
  color: string;
  errorColor: string;
}

/** A small drawing of a crosshair style, for the picker. */
export const CrosshairPreview: React.FC<PreviewSvgProps> = ({
  type,
  color,
  errorColor,
}) => {
  const s = PREVIEW_SIZE;
  const c = PREVIEW_C;
  const g = PREVIEW_GAP;

  if (type === "none") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <line
          x1={c}
          y1={2}
          x2={c}
          y2={s - 2}
          stroke={color}
          strokeWidth={0.75}
          strokeDasharray="2,2"
          opacity={0.35}
        />
        <line
          x1={2}
          y1={c}
          x2={s - 2}
          y2={c}
          stroke={color}
          strokeWidth={0.75}
          strokeDasharray="2,2"
          opacity={0.35}
        />
        <line
          x1={4}
          y1={4}
          x2={s - 4}
          y2={s - 4}
          stroke={errorColor}
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {type === "classic" && (
        <>
          <line x1={c} y1={0} x2={c} y2={s} stroke={color} strokeWidth={0.75} />
          <line x1={0} y1={c} x2={s} y2={c} stroke={color} strokeWidth={0.75} />
        </>
      )}
      {(type === "dot" || type === "circle" || type === "gap") && (
        <>
          <line
            x1={c}
            y1={0}
            x2={c}
            y2={c - g}
            stroke={color}
            strokeWidth={0.75}
          />
          <line
            x1={c}
            y1={c + g}
            x2={c}
            y2={s}
            stroke={color}
            strokeWidth={0.75}
          />
          <line
            x1={0}
            y1={c}
            x2={c - g}
            y2={c}
            stroke={color}
            strokeWidth={0.75}
          />
          <line
            x1={c + g}
            y1={c}
            x2={s}
            y2={c}
            stroke={color}
            strokeWidth={0.75}
          />
        </>
      )}
      {type === "dot" && (
        <circle cx={c} cy={c} r={PREVIEW_DOT_R} fill={color} />
      )}
      {type === "circle" && (
        <circle
          cx={c}
          cy={c}
          r={PREVIEW_CIRCLE_R}
          fill="none"
          stroke={color}
          strokeWidth={0.75}
        />
      )}
    </svg>
  );
};
