import { Control, ControlPosition } from "leaflet";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";

interface CustomControlProps {
  position: ControlPosition;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CustomControl: React.FC<CustomControlProps> = ({
  position,
  children,
  className = "",
  style = {},
}) => {
  const map = useMap();
  const controlRef = useRef<Control | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const controlStyle = useMemo(
    () => ({
      backgroundColor: "white",
      padding: ".5rem",
      borderRadius: "4px",
      boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
      ...style,
    }),
    [style],
  );

  useEffect(() => {
    if (!map) return;

    const CustomLeafletControl = Control.extend({
      onAdd: function () {
        const div = document.createElement("div");
        div.className = `leaflet-control ${className}`;
        Object.assign(div.style, controlStyle);

        // Prevent map interactions when interacting with the control
        div.addEventListener("click", (e) => e.stopPropagation());
        div.addEventListener("mousewheel", (e) => e.stopPropagation());
        div.addEventListener("DOMMouseScroll", (e) => e.stopPropagation());
        div.addEventListener("touchstart", (e) => e.stopPropagation());

        setContainer(div);
        return div;
      },

      onRemove: function () {
        setContainer(null);
      },
    });

    const control = new CustomLeafletControl({ position });
    controlRef.current = control;
    map.addControl(control);

    return () => {
      if (controlRef.current && map) {
        try {
          map.removeControl(controlRef.current);
        } catch (error) {
          // Control might already be removed
          console.warn("Control removal failed:", error);
        }
        controlRef.current = null;
      }
      setContainer(null);
    };
  }, [map, position]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
};
