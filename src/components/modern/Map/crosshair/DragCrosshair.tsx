import { useTheme } from "@mui/material/styles";
import React from "react";
import type { CrosshairType } from "./types";

const SIZE = 60;
const C = SIZE / 2;
const ARM_GAP = 10;
const DOT_RADIUS = 3;
const CIRCLE_RADIUS = 8;

interface DragCrosshairProps {
  type: CrosshairType;
}

export const DragCrosshair: React.FC<DragCrosshairProps> = ({ type }) => {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ pointerEvents: "none", display: "block", overflow: "visible" }}
    >
      <defs>
        <filter
          id="drag-crosshair-halo"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feMorphology
            operator="dilate"
            radius={2}
            in="SourceAlpha"
            result="expanded"
          />
          <feFlood floodColor="white" result="flood" />
          <feComposite in="flood" in2="expanded" operator="in" result="halo" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        filter="url(#drag-crosshair-halo)"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        {renderShape(type, color)}
      </g>
    </svg>
  );
};

function renderShape(type: CrosshairType, color: string): React.ReactNode {
  switch (type) {
    case "classic":
      return (
        <>
          <line x1={C} y1={0} x2={C} y2={SIZE} fill="none" />
          <line x1={0} y1={C} x2={SIZE} y2={C} fill="none" />
        </>
      );

    case "dot":
      return (
        <>
          <line x1={C} y1={0} x2={C} y2={C - ARM_GAP} fill="none" />
          <line x1={C} y1={C + ARM_GAP} x2={C} y2={SIZE} fill="none" />
          <line x1={0} y1={C} x2={C - ARM_GAP} y2={C} fill="none" />
          <line x1={C + ARM_GAP} y1={C} x2={SIZE} y2={C} fill="none" />
          <circle cx={C} cy={C} r={DOT_RADIUS} fill={color} stroke="none" />
        </>
      );

    case "circle":
      return (
        <>
          <line x1={C} y1={0} x2={C} y2={C - CIRCLE_RADIUS - 2} fill="none" />
          <line
            x1={C}
            y1={C + CIRCLE_RADIUS + 2}
            x2={C}
            y2={SIZE}
            fill="none"
          />
          <line x1={0} y1={C} x2={C - CIRCLE_RADIUS - 2} y2={C} fill="none" />
          <line
            x1={C + CIRCLE_RADIUS + 2}
            y1={C}
            x2={SIZE}
            y2={C}
            fill="none"
          />
          <circle cx={C} cy={C} r={CIRCLE_RADIUS} fill="none" />
        </>
      );

    case "gap":
      return (
        <>
          <line x1={C} y1={0} x2={C} y2={C - ARM_GAP} fill="none" />
          <line x1={C} y1={C + ARM_GAP} x2={C} y2={SIZE} fill="none" />
          <line x1={0} y1={C} x2={C - ARM_GAP} y2={C} fill="none" />
          <line x1={C + ARM_GAP} y1={C} x2={SIZE} y2={C} fill="none" />
        </>
      );
  }
}
