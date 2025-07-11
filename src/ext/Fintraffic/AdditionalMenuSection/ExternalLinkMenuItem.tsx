import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuItem from "@mui/material/MenuItem";
import { useIntl } from "react-intl";

interface Props {
  href: string;
  localisationId: string;
}

const ExternalLinkMenuItem = ({ href, localisationId }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <MenuItem
      component={"a"}
      style={{
        fontSize: 12,
        padding: 0,
        paddingBottom: 5,
        paddingTop: 5,
        width: 300,
        paddingLeft: 5,
      }}
      href={href}
      target="_blank"
    >
      <OpenInNewIcon style={{ fontSize: "medium", paddingRight: 5 }} />

      {formatMessage({
        id: localisationId,
      })}
    </MenuItem>
  );
};

export default ExternalLinkMenuItem;
