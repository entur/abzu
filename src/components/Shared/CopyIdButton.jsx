import ContentCopy from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { injectIntl } from "react-intl";

/**
 * A reusable button that copies a given text string to the clipboard.
 * It shows a "Copied!" message in a tooltip for user feedback.
 */
const CopyIdButton = ({
  idToCopy,
  intl,
  size = "small",
  style = {},
  color = "inherit", // Add the new color prop with a default
}) => {
  const [copied, setCopied] = useState(false);
  const { formatMessage } = intl;

  const handleCopy = (event) => {
    // Prevent the click from triggering actions on parent elements.
    event.stopPropagation();
    event.preventDefault();

    if (navigator.clipboard && idToCopy) {
      navigator.clipboard.writeText(idToCopy).then(() => {
        setCopied(true);
        // Reset the "Copied!" tooltip after 1.5 seconds.
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const translations = {
    copyId: formatMessage({ id: "copy_id" }),
    copied: formatMessage({ id: "copied" }),
  };

  return (
    <Tooltip
      title={copied ? translations.copied : translations.copyId}
      placement="top"
      onClose={() => setCopied(false)} // Reset if the user mouses away.
    >
      {/* This span prevents issues with the tooltip on a disabled button */}
      <span>
        <IconButton
          size={size}
          onClick={handleCopy}
          style={{ padding: 2, ...style }}
          disabled={!idToCopy} // Disable if there's no ID to copy.
        >
          {/* Apply the color to the icon's style */}
          <ContentCopy style={{ fontSize: "0.8em", color: color }} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

CopyIdButton.propTypes = {
  idToCopy: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  style: PropTypes.object,
  color: PropTypes.string, // Add prop type validation
};

export default injectIntl(CopyIdButton);
