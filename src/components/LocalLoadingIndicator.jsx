import { Box } from "@mui/material";
import { connect } from "react-redux";
import CustomLoadingAnimation from "./CustomLoadingAnimation";

const LocalLoadingIndicator = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CustomLoadingAnimation />
    </Box>
  );
};

const mapStateToProps = ({ loading }) => ({
  isLoading: loading.localIsLoading,
});

export default connect(mapStateToProps)(LocalLoadingIndicator);
