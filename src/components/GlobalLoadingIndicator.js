import { Backdrop, CircularProgress } from "@mui/material";
import { connect } from "react-redux";

const GlobalLoadingIndicator = ({ isLoading }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

const mapStateToProps = ({ loading }) => ({
  isLoading: loading.globalIsLoading,
});

export default connect(mapStateToProps)(GlobalLoadingIndicator);
