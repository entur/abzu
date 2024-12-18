import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ToolTippable = ({ children, toolTipText, toolTipStyle }) => {
  const [showToolTip, setShowToolTip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef(null);

  const handleShowToolTip = () => setShowToolTip(true);
  const handleHideToolTip = () => setShowToolTip(false);

  useEffect(() => {
    if (childRef.current) {
      const { top, left, height } = childRef.current.getBoundingClientRect();
      // Set the tooltip position just below the child element, relative to the viewport
      setPosition({ top: top + height + 8, left });
    }
  }, [showToolTip]); // Re-calculate position on tooltip show/hide

  const defaultStyle = {
    background: "#595959",
    padding: "5px 8px",
    fontSize: 12,
    zIndex: 999999,
    color: "#fff",
    borderRadius: "4px",
    position: "fixed",
    top: position.top,
    left: position.left,
    whiteSpace: "nowrap",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const appliedStyle = { ...defaultStyle, ...toolTipStyle };

  const tooltipElement = showToolTip ? (
    <span style={appliedStyle}>{toolTipText}</span>
  ) : null;

  return (
    <div
      onMouseEnter={handleShowToolTip}
      onMouseLeave={handleHideToolTip}
      style={{ position: "relative", display: "inline-block" }} // Ensures correct positioning
    >
      <div ref={childRef}>{children}</div>
      {createPortal(tooltipElement, document.body)}
    </div>
  );
};

ToolTippable.propTypes = {
  toolTipText: PropTypes.string.isRequired,
  toolTipStyle: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default ToolTippable;
