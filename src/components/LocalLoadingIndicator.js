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
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: (theme) => theme.zIndex.tooltip + 1,
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
