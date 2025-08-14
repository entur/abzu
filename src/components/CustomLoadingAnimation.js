import { Box, Typography } from "@mui/material";
import { injectIntl } from "react-intl";

const CustomLoadingAnimation = ({ intl }) => {
  const { formatMessage } = intl;

  const dotKeyframes = {
    "@keyframes pulse": {
      "0%, 100%": {
        opacity: 0.2,
      },
      "50%": {
        opacity: 1,
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        padding: (theme) => theme.spacing(2, 4),
        marginBottom: (theme) => theme.spacing(2),
        borderRadius: (theme) => theme.shape.borderRadius,
        boxShadow: (theme) => theme.shadows[6],
        display: "flex",
        alignItems: "flex-end",
        ...dotKeyframes,
      }}
    >
      <Typography
        variant="h5"
        component="span"
        sx={{
          fontWeight: "bold",
          color: "text.primary",
        }}
      >
        {formatMessage({ id: "loading_data" })}
      </Typography>
      {[0, 1, 2].map((i) => (
        <Typography
          key={i}
          variant="h5"
          component="span"
          sx={{
            fontWeight: "bold",
            animation: "pulse 1.5s infinite",
            animationDelay: `${i * 0.25}s`,
          }}
        >
          .
        </Typography>
      ))}
    </Box>
  );
};

export default injectIntl(CustomLoadingAnimation);
